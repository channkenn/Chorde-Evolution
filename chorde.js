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
    // --- 1ビット：母音 (Vowels) ---
    16: "a", // Thumb (親指)
    8: "i", // Index (人差し指)
    4: "u", // Middle (中指)
    2: "e", // Ring (薬指)
    1: "o", // Pinky (小指)

    // --- 2ビット：高頻度子音 (High-frequency Consonants) ---
    24: "t", // 16+8 (親+人)
    12: "n", // 8+4  (人+中)
    6: "s", // 4+2  (中+薬)
    3: "r", // 2+1  (薬+小)
    20: "k", // 16+4
    10: "m", // 8+2
    5: "h", // 4+1
    18: "y", // 16+2
    9: "w", // 8+1
    17: "d", // 16+1

    // --- 3ビット：中頻度文字 ---
    28: "g", // 16+8+4
    14: "b", // 8+4+2
    7: "p", // 4+2+1
    26: "f",
    13: "v",
    22: "c",
    11: "l",

    // --- 4ビット・5ビット：低頻度・特殊 ---
    30: "x",
    15: "j",
    29: "q",
    27: "z",
    23: " ", // スペース
    21: "!",
    25: "?",
    19: ".",
    31: "\n", // 全押し (改行/放出)
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
