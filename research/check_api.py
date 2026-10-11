#!/usr/bin/env python3
"""API checks: does a public endpoint of the interface treat a sanctioned wallet differently from a clean one?

Why: wallet screening usually runs on a server (the interface's or its protocol's API), so the frontend code alone
only shows that a call is made, not that the server really refuses anyone, and the backend code is closed. Asking the
API itself with a sanctioned and a control wallet shows that screening works in production today. Covered:
Jumper (LI.FI quote API), KyberSwap (Blackjack), Relay (/sanctioned) and Synapse (screener); add more in
research/checks/<id>.json with "type": "api".

Before anything else the script asks the Chainalysis Sanctions Oracle on Ethereum (eth_call isSanctioned(address),
contract 0x40C5…c8fb) whether the test address in research/addresses.json is still sanctioned and the control address
is not. If the oracle disagrees, every API check is reported as "skip": a wallet test is only meaningful with an
address that is sanctioned today.

Then, for each check of type "api", the same request is sent twice: with {address} = the sanctioned (SDN) address and
with {address} = the control address. The responses are written down as plain text (status, final URL, body) and the
regexes in expect_sdn / expect_control must match the respective transcript. A check passes only when the endpoint
answers differently in the expected way: blocked for SDN, normal for control.

Read-only: GET/POST of public endpoints with a wallet address as a parameter. No keys, no signatures, no transactions.
RPC: $RPC_URL, or the public endpoint in research/addresses.json.

Usage (from pi-restrict-interface/):
  python3 -I research/check_api.py
  RPC_URL=https://eth.llamarpc.com python3 -I research/check_api.py --only relay,jumper
"""
import json, os, re, sys
from collections import OrderedDict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import common  # noqa: E402
from lib.net import fetch, transcript  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))


def oracle(rpc, oracle_addr, address):
    data = "0xdf592f7d" + address[2:].lower().rjust(64, "0")
    r = fetch(rpc, method="POST", cache=None, timeout=30,
              body={"jsonrpc": "2.0", "id": 1, "method": "eth_call", "params": [{"to": oracle_addr, "data": data}, "latest"]})
    try:
        out = json.loads(r["body"].decode())["result"]
        return int(out, 16) == 1, None
    except Exception:  # noqa: BLE001
        return None, r["error"] or r["body"][:200].decode("utf-8", "replace")


def fill(value, address):
    if isinstance(value, str):
        return value.replace("{address}", address)
    if isinstance(value, dict):
        return OrderedDict((k, fill(v, address)) for k, v in value.items())
    if isinstance(value, list):
        return [fill(v, address) for v in value]
    return value


def call(src, address):
    body = fill(src.get("body"), address)
    return fetch(fill(src["url"], address), method=src.get("method", "GET"), body=body, headers=src.get("headers"),
                 cache=None, timeout=60)


def excerpt(r, patterns, width=110):
    """The part of the response body that decides the check: the first expected value found in it, else its start."""
    body = " ".join(r["body"][:20000].decode("utf-8", "replace").split())
    if r["error"]:
        return r["error"]
    for pat in patterns:
        m = re.search(pat.lstrip("^").replace("body: ", ""), body, re.I)
        if m and not pat.startswith("^status"):
            a = max(0, m.start() - 30)
            return ("…" if a else "") + body[a:a + width] + ("…" if a + width < len(body) else "")
    return body[:width] + ("…" if len(body) > width else "")


