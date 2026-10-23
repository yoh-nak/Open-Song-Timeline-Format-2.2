# OSTF 2.2.0 — Compatibility and limitations

- **Versioned Core:** the only conforming document version in this package is `2.2.0`; use the appropriate separate Schema for 2.1.
- **Backward compatibility:** 2.1 is a data model baseline. The availability of 2.1 import does not imply that every 2.2 field can be safely downgraded. Unknown namespaced fields should round-trip unchanged; downgrade must explicitly check representability.
- **Chord languages:** grammar recognizes a documented finite set, not all existing proprietary DAW, chord-chart or plugin notations. Unknown inputs are not silently converted.
- **Rendering:** portable chord meaning is not the same thing as font, engraving, sheet-music layout or audio playback.
- **Scope:** detailed MIDI performance data, CC, velocity, pitches represented as complete MIDI regions, audio, plugin/device states and mix parameters are intentionally not standardized.
- **Runtime:** DAW/Max for Live runtime tests were expressly excluded from release qualification; users should separately test software implementations.
- **Security:** sample corpus includes positive, Schema-valid examples. It does not prove freedom from vulnerabilities or exhaust the mathematically infinite input space.
- **Reference precedence:** JSON Schema for structural constraints, Specification for normative semantics, registered vocabularies for IDs, reference validators for mechanical conformance examples. Report contradictions as spec issues rather than guessing.
