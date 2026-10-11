"""HTTP for the checks: plain urllib (no browser, no JavaScript), optional proxy, recorded redirect chain, on-disk cache.

Every request is a single GET or POST with a desktop Chrome User-Agent. Nothing is signed, no logins, no CAPTCHA solving.
Immutable sources (a file at a pinned commit, a Wayback Machine snapshot) are cached forever under research/.cache;
everything else is cached for --max-age seconds (default 12 h) so that re-running a script does not hit the sites again.
"""
import gzip, hashlib, json, os, re, shutil, ssl, subprocess, tempfile, time, urllib.error, urllib.request, zlib
from collections import OrderedDict
from datetime import datetime, timezone

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
# The Wayback Machine treats a browser User-Agent without a browser as abusive bot traffic (HTTP 429); identify honestly.
ARCHIVE_UA = "pi-restrict-research/1.0 (reproducible research; +https://restricted.cp0x.com/methodology)"
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE_DIR = os.path.join(HERE, ".cache", "http")
MAX_AGE = 12 * 3600


def now_iso():
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


class _Recorder(urllib.request.HTTPRedirectHandler):
    def __init__(self):
        self.chain = []

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        self.chain.append({"status": code, "location": newurl})
        # Python < 3.11 does not follow 308 (permanent redirect); it means the same as 307 here.
        return super().redirect_request(req, fp, 307 if code == 308 else code, msg, headers, newurl)

    http_error_308 = urllib.request.HTTPRedirectHandler.http_error_302


def _decode(body, headers):
    enc = (headers.get("content-encoding") or "").lower()
    try:
        if enc == "gzip":
            return gzip.decompress(body)
        if enc == "deflate":
            return zlib.decompress(body)
    except Exception:  # noqa: BLE001 - keep the raw bytes if the server lied about the encoding
        pass
    return body


def _cache_key(method, url, body, proxy):
    h = hashlib.sha256(f"{method} {url}\n{body or ''}\n{proxy or ''}".encode()).hexdigest()
    return os.path.join(CACHE_DIR, h[:2], h)


def _load_cache(key, max_age):
    meta_path = key + ".json"
    if not os.path.exists(meta_path):
        return None
    with open(meta_path, encoding="utf-8") as fh:
        meta = json.load(fh, object_pairs_hook=OrderedDict)
    if max_age != "forever" and time.time() - meta.get("_ts", 0) > max_age:
        return None
    with open(key + ".body", "rb") as fh:
        meta["body"] = fh.read()
    meta["from_cache"] = True
    return meta


def _save_cache(key, r):
    os.makedirs(os.path.dirname(key), exist_ok=True)
    meta = OrderedDict((k, v) for k, v in r.items() if k != "body")
    meta["_ts"] = time.time()
    with open(key + ".json", "w", encoding="utf-8") as fh:
        json.dump(meta, fh, ensure_ascii=False, indent=1)
    with open(key + ".body", "wb") as fh:
        fh.write(r["body"])


