"""HTML -> plain text, without JavaScript: scripts, styles and tags are dropped, block tags become line breaks.
Good enough for server-rendered docs, help centers, Terms pages and press articles; a page that only renders in the
browser yields an empty or near-empty text, and the check reports that instead of guessing."""
import html, re

_DROP = re.compile(r"<(script|style|noscript|svg|template)\b[^>]*>.*?</\1\s*>", re.S | re.I)
_BLOCK = re.compile(r"<\s*(br|/p|/li|/h[1-6]|/div|/tr|/td|/th|/section|/article|/blockquote|/dt|/dd|li|p|h[1-6])\b[^>]*>", re.I)
_TAG = re.compile(r"<[^>]+>")


def html_to_text(raw):
    s = _DROP.sub(" ", raw)
    s = _BLOCK.sub("\n", s)
    s = _TAG.sub(" ", s)
    s = html.unescape(s)
    s = re.sub(r"[ \t\r\f\v ]+", " ", s)
    s = re.sub(r" *\n[\n ]*", "\n", s)
    return s.strip()


def looks_like_html(body_text, headers=None):
    ctype = (headers or {}).get("content-type", "")
    return "html" in ctype or body_text.lstrip()[:200].lower().startswith(("<!doctype html", "<html"))
