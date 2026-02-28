/**
 * Chord-e Core Engine v1.8 (Master Edition)
 * --------------------------------------------------
 * [Concept] 150-Year QWERTY Constraint Evolution
 * [Layout]  Vowel-Centric (Thumb: e)
 * [Features]
 * - Tras: Toggle Numeric Layer (Long-press 24)
 * - BS: BackSpace (Thumb isolation: 15)
 * - Master Gate: 'q' (Ring finger isolation: 29)
 * --------------------------------------------------
 */

const CONFIG = {
  mapping: {
    // Desktop Keys
    Space: 16,
    KeyJ: 8,
    KeyK: 4,
    KeyL: 2,
    Semicolon: 1,
    // Numpad Support
    Numpad0: 16,
    Numpad1: 8,
    Numpad2: 4,
    Numpad3: 2,
    NumpadDecimal: 1,
  },

  // Default Layer (Alphabet & Essential Functions)
  defaultTable: {
    16: "e",
    8: "a",
    4: "i",
    2: "u",
    1: "o", // Vowels
    24: "t",
    12: "n",
    6: "s",
    3: "r",
    20: "k", // High frequency
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
    27: "z",
    29: "q", // 29: Master Gate (Ring isolation)
    15: "\b", // BackSpace (Thumb isolation)
    23: " ", // Space
    19: ".",
    17: ",",
    31: "\n", // Total Release
  },

  // Numeric Layer (Toggled by 24 long-press)
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
    21: "!",
    25: "?",
    19: ".",
    31: "\n",
  },
};

let currentChord = 0;
let chordMaxState = 0; // Latch for preventing double-fire on keyup
let activeKeys = new Set();
let isNumericLayer = false;
let pressStartTime = 0;
const TOGGLE_THRESHOLD = 500; // ms

const elements = {
  bits: document.querySelectorAll(".bit"),
  log: document.getElementById("output-log"),
  charDisplay: document.getElementById("current-char"),
  codeDisplay: document.getElementById("current-code"),
  resetBtn: document.getElementById("btn-reset"),
};

// Input Handling
window.addEventListener("keydown", (e) => {
  const bit = CONFIG.mapping[e.code];
  if (bit && !activeKeys.has(e.code)) {
    e.preventDefault();

    if (activeKeys.size === 0) {
      pressStartTime = Date.now();
      chordMaxState = 0;
    }

    activeKeys.add(e.code);
    currentChord |= bit;
    chordMaxState |= bit; // Record the maximum chord reached
    updateUI();
  }
});

window.addEventListener("keyup", (e) => {
  const bit = CONFIG.mapping[e.code];
  if (bit) {
    e.preventDefault();
    activeKeys.delete(e.code);

    // Process only when ALL keys are released
    if (activeKeys.size === 0) {
      const duration = Date.now() - pressStartTime;

      // Check for Layer Toggle (24: Thumb + Index)
      if (chordMaxState === 24 && duration > TOGGLE_THRESHOLD) {
        isNumericLayer = !isNumericLayer;
        showModeFeedback();
        // ★追加: レイヤーが切り替わったので表を再生成する
        generateReferenceTable();
      } else {
        const table = isNumericLayer
          ? CONFIG.numericTable
          : CONFIG.defaultTable;
        const char = table[chordMaxState] || "";

        processOutput(char);
      }

      // Reset for next stroke
      currentChord = 0;
      chordMaxState = 0;
      updateUI();
    }
  }
});

function processOutput(char) {
  if (!char) return;

  if (char === "\b") {
    // Execute BackSpace
    elements.log.value = elements.log.value.slice(0, -1);
    elements.charDisplay.innerText = "BS";
  } else {
    // Normal output
    elements.log.value += char;
    elements.charDisplay.innerText = char === "\n" ? "Enter" : char;
    elements.log.scrollTop = elements.log.scrollHeight;
  }
}

function updateUI() {
  elements.bits.forEach((el) => {
    const val = parseInt(el.id.split("-")[1]);
    el.classList.toggle("active", currentChord & val);
  });

  const display = elements.codeDisplay;
  if (isNumericLayer) {
    display.innerText = "LAYER: NUMERIC";
    display.style.color = "#ff9800";
  } else {
    display.innerText = `Binary: ${currentChord.toString(2).padStart(5, "0")}`;
    display.style.color = "";
  }
}

function showModeFeedback() {
  const modeName = isNumericLayer ? "NUM MODE" : "ABC MODE";
  elements.charDisplay.innerText = modeName;
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

/**
 * リファレンス表の動的生成
 */
function generateReferenceTable() {
  // 現在のレイヤー（ABCかNUMか）に応じてテーブルを切り替える
  const table = isNumericLayer ? CONFIG.numericTable : CONFIG.defaultTable;

  const leftSidebar = document.getElementById("left-sidebar");
  const rightSidebar = document.getElementById("right-sidebar");

  // ガード：要素が見つからない場合は何もしない（エラー回避）
  if (!leftSidebar || !rightSidebar) return;

  // アルファベット順（A-Z）にソート。ただし特殊文字は最後に。
  const sortedKeys = Object.keys(table).sort((a, b) => {
    const charA = table[a].toLowerCase();
    const charB = table[b].toLowerCase();

    const getWeight = (c) => {
      if (c === "\n") return "zzz3"; // Enter
      if (c === "\b") return "zzz2"; // BS
      if (c === " ") return "zzz1"; // Space
      return c;
    };

    const wA = getWeight(charA);
    const wB = getWeight(charB);
    return wA.localeCompare(wB);
  });

  const midPoint = Math.ceil(sortedKeys.length / 2);

  const createEntry = (key) => {
    const val = parseInt(key);
    let char = table[key];

    // ラベルの変換
    if (char === "\n") char = "ENT";
    if (char === "\b") char = "BS";
    if (char === " ") char = "SPC";

    // 5つの〇を生成 (親、人、中、薬、小)
    let binaryVisual = "";
    [16, 8, 4, 2, 1].forEach((bit) => {
      const isActive = val & bit;
      binaryVisual += `<span class="dot ${isActive ? "on" : "off"}">〇</span>`;
    });

    return `<div class="ref-entry">
              <span class="ref-char">${char}</span>
              <span class="ref-bits">${binaryVisual}</span>
            </div>`;
  };

  leftSidebar.innerHTML = sortedKeys
    .slice(0, midPoint)
    .map(createEntry)
    .join("");
  rightSidebar.innerHTML = sortedKeys.slice(midPoint).map(createEntry).join("");
}

// 【重要】DOMの読み込みが終わってから呼び出す
document.addEventListener("DOMContentLoaded", generateReferenceTable);
