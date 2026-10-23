# OSTF 2.2.0 — Complete User and Developer Manual / 総合マニュアル

**Official format version:** 2.2.0. **Status:** final release of the scoped OSTF Core 2.2.0 standard.

## 1. Purpose / 目的

Open Song Timeline Format is a JSON-based, DAW-independent representation of song form, bar/beat timeline, chord spellings and their meanings, tonal changes, structural melody-note anchors and lyric alignment. It aims to preserve authors' input notations while enabling programs to exchange understood musical meaning. Unlike a MIDI file, OSTF does not encode performance nuances, note velocities, automation, audio, plugin state or mixing details.

## 2. Getting started / 最初の一歩

1. Open `examples/2.2-structure-01-intro.ostf` in a UTF-8 text editor.
2. Keep `format`, `version`, `ppq`, `song`, `timeline`, `harmony`, `melodies` and `lyrics` at the document root.
3. Use 960 ticks per quarter note. In 4/4: 1 beat = 960 ticks; 1 bar = 3840 ticks; 2 bars = 7680 ticks. In 6/8, an eighth note = 480 ticks, hence 1 notated bar = 2880 ticks.
4. Make every ID unique within its referencing family; preserve cross references between lyric units, melody notes and phrases.
5. Preserve the original chord string in `harmony[].symbol`. Use `chordNotation` only to identify a supported meaning and a preferred display representation.
6. Validate against the JSON Schema, then run a semantic validator. JSON Schema validation alone does not validate every reference or musical relation.

## 3. Timeline, sections and meter / 時間軸

`timeline.sections` declares named song regions, roles and tick intervals. `timeline.meterChanges` contains time signatures and `timeline.tempoChanges` tempo map points; `timeline.tonalChanges` may give key/mode and optional scale semantics. A section can be named Intro, Verse, Chorus, Bridge, Drop or any custom name while its `role` stays one of the registered enumeration values. For complex songs, multiple sections, independent tempo map points and key/meter changes coexist. Applications may locate a song timeline after leading DAW silence: source DAW position is an application mapping, not hard-coded into OSTF's zero point.

## 4. Harmony and chord spelling / 和声・コード表記

`symbol` is the original spelling and should not be rewritten automatically. Use `chordMeaning` for recognized components, and `chordNotation.input`, `.interpretation`, `.rendering` for a specific grammar rule set and display profile. Registered styles: `original`, `standard`, `jazz`, `compact`; e.g. Cmaj7 = C△7 = CM7 as supported alternative spellings for a recognized major-seventh meaning. Do not equate C7 with Cmaj7 or C# with Db as harmonic spellings. Unknown symbols remain unknown, are stored verbatim, and render safely as original text. The registered polychord notation uses two components separated by `|`; slash notation uses a bass note, not the same operator.

## 5. Scale and key semantics / スケール・キー

`scaleMeaning` supports explicit status, identifier, tonic, tuning, intervals and pitch classes. A recognized scale must meet the documented semantics; an unknown or vendor-specific scale should preserve `original` without fictitious canonical values. Scale annotation is descriptive: music may contain chromatic notes and notes outside the nominated scale.

## 6. Melody anchors / メロディ

`melodies[].notes` carries note IDs, time positions, durations and pitches (0–127). `melodies[].clips` binds note IDs to a section of time for exchange and lyric alignment. These are not a complete MIDI performance stream. Do not infer or export CC, bends, aftertouch or instrument configuration from the structural anchors.

## 7. Lyrics and vocal alignment / 歌詞と発音

`lyrics.documents` holds written text and optional `vocalText`; `segments` can describe words, morae, syllables or phrases. `phrases` bind document intervals to time, `units` bind text fragments to phrases, and `alignments` link units with melody note IDs. `vocalUnits` may contain pronunciation and assignments when supported. Use `indexUnit: "unicodeCodePoint"` to unambiguously count text offsets in multilingual content. Japanese mora segmentation and English syllable alignment are separate editorial decisions; this format stores annotations rather than performing linguistic segmentation itself. Older 2.1 files with no indexUnit must not be silently assumed to count Unicode codepoints.

## 8. Writing extensions safely / 拡張仕様

Readers should retain unknown fields and their JSON values without discarding metadata. Extensions must not silently change the meaning of core fields. A 2.2→2.1 conversion is lossless **only after** the full document, including extensions and newly defined metadata, is checked for representability. If not, return a refusal, warning or a separately labeled lossy export.

## 9. Security and interoperability / 安全性・相互運用

Use strict JSON processing: UTF-8 input, no duplicate object keys, no NaN/Infinity, bounded input size and no executable evaluation of extension payloads. Validate the full document in two phases: Schema (types/required fields) and semantic rules (chord spelling, references, text offsets and normalization). Python and JS reference validators are provided; they implement a particular OSTF 2.2.0 conformance scope, not every proprietary chord grammar.

## 10. Validation commands / 検証手順

From the repository root (install Python package `jsonschema` and Node.js):

```bash
python validators/full_document.py examples/2.2-standard.ostf
node validators/schema_document.js examples/2.2-standard.ostf schema/ostf-2.2.schema.json
```

For batch checking, run `python tools/validate_all_examples.py`. Use the JSON Schema path explicitly for the JavaScript entry point. An environment dependent runtime test in Live/DAW is not a required part of the Core format release qualification.

## 11. Choosing examples / サンプル案内

- `structure-*`: every documented section-role enumeration.
- `meter-*`: supported and irregular time signatures.
- `tonality-*`: common modes and tonal declarations.
- `chord-*`: fundamental chords, additions, slash chords, alterations and two-component polychords.
- `lyric-*`: Unicode codepoint positions, Japanese pronunciation and empty lyric documents.
- `melody-*`, `tempo-map`, `meter-map`, `sections-multiple`: musical timelines and melody anchors.
- `scale-*`, `unknown-extension`, `unrecognized-chord`: semantic uncertainty, backward-compatible opaque metadata, and safe degradation.

See `FIELD_REFERENCE_2_2.md` for each Schema property, `SAMPLE_CATALOG.md` for every example, `SPECIFICATION_2_2.md` for normative wording and `COMPATIBILITY_AND_LIMITATIONS.md` for scope boundaries.
