# OSTF 2.2 RC39 — Normative source-dialect scope

The machine-readable `registry/chord-dialects-2.2.json` defines the **only registered source dialect** in this release candidate: `ostf-core-2.2`, whose grammar is `ostf-chord-notation-2.2-d1`. This does not purport to implement any named vendor's notation grammar.

1. Original input text MUST remain unchanged.
2. Unregistered source dialect IDs MUST NOT confer extra recognition beyond the strict Core grammar. Core-recognized symbols MAY still be recognized irrespective of their source.
3. A vendor's identity alone MUST NOT cause recognition or disambiguate an ambiguous symbol.
4. Out-of-grammar or malformed text MUST be retained as unknown; a conforming implementation MUST NOT accept a recognized prefix and ignore a suffix.
5. Core exactly-two-part `UPPER|LOWER` syntax may be structured as a polychord; triple stacks are out of scope and MUST be preserved rather than guessed.
6. A display profile transformation MUST preserve recognized meaning; otherwise return the exact original text.
7. A future proprietary grammar needs a registered identifier, normative grammar, and conformance fixtures before recognition is claimed.

This **bounds** the promise of source-dialect interoperability. It does not promise universal recognition of arbitrary plugin spellings. Dialect dispatch is implemented in both Python and JavaScript reference libraries and verified with cross-language tests.
