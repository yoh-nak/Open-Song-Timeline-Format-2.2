# OSTF 2.2 — Bounded normative terminology registry (RC28)

The machine-readable `registry/terminology-2.2.json` is the authoritative registry for **the IDs it actually contains**, not a claim to recognize all music terminology.

- `registry` keys are stable, case-sensitive IDs. Consumers MUST preserve unknown IDs and user strings rather than infer an absent entry.
- Matching is exact and case-sensitive for registered aliases. Distinct spellings may be added as explicit aliases; no automatic transliteration or case folding is permitted.
- Two matching aliases in one domain make input ambiguous, never auto-resolved. The validator checks the bundled registry has no such collisions.
- Scale `intervals` are sorted, unique semitone distances starting at 0, for a fixed 12-tone equal temperament reference. `tonic` determines pitch classes modulo 12. These values annotate harmony; they DO NOT forbid chromatic notes in melodies.
- `key.major` and `key.minor` are key-quality terms, **not** scale-specific definitions of a song's permitted notes.
- `meter.*` aliases are display/context hints and do not override explicit meter numerator/denominator.
- `section.*` aliases are semantic section kinds, not a prescribed song structure.
- The following remain outside this bounded edition: unrestricted source-software notation dialects, arbitrary microtonal or non-12-TET scale formulas, free-form poly-chord canonical semantics, and performer-specific MIDI data. Unrecognized data must be preserved.

A term is within OSTF 2.2's recognized scope only if there is an exact registry entry; accepting unknown data is a compatibility feature, not semantic recognition.
