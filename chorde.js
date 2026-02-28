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
    16: "e",
    8: "a",
    24: "t",
    4: "i",
    2: "n",
    1: "s",
    31: "\n", // 全押しで改行
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
