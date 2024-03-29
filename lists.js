export const bookTitles = [
  "Chapter \\d+", // English
  "Chapitre \\d+", // French
  "Capítulo \\d+", // Spanish
  "Kapitel \\d+", // German
  "Capitolo \\d+", // Italian
  "Capítulo \\d+", // Portuguese
  "Hoofdstuk \\d+", // Dutch
  "Kapitel \\d+", // Swedish
  "Kapittel \\d+", // Norwegian
  "Kapitel \\d+", // Danish
  "Luku \\d+", // Finnish
  "Глава \\d+", // Russian
  "Rozdział \\d+", // Polish
  "Κεφάλαιο \\d+", // Greek
  "Fejezet \\d+", // Hungarian
  "Kapitola \\d+", // Czech
  "Kapitola \\d+", // Slovak
  "del\\d+",
];

export const classicalTitles = [
  "Opus \\d+",
  "Op. \\d+",
  "Op \\d+",
  "Opus No",
  "Op No",
  "Op. No",
  "Opus Num",
  "Op. Num",
  "Op Num",
  // "K. \\d+", // Mozart
  // "K \\d+",
  // "KV \\d+",
  // "Köchel \\d+",
  // "BWV \\d+", // Bach
  // "HWV \\d+", // Handel
  // "D. \\d+", // Schubert
  // "D \\d+",
];

export const happyBirthdayTitles = ["Happy Birthday To"];