def fetch(url, method="GET", body=None, headers=None, proxy=None, timeout=40, max_bytes=25_000_000, cache=MAX_AGE,
          _insecure=False, _attempt=0):
    """One HTTP request. Returns an OrderedDict: url, method, status, final_url, headers, body (bytes), redirects,
    error, ms, at, sha256, tls_unverified, from_cache. cache: None (always fetch), "forever" or max age in seconds.
    If the local certificate store cannot verify the chain (common with the macOS system Python), the request is
    retried once without verification and the result says tls_unverified=True. HTTP 429/503 from the Wayback Machine are
    retried up to 3 times.
    Only answers below HTTP 400 are cached."""
    data = None
    ua = ARCHIVE_UA if re.match(r"^https?://web\.archive\.org/", url) else UA
    hdrs = {"User-Agent": ua, "Accept": "text/html,application/json;q=0.9,*/*;q=0.8", "Accept-Language": "en-US,en;q=0.8"}
    hdrs.update(headers or {})
    if body is not None:
        data = body if isinstance(body, bytes) else (json.dumps(body) if not isinstance(body, str) else body).encode()
        hdrs.setdefault("Content-Type", "application/json")
    key = _cache_key(method, url, data.decode() if data else None, proxy)
    if cache is not None and not _insecure:
        hit = _load_cache(key, cache)
        if hit is not None:
            return hit

    redirect = _Recorder()
    handlers = [urllib.request.ProxyHandler({"http": proxy, "https": proxy} if proxy else {}), redirect]
    if _insecure:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        handlers.append(urllib.request.HTTPSHandler(context=ctx))
    opener = urllib.request.build_opener(*handlers)
    req = urllib.request.Request(url, data=data, method=method, headers=hdrs)
    out = OrderedDict(url=url, method=method, status=None, final_url=url, headers={}, body=b"", redirects=[], error=None,
                      ms=None, at=now_iso(), sha256=None, tls_unverified=_insecure, from_cache=False)
    t0 = time.time()
    try:
        with opener.open(req, timeout=timeout) as r:
            out["status"] = r.status
            out["final_url"] = r.geturl()
            out["headers"] = {k.lower(): v for k, v in r.headers.items()}
            out["body"] = r.read(max_bytes)
    except urllib.error.HTTPError as e:
        out["status"] = e.code
        out["final_url"] = e.geturl() if hasattr(e, "geturl") else url
        out["headers"] = {k.lower(): v for k, v in (e.headers.items() if e.headers else [])}
        try:
            out["body"] = e.read(max_bytes)
        except Exception:  # noqa: BLE001
            out["body"] = b""
    except Exception as e:  # noqa: BLE001 - a transport failure is a result too
        if not _insecure and "CERTIFICATE_VERIFY_FAILED" in str(e):
            return fetch(url, method, body, headers, proxy, timeout, max_bytes, cache, True, _attempt)
        if re.search(r"PROTOCOL_VERSION|UNSUPPORTED_PROTOCOL|WRONG_VERSION_NUMBER|SSLV3_ALERT_HANDSHAKE_FAILURE", str(e)) and shutil.which("curl"):
            # The macOS system Python is linked against LibreSSL without TLS 1.3; some sites accept nothing else.
            # The same single request is then made by curl (present on every Mac and Linux), and the result says so.
            out = _curl(url, method, data, hdrs, proxy, timeout, max_bytes, out)
            if cache is not None and not out["error"] and out["status"] and out["status"] < 400:
                _save_cache(key, out)
            return out
        out["error"] = f"{type(e).__name__}: {str(e)[:200]}"
    out["ms"] = int((time.time() - t0) * 1000)
    out["redirects"] = redirect.chain
    out["body"] = _decode(out["body"], out["headers"])
    out["sha256"] = hashlib.sha256(out["body"]).hexdigest() if out["body"] else None
    if out["status"] in (429, 503) and _attempt < 3 and ua == ARCHIVE_UA:
        # The Wayback Machine rate-limits: wait as asked, at most a minute, and try again. Other sites are not retried
        # (a missing chunk on some CDNs answers 503, and an anti-bot 429 does not go away by waiting).
        try:
            wait = min(60, int(out["headers"].get("retry-after", "")))
        except ValueError:
            wait = 10 * (_attempt + 1)
        time.sleep(wait)
        return fetch(url, method, body, headers, proxy, timeout, max_bytes, cache, _insecure, _attempt + 1)
    if cache is not None and not out["error"] and out["status"] and out["status"] < 400:
        _save_cache(key, out)
    return out


