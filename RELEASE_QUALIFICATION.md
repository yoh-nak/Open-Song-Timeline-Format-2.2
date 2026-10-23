# OSTF 2.2.0 release qualification

- Scope: Core schema, deterministic chord grammar/profile and lyric offsets, selected 2.1 migrations, extension preservation, semantic validation, and Python/JavaScript parity for a finite set of specimens.
- Excluded: DAW/plugin runtime, arbitrary proprietary spellings, exhaustive legacy corpora, and universal Unicode grapheme semantics.
- All claims must be supported by the attached development test suite; passing tests do not establish coverage of all possible inputs.
- The complete development/source regression suite is distributed separately in the RC55 development package.

Verification: Python regression 155/155 passed; five bundled examples accepted by both Python/JS full-document validators.

**Decision: GO — OSTF 2.2.0 core profile.**
