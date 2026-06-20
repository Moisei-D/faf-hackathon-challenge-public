import re

from config import settings

# Character used to mask a profane word, preserving its length. Single source of
# truth so store-derived metrics (admin.py) can detect a masked message.
MASK_CHAR = "*"

# Stop list sourced from PROFANITY_WORDS (config.py), comma-separated, falling back
# to the curated default when unset.
PROFANITY_WORDS = [w.strip() for w in settings.profanity_words.split(",") if w.strip()]

# Common letter-swap / leetspeak substitutions, so "a$$" and "sh1t" are caught.
# Letters with no common swap match themselves.
_LEET = {
    "a": "[a4@]",
    "b": "[b8]",
    "e": "[e3]",
    "i": "[i1!|]",
    "l": "[l1|]",
    "o": "[o0]",
    "s": "[s5$]",
    "t": "[t7+]",
}


def _leetify(word: str) -> str:
    return "".join(_LEET.get(ch.lower(), re.escape(ch)) for ch in word)


# Match a swear (or a leet variant) only when it stands on its own — not when it
# sits inside a longer word. The letter look-arounds are what stop "ass" from
# matching inside "passport" / "assertive", or "hell" inside "hello".
if PROFANITY_WORDS:
    _PATTERN = re.compile(
        r"(?<![a-zA-Z])(?:"
        + "|".join(_leetify(w) for w in sorted(PROFANITY_WORDS, key=len, reverse=True))
        + r")(?![a-zA-Z])",
        re.IGNORECASE,
    )
else:
    _PATTERN = None


def _mask(match: "re.Match[str]") -> str:
    token = match.group(0)
    # A token with no letters (e.g. a bare number like "455") isn't profanity.
    if any(ch.isalpha() for ch in token):
        return MASK_CHAR * len(token)
    return token


def mask_profanity(text: str) -> str:
    """Mask profane words in user-supplied text, preserving length with '*'."""
    if not text or _PATTERN is None:
        return text
    return _PATTERN.sub(_mask, text)


def contains_mask(text) -> bool:
    """True if text carries a profanity mask produced by mask_profanity."""
    return bool(text) and MASK_CHAR in text
