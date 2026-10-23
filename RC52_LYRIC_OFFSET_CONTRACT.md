# RC52 — lyric offsets (normative extension)

When `lyrics.indexUnit` is `unicodeCodePoint`, validators MUST check segment indices against the selected `text`/`vocalText` Unicode scalar-value length; phrase offsets against the referenced document `text` and unit offsets against its referenced phrase. End offsets are exclusive. References to missing documents/phrases are errors. When the indexUnit is absent (older 2.1 files), implementations MUST preserve the data without silently assuming a unit. This release does not imply grapheme-cluster alignment or normalization.
