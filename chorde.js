/**
 * Chord-e Core Engine v1.5
 * 黄金配列 v1.1 + トグル式Tras (時間判定による't'との打ち分け)
 */

const CONFIG = {
  mapping: {
    Space: 16,
    KeyJ: 8,
    KeyK: 4,
    KeyL: 2,
    Semicolon: 1,
    Numpad0: 16,
    Numpad1: 8,
    Numpad2: 4,
    Numpad3: 2,
    NumpadDecimal: 1,
  },
  // 通常レイヤー
  defaultTable: {
    16: "a",
    8: "i",
    4: "u",
    2: "e",
    1: "o",
    24: "t",
    12: "n",
    6: "s",
    3: "r",
    20: "k",
    10: "m",
    5: "h",
    18: "y",
    9: "w",
    17: "d",
    28: "g",
    14: "b",
    7: "p",
    26: "f",
    13: "v",
    22: "c",
    11: "l",
    30: "x",
    15: "j",
    29: "q",
    27: "z",
    23: " ",
    21: "!",
    25: "?",
    19: ".",
    31: "\n",
  },
  // 数字レイヤー (トグル後)
  numericTable: {
    16: "0",
    8: "1",
    4: "2",
    2: "3",
    1: "4",
    12: "5",
    6: "6",
    3: "7",
    20: "8",
    10: "9",
    31: "\n",
  },
};

let currentChord = 0;
let activeKeys = new Set();
let isNumericLayer = false;
let pressStartTime = 0;
const TOGGLE_THRESHOLD = 300; // 300ms以上の長押しでレイヤー切り替え

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

    // 最初のキーが押された瞬間にタイマー開始
    if (activeKeys.size === 0) {
      pressStartTime = Date.now();
    }

    activeKeys.add(e.code);
    currentChord |= bit;
    updateUI();
  }
});

window.addEventListener("keyup", (e) => {
  const bit = CONFIG.mapping[e.code];
  if (bit) {
    e.preventDefault();

    // 全ての指が離れたタイミングで確定
    if (activeKeys.size === 1) {
      const duration = Date.now() - pressStartTime;
      const table = isNumericLayer ? CONFIG.numericTable : CONFIG.defaultTable;

      // 「24」の入力かつ、閾値を超えた長押しならトグル
      if (currentChord === 24 && duration > TOGGLE_THRESHOLD) {
        isNumericLayer = !isNumericLayer;
        showModeFeedback();
      } else {
        // 通常の文字出力
        const char = table[currentChord] || "";
        if (char) {
          elements.log.value += char;
          elements.charDisplay.innerText = char === "\n" ? "Enter" : char;
          elements.log.scrollTop = elements.log.scrollHeight;
        }
      }
    }

    activeKeys.delete(e.code);
    if (activeKeys.size === 0) {
      currentChord = 0;
      updateUI();
    }
  }
});

function updateUI() {
  elements.bits.forEach((el) => {
    const val = parseInt(el.id.split("-")[1]);
    el.classList.toggle("active", currentChord & val);
  });

  if (isNumericLayer) {
    elements.codeDisplay.innerText = "LAYER: NUMERIC";
    elements.codeDisplay.style.color = "#ff9800";
  } else {
    elements.codeDisplay.innerText = `Binary: ${currentChord.toString(2).padStart(5, "0")}`;
    elements.codeDisplay.style.color = "";
  }
}

function showModeFeedback() {
  const modeName = isNumericLayer ? "NUM MODE" : "ABC MODE";
  elements.charDisplay.innerText = modeName;
  // 視覚的なフィードバックを強調
  elements.charDisplay.style.color = "#ff9800";
  setTimeout(() => {
    elements.charDisplay.style.color = "";
    if (activeKeys.size === 0) elements.charDisplay.innerText = "Ready";
  }, 1000);
}

elements.resetBtn.addEventListener("click", () => {
  elements.log.value = "";
  elements.charDisplay.innerText = "Ready";
});
