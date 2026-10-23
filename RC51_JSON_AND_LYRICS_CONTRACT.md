# RC51 — Strict JSON ingestion and Unicode lyric offsets

1. All normative file-based Python and JavaScript document validators SHALL reject duplicate JSON members, NaN/Infinity, malformed UTF-8 and inputs larger than 8,388,608 bytes. Byte limits apply before decoding, not to character count.
2. An optional `lyrics.indexUnit = "unicodeCodePoint"` specifies zero-based Unicode scalar-value indices for textual start/end offsets. End offsets are exclusive. UTF-8 bytes, UTF-16 code units and grapheme clusters MUST NOT be treated as equivalent.
3. For 2.1 backward compatibility the property is optional. When absent, consumers SHALL NOT silently infer a byte or grapheme interpretation. Producers of new indexed 2.2 lyrics SHOULD declare this property. Tick-based alignments remain timeline ticks, not character offsets.
4. RC51 does not establish grapheme-cluster boundary validation, automatic Unicode normalization or full music-software interoperability.