def _curl(url, method, data, hdrs, proxy, timeout, max_bytes, out):
    """One request with the curl binary: same headers, redirects followed and recorded, body capped at max_bytes."""
    t0 = time.time()
    with tempfile.TemporaryDirectory() as tmp:
        hfile, bfile = os.path.join(tmp, "h"), os.path.join(tmp, "b")
        cmd = ["curl", "-sS", "-L", "--max-redirs", "10", "--max-time", str(int(timeout)), "-X", method, "-D", hfile, "-o", bfile,
               "-w", "%{http_code} %{url_effective}", "--max-filesize", str(max_bytes)]
        for k, v in hdrs.items():
            cmd += ["-H", f"{k}: {v}"]
        if proxy:
            cmd += ["-x", proxy]
        if data:
            cmd += ["--data-binary", "@-"]
        p = subprocess.run(cmd + [url], input=data, capture_output=True, timeout=timeout + 10)
        if p.returncode != 0 and not os.path.exists(bfile):
            out["error"] = f"curl: {p.stderr.decode('utf-8', 'replace').strip()[:200]}"
        else:
            code, _, final = p.stdout.decode().partition(" ")
            out["status"], out["final_url"] = int(code or 0) or None, final or url
            blocks = [b for b in open(hfile, encoding="latin-1").read().split("\r\n\r\n") if b.strip()] if os.path.exists(hfile) else []
            for b in blocks[:-1]:
                st = re.match(r"HTTP/\S+ (\d+)", b)
                loc = re.search(r"^location:\s*(\S+)", b, re.I | re.M)
                if st and loc:
                    out["redirects"].append({"status": int(st.group(1)), "location": loc.group(1)})
            if blocks:
                out["headers"] = {k.lower(): v.strip() for k, v in re.findall(r"^([\w-]+):\s*(.*)$", blocks[-1], re.M)}
            with open(bfile, "rb") as fh:
                out["body"] = fh.read(max_bytes)
    out["ms"] = int((time.time() - t0) * 1000)
    out["via_curl"] = True
    out["sha256"] = hashlib.sha256(out["body"]).hexdigest() if out["body"] else None
    return out


def text_of(r):
    return r["body"].decode("utf-8", "replace")


def wayback_raw(url):
    """https://web.archive.org/web/<ts>/<url> -> the id_ form, which returns the archived bytes without the toolbar."""
    m = re.match(r"^https?://web\.archive\.org/web/(\d+)(?:id_)?/(.+)$", url)
    return f"https://web.archive.org/web/{m.group(1)}id_/{m.group(2)}" if m else url


def transcript(r, body_limit=4000):
    """A plain-text record of a response that `expect` regexes are matched against (live and api checks)."""
    lines = [f"request: {r['method']} {r['url']}", f"status: {r['status']}", f"final_url: {r['final_url']}"]
    for hop in r.get("redirects") or []:
        lines.append(f"redirect: {hop['status']} {hop['location']}")
    if r.get("error"):
        lines.append(f"error: {r['error']}")
    for h in ("server", "cf-ray", "content-type", "x-vercel-id"):
        if r["headers"].get(h):
            lines.append(f"header {h}: {r['headers'][h]}")
    lines.append("body: " + r["body"][:body_limit].decode("utf-8", "replace"))
    return "\n".join(lines)


# ----------------------------------------------------------------------------- proxy and vantage
GEO_APIS = [  # independent IP -> country services, asked through the same proxy; two must agree
    ("api.country.is", "https://api.country.is/", lambda j: (j.get("country"), None)),
    ("ipinfo.io", "https://ipinfo.io/json", lambda j: (j.get("country"), j.get("org"))),
    ("ifconfig.co", "https://ifconfig.co/json", lambda j: (j.get("country_iso"), j.get("asn_org"))),
]


def proxy_for(country):
    """Proxy URL for a country from PROBE_PROXY_URL (template with {cc} / {CC}) or PROBE_PROXY_URL_<CC>; None if unset."""
    override = os.environ.get("PROBE_PROXY_URL_" + country.replace("-", "_").upper())
    if override:
        return override
    tpl = os.environ.get("PROBE_PROXY_URL")
    if not tpl:
        return None
    cc = country.split("-")[0]
    return tpl.replace("{cc}", cc.lower()).replace("{CC}", cc.upper())


def vantage(proxy, country, timeout=30):
    """Which country do independent geo services see through this proxy? verified = 2+ answers, all equal to `country`."""
    expected = country.split("-")[0].upper()
    seen, org, by = [], None, []
    for name, url, pick in GEO_APIS:
        r = fetch(url, proxy=proxy, timeout=timeout, cache=None)
        try:
            j = json.loads(r["body"].decode("utf-8", "replace")) if r["status"] == 200 else None
        except ValueError:
            j = None
        if isinstance(j, dict):
            c, o = pick(j)
            if c:
                seen.append(str(c).upper())
                by.append(name)
            org = org or o
    return OrderedDict(requested=country, seen=seen, org=org, verified_by=by,
                       verified=len(seen) >= 2 and all(c == expected for c in seen))


def proxy_label(proxy):
    """Proxy host without credentials, for reports."""
    return re.sub(r"//[^@/]+@", "//", proxy) if proxy else None
