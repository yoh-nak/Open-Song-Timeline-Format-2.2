# OSTF 2.2.0 — Complete Field Reference / 全フィールドリファレンス

**Stable version: 2.2.0.** This document indexes every property explicitly declared in `schema/ostf-2.2.schema.json`. The machine-readable Schema is normative for structure. Semantic validators are normative implementation guidance for cross-field restrictions. Fields in vendor extensions may be unknown and MUST be preserved when round-tripping.

## Reading the field table

`$` is the root object, `[]` identifies array items. `required` means the field is required in its enclosing object, not that the enclosing object itself is mandatory. Conditional requirements (e.g. recognized chord and scale meanings) are expressed by schema `if/then` constraints. The array element descriptions may include repeated names in distinct object contexts.

| JSON path | Schema type | Presence | Constraints |
|---|---|---|---|
| `$.format` | `conditional` | required | const=OSTF |
| `$.version` | `conditional` | required | const=2.2.0 |
| `$.ppq` | `conditional` | required | const=960 |
| `$.song` | `object` | required | — |
| `$.song.title` | `string` | optional | — |
| `$.song.artist` | `string` | optional | — |
| `$.song.key` | `string` | optional | — |
| `$.song.scaleMeaning` | `object` | optional | — |
| `$.song.scaleMeaning.original` | `string` | required | — |
| `$.song.scaleMeaning.status` | `conditional` | required | enum=['recognized', 'unknown', 'ambiguous', 'unresolved'] |
| `$.song.scaleMeaning.sourceDialect` | `string` | optional | — |
| `$.song.scaleMeaning.scaleId` | `string` | optional | pattern=^scale\.[a-z][a-z0-9-]*$ |
| `$.song.scaleMeaning.tonic` | `string` | optional | pattern=^[A-G](?:#\|b){0,2}$ |
| `$.song.scaleMeaning.tuningId` | `string` | optional | — |
| `$.song.scaleMeaning.intervals` | `array` | optional | minItems=1; maxItems=12 |
| `$.song.scaleMeaning.pitchClasses` | `array` | optional | minItems=1; maxItems=12 |
| `$.song.scaleMeaning.displaySpellings` | `array` | optional | minItems=1; maxItems=12 |
| `$.timeline` | `object` | required | — |
| `$.timeline.sections` | `array` | required | — |
| `$.timeline.sections[].id` | `string` | required | — |
| `$.timeline.sections[].start` | `integer` | required | minimum=0 |
| `$.timeline.sections[].duration` | `integer` | required | minimum=1 |
| `$.timeline.sections[].name` | `string` | required | — |
| `$.timeline.sections[].role` | `conditional` | optional | enum=['intro', 'verse', 'preChorus', 'chorus', 'postChorus', 'bridge', 'breakdown', 'drop', 'solo', 'interlude', 'outro', 'other'] |
| `$.timeline.meterChanges` | `array` | required | — |
| `$.timeline.meterChanges[].at` | `integer` | required | minimum=0 |
| `$.timeline.meterChanges[].numerator` | `integer` | required | minimum=1 |
| `$.timeline.meterChanges[].denominator` | `integer` | required | enum=[1, 2, 4, 8, 16, 32, 64] |
| `$.timeline.tempoChanges` | `array` | required | — |
| `$.timeline.tempoChanges[].at` | `integer` | required | minimum=0 |
| `$.timeline.tempoChanges[].bpm` | `number` | required | — |
| `$.timeline.tonalChanges` | `array` | optional | — |
| `$.timeline.tonalChanges[].at` | `integer` | required | minimum=0 |
| `$.timeline.tonalChanges[].root` | `string` | required | pattern=^[A-G](?:#\|b)?$ |
| `$.timeline.tonalChanges[].mode` | `string` | required | — |
| `$.timeline.tonalChanges[].scale` | `string` | optional | — |
| `$.timeline.tonalChanges[].spelling` | `conditional` | optional | enum=['sharps', 'flats', 'contextual'] |
| `$.timeline.tonalChanges[].scaleMeaning` | `object` | optional | — |
| `$.timeline.tonalChanges[].scaleMeaning.original` | `string` | required | — |
| `$.timeline.tonalChanges[].scaleMeaning.status` | `conditional` | required | enum=['recognized', 'unknown', 'ambiguous', 'unresolved'] |
| `$.timeline.tonalChanges[].scaleMeaning.sourceDialect` | `string` | optional | — |
| `$.timeline.tonalChanges[].scaleMeaning.scaleId` | `string` | optional | pattern=^scale\.[a-z][a-z0-9-]*$ |
| `$.timeline.tonalChanges[].scaleMeaning.tonic` | `string` | optional | pattern=^[A-G](?:#\|b){0,2}$ |
| `$.timeline.tonalChanges[].scaleMeaning.tuningId` | `string` | optional | — |
| `$.timeline.tonalChanges[].scaleMeaning.intervals` | `array` | optional | minItems=1; maxItems=12 |
| `$.timeline.tonalChanges[].scaleMeaning.pitchClasses` | `array` | optional | minItems=1; maxItems=12 |
| `$.timeline.tonalChanges[].scaleMeaning.displaySpellings` | `array` | optional | minItems=1; maxItems=12 |
| `$.harmony` | `array` | required | — |
| `$.harmony[].id` | `string` | required | — |
| `$.harmony[].start` | `integer` | required | minimum=0 |
| `$.harmony[].duration` | `integer` | required | minimum=1 |
| `$.harmony[].symbol` | `string` | required | — |
| `$.harmony[].noteProfile` | `array` | optional | — |
| `$.harmony[].chordMeaning` | `object` | optional | — |
| `$.harmony[].chordMeaning.status` | `conditional` | required | enum=['recognized', 'ambiguous', 'unknown', 'noChord', 'unresolved'] |
| `$.harmony[].chordMeaning.root` | `string` | optional | pattern=^[A-G](?:b\|#){0,2}$ |
| `$.harmony[].chordMeaning.quality` | `conditional` | optional | enum=['major', 'minor', 'diminished', 'augmented', 'unspecified'] |
| `$.harmony[].chordMeaning.seventh` | `conditional` | optional | enum=['none', 'minor', 'major', 'diminished'] |
| `$.harmony[].chordMeaning.bass` | `string/null` | optional | pattern=^[A-G](?:b\|#){0,2}$ |
| `$.harmony[].chordMeaning.extensions` | `array` | optional | — |
| `$.harmony[].chordMeaning.alterations` | `array` | optional | — |
| `$.harmony[].chordMeaning.adds` | `array` | optional | — |
| `$.harmony[].chordMeaning.omissions` | `array` | optional | — |
| `$.harmony[].chordMeaning.suspension` | `integer/null` | optional | enum=[None, 2, 4] |
| `$.harmony[].chordNotation` | `object` | optional | — |
| `$.harmony[].chordNotation.input` | `object` | required | — |
| `$.harmony[].chordNotation.input.text` | `string` | required | — |
| `$.harmony[].chordNotation.input.dialect` | `string` | optional | — |
| `$.harmony[].chordNotation.input.locale` | `string` | optional | — |
| `$.harmony[].chordNotation.interpretation` | `object` | required | — |
| `$.harmony[].chordNotation.interpretation.status` | `conditional` | required | enum=['recognized', 'ambiguous', 'unknown', 'unresolved', 'noChord'] |
| `$.harmony[].chordNotation.interpretation.canonical` | `string` | optional | — |
| `$.harmony[].chordNotation.interpretation.ruleSet` | `conditional` | optional | const=ostf-chord-notation-2.2-d1 |
| `$.harmony[].chordNotation.interpretation.alternatives` | `array` | optional | minItems=2 |
| `$.harmony[].chordNotation.rendering` | `object` | required | — |
| `$.harmony[].chordNotation.rendering.style` | `conditional` | required | enum=['original', 'standard', 'jazz', 'compact'] |
| `$.harmony[].chordNotation.rendering.text` | `string` | optional | — |
| `$.harmony[].chordNotation.polychord` | `object` | optional | — |
| `$.harmony[].chordNotation.polychord.composition` | `conditional` | required | const=upper-over-lower |
| `$.harmony[].chordNotation.polychord.upper` | `string` | required | — |
| `$.harmony[].chordNotation.polychord.lower` | `string` | required | — |
| `$.melodies` | `array` | required | — |
| `$.melodies[].id` | `string` | required | — |
| `$.melodies[].name` | `string` | optional | — |
| `$.melodies[].role` | `conditional` | required | enum=['vocal-main', 'vocal-other', 'instrumental'] |
| `$.melodies[].notes` | `array` | required | — |
| `$.melodies[].notes[].id` | `string` | required | — |
| `$.melodies[].notes[].start` | `integer` | required | minimum=0 |
| `$.melodies[].notes[].duration` | `integer` | required | minimum=1 |
| `$.melodies[].notes[].pitch` | `integer` | required | minimum=0; maximum=127 |
| `$.melodies[].clips` | `array` | optional | — |
| `$.melodies[].clips[].id` | `string` | required | — |
| `$.melodies[].clips[].start` | `integer` | required | minimum=0 |
| `$.melodies[].clips[].duration` | `integer` | required | minimum=1 |
| `$.melodies[].clips[].noteIds` | `array` | required | — |
| `$.lyrics` | `object` | required | — |
| `$.lyrics.documents` | `array` | required | — |
| `$.lyrics.documents[].id` | `string` | required | — |
| `$.lyrics.documents[].text` | `string` | required | — |
| `$.lyrics.documents[].vocalText` | `string` | optional | — |
| `$.lyrics.documents[].segments` | `array` | optional | — |
| `$.lyrics.documents[].segments[].source` | `conditional` | required | enum=['text', 'vocalText'] |
| `$.lyrics.documents[].segments[].kind` | `conditional` | required | enum=['word', 'morpheme', 'syllable', 'mora', 'phrase', 'punctuation', 'other'] |
| `$.lyrics.documents[].segments[].start` | `integer` | required | minimum=0 |
| `$.lyrics.documents[].segments[].end` | `integer` | required | minimum=1 |
| `$.lyrics.phrases` | `array` | required | — |
| `$.lyrics.phrases[].id` | `string` | required | — |
| `$.lyrics.phrases[].documentId` | `string` | required | — |
| `$.lyrics.phrases[].startOffset` | `integer` | required | minimum=0 |
| `$.lyrics.phrases[].endOffset` | `integer` | required | minimum=0 |
| `$.lyrics.phrases[].start` | `integer` | optional | minimum=0 |
| `$.lyrics.phrases[].duration` | `integer` | optional | minimum=1 |
| `$.lyrics.units` | `array` | required | — |
| `$.lyrics.units[].id` | `string` | required | — |
| `$.lyrics.units[].phraseId` | `string` | required | — |
| `$.lyrics.units[].startOffset` | `integer` | required | minimum=0 |
| `$.lyrics.units[].endOffset` | `integer` | required | minimum=0 |
| `$.lyrics.units[].text` | `string` | required | — |
| `$.lyrics.units[].reading` | `string` | optional | — |
| `$.lyrics.alignments` | `array` | required | — |
| `$.lyrics.alignments[].id` | `string` | required | — |
| `$.lyrics.alignments[].unitId` | `string` | required | — |
| `$.lyrics.alignments[].noteIds` | `array` | required | minItems=1 |
| `$.lyrics.vocalUnits` | `array` | optional | — |
| `$.lyrics.vocalUnits[].id` | `string` | required | — |
| `$.lyrics.vocalUnits[].language` | `string` | required | pattern=^(?:[A-Za-z]{2,3}(?:-[A-Za-z]{4})?(?:-(?:[A-Za-z]{2}\|[0-9]{3}))?(?:-[A-Za-z0-9]{5,8}\|-[0-9][A-Za-z0-9]{3})*\|und\|mul)(?:-x(?:-[A-Za-z0-9]{1,8})+)?$ |
| `$.lyrics.vocalUnits[].text` | `string` | optional | — |
| `$.lyrics.vocalUnits[].pronunciation` | `string` | optional | — |
| `$.lyrics.vocalUnits[].assignments` | `array` | optional | — |
| `$.lyrics.vocalUnits[].assignments[].index` | `integer` | required | minimum=0 |
| `$.lyrics.vocalUnits[].assignments[].noteIds` | `array` | required | minItems=1 |
| `$.lyrics.vocalUnits[].unitId` | `string` | required | — |
| `$.lyrics.vocalUnits[].vocalText` | `string` | optional | — |
| `$.lyrics.vocalUnits[].syllables` | `array` | required | minItems=1 |
| `$.lyrics.indexUnit` | `conditional` | optional | const=unicodeCodePoint |

## Cross-field validation and interpretation

- `format` = `OSTF`, `version` = `2.2.0`, `ppq` = `960`. Temporal offsets are nonnegative integer ticks; valid event durations are positive ticks.
- Chord input `chordNotation.input.text` must match `harmony[].symbol` exactly. Recognized canonical and rendered text must correspond to supported chord semantics. Original symbol is authoritative and never overwritten merely to normalize spelling.
- A recognized chord must not contradict any supplied `chordMeaning`. Unrecognized and ambiguous symbols retain their literal text and must not be silently reinterpreted.
- Polychord `upper-over-lower` uses the declared two-component grammar; an ordinary slash bass is not automatically a polychord.
- Recognized `scaleMeaning` uses an OSTF scale identifier, `12-TET`, tonic, intervals and pitchClasses. Its declaration describes tonal intent; it does not constrain note pitches to the scale.
- `lyrics.indexUnit = unicodeCodePoint` counts Unicode scalar characters, not UTF-8 bytes or UTF-16 units. Referenced offsets should be checked against the named document or phrase by the semantic validator; never invent a unit for legacy documents where it is absent.
- `lyrics.vocalUnits` represent text/phoneme alignment metadata and are not MIDI performance instructions.
- `noteProfile` is a set/list of pitch numbers, not a mandate that all notes in the voice match the chord exactly.
- JSON must use strict UTF-8, reject duplicate keys and nonfinite numbers, and enforce implementation input-size limits when parsing untrusted content.
- Unknown non-core properties should be preserved as opaque extensions. When downgrading to 2.1, declare information loss rather than claiming an unchecked lossless conversion.

## Registered vocabularies

Inspect `registry/terminology-2.2.json` and `registry/chord-dialects-2.2.json` for the literal machine-readable records. Display aliases are not license to equate all vendor-specific notations. Consult `SPECIFICATION_2_2.md`, `NORMATIVE_TERMINOLOGY_2_2.md` and the accompanying contracts for constraints beyond individual fields.

## Scope

OSTF is an interchange format for song structure, harmonic/tonal metadata, melody anchors and lyric alignment. MIDI CC, velocity, plugin presets, synth engines, audio, mix parameters and DAW UI states are outside the OSTF Core 2.2.0 contract.
