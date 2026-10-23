# Open Song Timeline Format — OSTF 2.2.0

**Official release: 2.2.0 — Core Specification.** DAW-independent song structure, harmony, tonal annotations, melody anchors and lyric alignment.

## Start here / はじめに

- [Full manual / 総合マニュアル](MANUAL_2_2.md)
- [Complete field reference / 全フィールドリファレンス](FIELD_REFERENCE_2_2.md)
- [Normative Core specification](SPECIFICATION_2_2.md)
- [Full sample catalog / サンプル一覧](SAMPLE_CATALOG.md)
- [Compatibility, release scope, limitations](COMPATIBILITY_AND_LIMITATIONS.md)
- [Machine-readable Schema](schema/ostf-2.2.schema.json)
- [Terminology registry](registry/terminology-2.2.json) and [source chord dialect registry](registry/chord-dialects-2.2.json)

All `.ostf` examples are in [`examples/`](examples/). Reference validators are in [`validators/`](validators/). Validate from repository root using the instructions in the manual.

OSTF is not MIDI/audio, and supported chord notation is a finite standardized grammar. The original input remains authoritative when an imported notation is unknown. Older versions and applications should never silently drop unknown extension data.