//Unicode ranges
export const ranges = [
  { min: 32, max: 126 }, // Basic ASCII characters
  { min: 128, max: 255 }, // Extended ASCII characters
  { min: 256, max: 383 }, // Latin Extended-A
  { min: 384, max: 591 }, // Latin Extended-B
  { min: 592, max: 687 }, // Latin Extended Additional
  { min: 688, max: 767 }, // IPA Extensions
  { min: 768, max: 879 }, // Spacing Modifier Letters
  { min: 880, max: 1023 }, // Greek and Coptic
  { min: 1024, max: 1279 }, // Cyrillic
  { min: 1280, max: 1327 }, // Armenian
  { min: 1328, max: 1423 }, // Hebrew
  { min: 1424, max: 1535 }, // Arabic
  { min: 1536, max: 1791 }, // Syriac
  { min: 1792, max: 1871 }, // Thaana
  { min: 1872, max: 1919 }, // NKo
  { min: 1920, max: 1983 }, // Samaritan
  { min: 1984, max: 2047 }, // Mandaic
  { min: 2048, max: 2111 }, // Syriac Supplement
  { min: 2112, max: 2143 }, // Arabic Extended-A
  { min: 2144, max: 2207 }, // Devanagari
  { min: 2208, max: 2303 }, // Bengali
  { min: 2304, max: 2431 }, // Gurmukhi
  { min: 2432, max: 2559 }, // Gujarati
  { min: 2560, max: 2687 }, // Oriya
  { min: 2688, max: 2815 }, // Tamil
  { min: 2816, max: 2943 }, // Telugu
  { min: 2944, max: 3071 }, // Kannada
  { min: 3072, max: 3199 }, // Malayalam
  { min: 3200, max: 3327 }, // Sinhala
  { min: 3328, max: 3455 }, // Thai
  { min: 3456, max: 3583 }, // Lao
  { min: 3584, max: 3711 }, // Tibetan
  { min: 3712, max: 3839 }, // Myanmar
  { min: 3840, max: 4095 }, // Georgian
  { min: 4096, max: 4255 }, // Hangul Jamo
  { min: 4256, max: 4351 }, // Ethiopic
  { min: 4352, max: 4607 }, // Cherokee
  { min: 4608, max: 4991 }, // Unified Canadian Aboriginal Syllabics
  { min: 4992, max: 5023 }, // Ogham
  { min: 5024, max: 5119 }, // Runic
  { min: 5120, max: 5759 }, // Khmer
  { min: 5760, max: 5791 }, // Mongolian
  { min: 5792, max: 5887 }, // Braille Patterns
  { min: 5888, max: 5919 }, // Yi Syllables
  { min: 5920, max: 5951 }, // Tagalog
  { min: 5952, max: 5983 }, // Old Italic
  { min: 5984, max: 6015 }, // Gothic
  { min: 6016, max: 6143 }, // Deseret
  { min: 6144, max: 6319 }, // Byzantine Musical Symbols
  { min: 6320, max: 6399 }, // Musical Symbols
  { min: 6400, max: 6479 }, // Ancient Greek Musical Notation
  { min: 6480, max: 6527 }, // Tai Xuan Jing Symbols
  { min: 6528, max: 6623 }, // Mathematical Alphanumeric Symbols
  { min: 6624, max: 6655 }, // CJK Unified Ideographs Extension A
  { min: 6656, max: 6687 }, // CJK Unified Ideographs
  { min: 6688, max: 6751 }, // Yi Radicals
  { min: 6752, max: 6783 }, // Vai
  { min: 6784, max: 6799 }, // Cyrillic Extended-B
  { min: 6800, max: 6911 }, // Modifier Tone Letters
  { min: 6912, max: 7039 }, // Latin Extended-D
  { min: 7040, max: 7103 }, // Syloti Nagri
  { min: 7104, max: 7167 }, // Common Indic Number Forms
  { min: 7168, max: 7247 }, // Phags-pa
  { min: 7248, max: 7295 }, // Saurashtra
  { min: 7296, max: 7359 }, // Devanagari Extended
  { min: 7360, max: 7375 }, // Kayah Li
  { min: 7376, max: 7423 }, // Rejang
  { min: 7424, max: 7551 }, // Hangul Jamo Extended-A
  { min: 7552, max: 7615 }, // Javanese
  { min: 7616, max: 7679 }, // Myanmar Extended-B
  { min: 7680, max: 7935 }, // Latin Extended Additional
  { min: 7936, max: 8191 }, // Greek Extended
  { min: 8192, max: 8303 }, // General Punctuation
  { min: 8304, max: 8351 }, // Superscripts and Subscripts
  { min: 8352, max: 8399 }, // Currency Symbols
  { min: 8400, max: 8447 }, // Combining Diacritical Marks for Symbols
  { min: 8448, max: 8527 }, // Letterlike Symbols
  { min: 8528, max: 8591 }, // Number Forms
  { min: 8592, max: 8703 }, // Arrows
  { min: 8704, max: 8959 }, // Mathematical Operators
  { min: 8960, max: 9215 }, // Miscellaneous Technical
  { min: 9216, max: 9279 }, // Control Pictures
  { min: 9280, max: 9311 }, // Optical Character Recognition
  { min: 9312, max: 9471 }, // Enclosed Alphanumerics
  { min: 9472, max: 9599 }, // Box Drawing
  { min: 9600, max: 9631 }, // Block Elements
  { min: 9632, max: 9727 }, // Geometric Shapes
  { min: 9728, max: 9983 }, // Miscellaneous Symbols
  { min: 9984, max: 10111 }, // Dingbat
  { min: 10112, max: 10191 }, // Miscellaneous Mathematical Symbols-A
  { min: 10192, max: 10223 }, // Supplemental Arrows-A
  { min: 10224, max: 10239 }, // Braille Patterns
  { min: 10240, max: 10495 }, // CJK Unified Ideographs Extension B
  { min: 10496, max: 10623 }, // CJK Unified Ideographs Extension C
  { min: 10624, max: 10751 }, // CJK Unified Ideographs Extension D
  { min: 10752, max: 11007 }, // CJK Compatibility Ideographs Supplement
  { min: 11008, max: 11263 }, // CJK Unified Ideographs Extension E
  { min: 11264, max: 11359 }, // CJK Unified Ideographs Extension F
  { min: 11360, max: 11391 }, // Vertical Forms
  { min: 11392, max: 11519 }, // Combining Half Marks
  { min: 11520, max: 11567 }, // CJK Compatibility Forms
  { min: 11568, max: 11647 }, // Small Form Variants
  { min: 11648, max: 11743 }, // Arabic Presentation Forms-A
  { min: 11744, max: 11775 }, // Variation Selectors
  { min: 11776, max: 11903 }, // Vertical Forms
  { min: 11904, max: 12031 }, // Combining Half Marks
  { min: 12032, max: 12255 }, // CJK Compatibility Forms
  { min: 12256, max: 12287 }, // Small Form Variants
  { min: 12288, max: 12351 }, // CJK Symbols and Punctuation
  { min: 12352, max: 12447 }, // Hiragana
  { min: 12448, max: 12543 }, // Katakana
  { min: 12544, max: 12591 }, // Bopomofo
  { min: 12592, max: 12687 }, // Hangul Compatibility Jamo
  { min: 12688, max: 12703 }, // Kanbun
  { min: 12704, max: 12735 }, // Bopomofo Extended
  { min: 12736, max: 12783 }, // CJK Strokes
  { min: 12784, max: 12799 }, // Katakana Phonetic Extensions
  { min: 12800, max: 13055 }, // Enclosed CJK Letters and Months
  { min: 13056, max: 13311 }, // CJK Compatibility
  { min: 13312, max: 19903 }, // CJK Unified Ideographs Extension G
  { min: 19904, max: 19967 }, // CJK Compatibility Ideographs
  { min: 19968, max: 40959 }, // CJK Unified Ideographs
  { min: 40960, max: 42127 }, // Yi Syllables
  { min: 42128, max: 42191 }, // Yi Radicals
  { min: 42192, max: 42239 }, // Lisu
  { min: 42240, max: 42559 }, // Vai
  { min: 42560, max: 42655 }, // Cyrillic Extended-C
  { min: 42656, max: 42751 }, // Bamum
  { min: 42752, max: 42783 }, // Modifier Tone Letters
  { min: 42784, max: 43007 }, // Latin Extended-D
  { min: 43008, max: 43055 }, // Syloti Nagri
  { min: 43056, max: 43071 }, // Common Indic Number Forms
  { min: 43072, max: 43135 }, // Phags-pa
  { min: 43136, max: 43231 }, // Saurashtra
  { min: 43232, max: 43263 }, // Devanagari Extended
  { min: 43264, max: 43311 }, // Kayah Li
  { min: 43312, max: 43359 }, // Rejang
  { min: 43360, max: 43391 }, // Hangul Jamo Extended-A
  { min: 43392, max: 43487 }, // Javanese
  { min: 43488, max: 43519 }, // Myanmar Extended-B
  { min: 43520, max: 43583 }, // Cham
  { min: 43584, max: 43599 }, // Myanmar Extended-A
  { min: 43600, max: 43647 }, // Tai Viet
  { min: 43648, max: 43743 }, // Meetei Mayek Extensions
  { min: 43744, max: 43775 }, // Ethiopic Extended-A
  { min: 43776, max: 43823 }, // Latin Extended-E
  { min: 43824, max: 43887 }, // Cherokee Supplement
  { min: 43888, max: 43967 }, // Meetei Mayek
  { min: 43968, max: 44031 }, // Hangul Syllables
  { min: 44032, max: 55215 }, // Hangul Jamo Extended-B
  { min: 55216, max: 55295 }, // High Surrogates
  { min: 55296, max: 56191 }, // High Private Use Surrogates
  { min: 56192, max: 56319 }, // Low Surrogates
  { min: 56320, max: 57343 }, // Private Use Area
  { min: 57344, max: 63743 }, // CJK Compatibility Ideographs
  { min: 63744, max: 64255 }, // Alphabetic Presentation Forms
  { min: 64256, max: 64335 }, // Arabic Presentation Forms-B
  { min: 64336, max: 65023 }, // Small Form Variants
  { min: 65024, max: 65039 }, // Combining Half Marks
  { min: 65040, max: 65055 }, // CJK Compatibility Forms
  { min: 65056, max: 65071 }, // Small Form Variants
  { min: 65072, max: 65103 }, // Alphabetic Presentation Forms
  { min: 65104, max: 65135 }, // Arabic Presentation Forms-A
  { min: 65136, max: 65279 }, // Halfwidth and Fullwidth Forms
  { min: 65280, max: 65519 }, // Specials
  { min: 65520, max: 65535 }, // Specials
];
