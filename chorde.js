/**
 * Chord-e Core Engine
 * 指定された5つのキー入力を1つの和音として集約し、文字を出力する
 */

const CONFIG = {
  mapping: {
    Space: 16,
    KeyJ: 8,
    KeyK: 4,
    KeyL: 2,
    Semicolon: 1,
  },
  // 基本の和音テーブル（適宜拡張してください）
  chordTable: {
    // --- 1ビット（最優先：出現頻度トップ5） ---
    16: "e", // Thumb (親指)
    8: "a", // Index (人差し指)
    4: "i", // Middle (中指)
    2: "n", // Ring (薬指)
    1: "s", // Pinky (小指)

    // --- 2ビット（隣接押し：スムーズな連携） ---
    24: "t", // 16+8 (親+人)
    12: "r", // 8+4  (人+中)
    6: "o", // 4+2  (中+薬)
    3: "l", // 2+1  (薬+小)

    // --- 2ビット（非隣接・その他高頻度） ---
    20: "d", // 16+4
    10: "h", // 8+2
    5: "u", // 4+1
    18: "c", // 16+2
    9: "m", // 8+1
    17: "f", // 16+1

    // --- 3ビット（中頻度文字） ---
    28: "p", // 16+8+4
    14: "g", // 8+4+2
    7: "y", // 4+2+1
    26: "w", // 16+8+2
    13: "b", // 8+4+1
    22: "v", // 16+4+2
    11: "k", // 8+2+1

    // --- 4ビット・5ビット（低頻度文字・特殊） ---
    30: "x", // 16+8+4+2
    15: "j", // 8+4+2+1
    29: "q", // 16+8+4+1
    27: "z", // 16+8+2+1
    23: " ", // 16+4+2+1 (スペース - 親指を含む複雑な和音)
    21: "!", // 16+4+1
    25: "?", // 16+8+1
    19: ".", // 16+2+1
    31: "\n", // 全押し (改行)
  },
};

let currentChord = 0;
let activeKeys = new Set();

const elements = {
  bits: document.querySelectorAll(".bit"),
  log: document.getElementById("output-log"),
  charDisplay: document.getElementById("current-char"),
  codeDisplay: document.getElementById("current-code"),
  resetBtn: document.getElementById("btn-reset"),
};

// 入力監視
window.addEventListener("keydown", (e) => {
  const bit = CONFIG.mapping[e.code];
  if (bit && !activeKeys.has(e.code)) {
    e.preventDefault();
    activeKeys.add(e.code);
    currentChord |= bit;
    updateUI();
  }
});

window.addEventListener("keyup", (e) => {
  const bit = CONFIG.mapping[e.code];
  if (bit) {
    e.preventDefault();

    // 和音が確定したとみなし、文字を出力
    const char = CONFIG.chordTable[currentChord] || "";
    if (char) {
      elements.log.value += char;
      elements.charDisplay.innerText = char === "\n" ? "Enter" : char;
    }

    // リセット
    activeKeys.delete(e.code);
    if (activeKeys.size === 0) {
      currentChord = 0;
      updateUI();
    }
  }
});

function updateUI() {
  // ビットランプの更新
  elements.bits.forEach((el) => {
    const val = parseInt(el.id.split("-")[1]);
    el.classList.toggle("active", currentChord & val);
  });

  // バイナリ表示の更新
  elements.codeDisplay.innerText = `Binary: ${currentChord.toString(2).padStart(5, "0")}`;
}

elements.resetBtn.addEventListener("click", () => {
  elements.log.value = "";
  elements.charDisplay.innerText = "Ready";
});