def run(spec, check, addrs):
    src = check["source"]
    out, found, reasons, texts = OrderedDict(), [], [], []
    for role in ("sdn", "control"):
        r = call(src, addrs[role]["address"])
        t = transcript(r)
        texts.append(f"=== {role} ({addrs[role]['address']}) ===\n{t}")
        ev = common.evaluate({"expect": check.get("expect_" + role, []), "case": check.get("case")}, t)
        out[role] = OrderedDict(address=addrs[role]["address"], url=r["url"], method=r["method"], status=r["status"],
                                error=r["error"], answer=excerpt(r, check.get("expect_" + role, [])))
        for f in ev["found"]:
            f["text"] = f"{role}: {f['text']}"
        found += ev["found"]
        reasons += [f"{role}: {x}" for x in ev["reasons"]]
    outcome = "pass" if not reasons else ("error" if all(v["error"] for v in out.values()) else "fail")
    shown = src["url"] if src.get("method", "GET") == "GET" else f"{src['method']} {src['url']}"
    res = common.result(spec, check, outcome, shown, responses=out)
    res["found"] = found
    if reasons:
        res["reasons"] = reasons
    common.save_evidence(res, "\n\n".join(texts))
    return res


def print_api(res, spec, verbose=False):
    """One readable block per check: which interface, what was asked with each wallet, what came back."""
    mark = {"pass": "PASS", "fail": "FAIL", "error": "ERR ", "skip": "SKIP"}[res["outcome"]]
    print(f"\n{mark} {spec.get('name', res['interface'])} ({res['check']}): {res['claim']}={res['status']}")
    print(f"     {res['about']}")
    for role, label in (("sdn", "sanctioned"), ("control", "control   ")):
        r = (res.get("responses") or {}).get(role)
        if not r:
            continue
        addr = r["address"][:6] + "…" + r["address"][-4:]
        url = r["url"] if verbose or len(r["url"]) <= 90 else r["url"][:87] + "…"
        print(f"     {label} {addr}  {r['method']} {url}")
        print(f"     {' ' * len(label)} {' ' * len(addr)}  -> HTTP {r['status']}  {r['answer']}")
    for why in res.get("reasons") or []:
        print(f"     ! {why[:300]}")
    sys.stdout.flush()


def main():
    args = common.cli(__doc__)
    common.load_env()
    with open(os.path.join(HERE, "addresses.json"), encoding="utf-8") as fh:
        addrs = json.load(fh)
    rpc = os.environ.get("RPC_URL") or addrs["rpc_default"]
    sdn, err1 = oracle(rpc, addrs["oracle"]["address"], addrs["sdn"]["address"])
    ctl, err2 = oracle(rpc, addrs["oracle"]["address"], addrs["control"]["address"])
    pre = OrderedDict(rpc=rpc.split("?")[0], sdn_address=addrs["sdn"]["address"], sdn_sanctioned=sdn,
                      control_address=addrs["control"]["address"], control_sanctioned=ctl)
    print("Step 1. Are the test wallets what we say they are? Chainalysis Sanctions Oracle on Ethereum, isSanctioned(address):")
    print(f"     sanctioned {addrs['sdn']['address']}  -> {sdn}   ({addrs['sdn']['note'].split('. ')[0]})")
    print(f"     control    {addrs['control']['address']}  -> {ctl}")
    print(f"     oracle {addrs['oracle']['address']} via {pre['rpc']}")
    print("Step 2. The same request to each interface's public API with each wallet; screening = different answers.")
    usable = sdn is True and ctl is False
    if not usable:
        print("! the test addresses are not usable (oracle error or the SDN address is no longer sanctioned):", err1 or err2 or "")
    results = []
    for spec, check in common.iter_checks(("api",), args.only):
        if usable:
            res = run(spec, check, addrs)
        else:
            res = common.result(spec, check, "skip", check["source"]["url"], reasons=["test addresses not confirmed by the oracle"])
        print_api(res, spec, args.verbose)
        results.append(res)
    common.write_outputs("api", results, {"oracle_preflight": dict(pre)}, args.only)
    print("PASS = the API refuses or flags the sanctioned wallet and serves the control one: wallet screening works "
          "in production right now.\nFAIL = both wallets got the same treatment (screening gone or the API changed); "
          "ERR = the API did not answer.")


if __name__ == "__main__":
    main()
