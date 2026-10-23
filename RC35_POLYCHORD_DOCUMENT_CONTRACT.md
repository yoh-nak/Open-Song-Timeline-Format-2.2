# OSTF 2.2 RC35 — structured polychord contract

## Normative rules in this release candidate

- A recognized `upper|lower` chord SHALL carry `chordNotation.polychord` with `composition: "upper-over-lower"`, `upper` and `lower` strings; both components SHALL be recognized individual chords.
- The declared upper and lower components SHALL match the parsed text *with spelling preserved*, not merely pitch-class equivalence.
- `interpretation.canonical` SHALL reparse as an equivalent two-part polychord, in the same upper/lower order.
- A non-original rendering SHALL reparse as the same structured polychord, or it MUST be rejected.
- A single chord SHALL NOT carry a fictitious `polychord` object.
- Polyphony/performance/MIDI voicing are not encoded by this contract. `|` denotes the syntactic upper/lower meaning, not audio playback.
- More than two components, empty components, unrecognized constituents are not automatically recognized; their original text is preserved.
- The existing string `symbol` and notation input text remain authoritative verbatim input; the structured object makes the semantics machine-checkable.

## Negative conformance

`POLYCHORD_STRUCTURE_MISSING`, `POLYCHORD_STRUCTURE_MISMATCH`, `CANONICAL_MEANING_CHANGED`, and `RENDER_MEANING_CHANGED` are semantic errors. Existing JSON Schema restrictions reject malformed structured payloads first.

## Verification scope

Python and JavaScript acceptance parity verified for five new valid/negative document fixtures. All 80 Python unit tests passed. Runtime tests inside DAWs or plugins were not performed and are explicitly waived for release assessment.
