# Open Song Timeline Format (OSTF) 2.2.0 — Core Specification

**Version: 2.2.0.** The published 2.1.0 data model remains the backward-compatibility baseline.

## 1. Scope and non-goals

OSTF exchanges musical meaning: timeline, structure, harmony, tonal context, melodies and their lyric alignment. It does **not** standardize MIDI performance data (CC, velocity, expression or sound-generating note playback), instruments, audio, mixer settings, plugin states or engraving/PDF styles. Existing 2.1 melody note anchors remain only for structural/lyric linkage; their presence does not imply a new performance layer.

## 2. Chord notation model

A harmony event retains `symbol` exactly, preserving byte-for-byte Unicode content on a read/write round trip unless the author explicitly edits it. Optional `chordMeaning` is the musical interpretation (2.1). Optional `chordNotation` documents the original input, interpretation profile and requested display style. `chordNotation.input.text` MUST equal `symbol` when present. A recognized `interpretation.canonical` is a **canonical chord spelling**, not a mandate to rewrite `symbol`. `rendering.text`, if stored, MUST agree with deterministic formatting; it is display metadata, not a source of harmonic truth. `chordMeaning`, if recognized, MUST not contradict interpretation. Unrecognized or ambiguous symbols MUST NOT be guessed at, and SHALL be preserved.

### 2.1 Recognized lexical equivalents

`maj7`, `M7`, `△7`, `Δ7` map to major seventh; `m7`, `min7`, `-7`, `−7` map to minor seventh; `dim`, `°` map to diminished; `dim7`, `°7` diminished seventh; `m7b5`, `m7♭5`, `ø7` half-diminished; `aug`, `+` augmented. `C7` (dominant seventh) and `Cmaj7` are different. The parser handles the given root and optional slash-bass, but MUST reject or mark unknown any unimplemented extensions without making up semantics.

Case-sensitive `M` MUST NOT be indiscriminately replaced with `m`. `△` without `7` is not automatically major seventh. `ø` without `7` is not silently interpreted as half-diminished seventh. `sus`, `add`, `omit`, altered extensions, minor-major seventh, polychords and mixture of additions must be parsed by explicit documented grammar profiles, otherwise remain unresolved. No global string-replace rules are conforming.

### 2.2 Enharmonic policy

Normalize accidental glyphs (`♭` ↔ `b`, `♯` ↔ `#`) **for semantic parsing only**. Original root spelling is preserved: C# and Db are pitch-class-equivalent in 12-TET but NOT spelling-equivalent in functional harmony. Canonical representation does not arbitrarily respell roots or slash bass. Note-profile/MIDI-note equality does not prove chord identity.

### 2.3 Display profiles

`original`: source text; `standard`: `maj7`, `m7`, `dim`, `aug`; `jazz`: `△7`, `−7`, `°`, `+`; `compact`: `M7`, `m7`, `°`, `+`. All profiles MUST preserve degree, alteration, omission, suspension, bass and chord meaning. If the exact meaning cannot be rendered safely, fall back to Original; NEVER drop a degree to save layout space. The app MAY offer more styles, but those outside the registered profile set are non-standard extensions. Styling/font size remains application-controlled.

### 2.4 Round-trip guarantee

`parse(original) -> meaning -> format(style) -> parse(rendered)` MUST preserve semantic identity for recognized, supported symbols. `format` MUST NOT mutate original symbol. When exporting to an older version, implementations MUST report unrepresentable semantics/metadata, preserve unknown extensions when possible, and MUST NOT claim lossless conversion without a check. A round trip means both semantic equivalence and original text retention where retained in source/extension metadata.

## 3. Cross-domain audit obligations

- **Time**: all tick positions nonnegative integers at declared `ppq`; verify tempo/meter boundary ordering, duplicates, zero/negative durations, song end, pickups and conversion rounding. Tempo is finite positive; meter denominators have an explicit accepted set. Conversions to seconds are derived, not canonical.
- **Key/scale**: distinguish root, tonic, mode, scale, signature and enharmonic spelling; tonal changes apply from exact start tick; no implicit transposition of existing notes/chords.
- **Sections**: distinguish free display name from role; no assumption of language from name; overlapping/hierarchical intervals require deterministic semantics or explicit rejection.
- **Lyrics**: preserve display vs pronunciation; language tagging, grapheme-safe indexing, mora/syllable/word boundaries, melisma and note links require consistent declared offsets and a defined Unicode policy.
- **Unknown data**: reject duplicate JSON object keys and non-finite numbers; preserve supported extension namespaces verbatim; never drop information silently on re-export; handle unknown future versions conservatively.
- **Backward compatibility**: accept valid 2.1 data via a documented migration path; preserve original 2.1 data and publish a diff-based mapping with loss reports.

## 4. Validation classes

Class S: JSON Schema structural validity. Class M: reference/timing/chord semantic consistency. Class R: parse-format-parse round trips, version migration and preservation of unknown data. Class I: independent Python/JS validator parity. Conformance claims are limited to the named semantic profile and executable fixtures supplied in this release.

## 5. Release gate

Release qualification is based on the published Schema, reference validators, positive/negative `.ostf` specimens, and compatibility/round-trip regression suite. DAW, plugin and rendering runtime tests are outside this qualification. Conformance covers the explicitly supported grammar, not arbitrary vendor dialects.



## 7. Normative companion contracts and limitations

The following companion documents in this release define the constrained profiles: `NORMATIVE_TERMINOLOGY_2_2.md`, `RC39_SOURCE_DIALECT_CONTRACT.md`, `RC35_POLYCHORD_DOCUMENT_CONTRACT.md`, `RC51_JSON_AND_LYRICS_CONTRACT.md`, and `RC52_LYRIC_OFFSET_CONTRACT.md`. The `RC` prefixes identify the documents' historical provenance, not the version of the published format. The JSON Schema is the structural authority; reference validator implementations enforce additional musical and lyric semantic rules.

The standard does not guarantee universal recognition of proprietary chord spellings. Unrecognized spellings are carried verbatim and must not be silently replaced with guessed semantic values. Unknown extensions must be preserved when claiming losslessness; when a downgrade cannot preserve a value, the converter must explicitly report the loss. Where an optional 2.1 field has no 2.2 interpretation metadata, consumers must not invent that metadata.

The core specification documents normative semantics for the supported fields. It does not standardize third-party DAW/plugin runtime behavior, nor make untested claims about arbitrary input sizes, legacy corpora or every Unicode grapheme cluster.
