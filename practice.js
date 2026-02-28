/**
 * Chord-e Practice Add-on v1.2
 * [Fixed] chorde.jsによるプログラム的な値の更新を検知するように修正
 */

const PRACTICE_CONFIG = {
  words: [
    "the",
    "of",
    "and",
    "a",
    "to",
    "in",
    "is",
    "you",
    "that",
    "it",
    "he",
    "was",
    "for",
    "on",
    "are",
    "as",
    "with",
    "his",
    "they",
    "at",
    "be",
    "this",
    "have",
    "from",
    "or",
    "one",
    "had",
    "by",
    "word",
    "but",
    "not",
    "what",
    "all",
    "were",
    "we",
    "when",
    "your",
    "can",
    "said",
    "there",
    "use",
    "an",
    "each",
    "which",
    "she",
    "do",
    "how",
    "their",
    "if",
    "will",
  ],
  displayId: "practice-target",
  statsId: "practice-stats",
};

let currentTarget = "";
let correctCount = 0;
let lastValue = "";

function initPractice() {
  const log = document.getElementById("output-log");
  if (!log) return;

  // UI生成
  const practiceUI = document.createElement("div");
  practiceUI.id = "practice-container";
  practiceUI.innerHTML = `
    <div style="background:#1a1a1a; padding:15px; border-radius:8px; margin-bottom:10px; border:2px solid #333; text-align:center;">
      <div style="font-size:0.7rem; color:#666; text-transform:uppercase; letter-spacing:1px;">Target</div>
      <div id="practice-target" style="font-size:2.2rem; font-weight:bold; color:#00e676; font-family: 'Courier New', monospace;">---</div>
      <div id="practice-stats" style="font-size:0.8rem; color:#999; margin-top:10px; border-top:1px solid #333; padding-top:5px;">
        Cleared: <span id="correct-count" style="color:#fff; font-weight:bold;">0</span>
      </div>
    </div>
  `;
  log.parentNode.insertBefore(practiceUI, log);

  setNextWord();

  // ★ 解決策: 定期的にテキストエリアの内容をチェックする（影響最小・確実）
  setInterval(() => {
    const currentValue = log.value;
    if (currentValue !== lastValue) {
      checkLogic(currentValue);
      lastValue = currentValue;
    }
  }, 100); // 0.1秒ごとにチェック
}

function checkLogic(text) {
  // スペース(23)が入力されたかチェック
  if (text.endsWith(" ")) {
    const wordsInLog = text.trim().split(/\s+/);
    const lastTypedWord = wordsInLog[wordsInLog.length - 1];

    if (
      lastTypedWord &&
      lastTypedWord.toLowerCase() === currentTarget.toLowerCase()
    ) {
      processCorrect();
    }
  }
}

function setNextWord() {
  const words = PRACTICE_CONFIG.words;
  currentTarget = words[Math.floor(Math.random() * words.length)];
  document.getElementById(PRACTICE_CONFIG.displayId).innerText = currentTarget;
}

function processCorrect() {
  correctCount++;
  const countEl = document.getElementById("correct-count");
  if (countEl) countEl.innerText = correctCount;

  const targetEl = document.getElementById(PRACTICE_CONFIG.displayId);
  targetEl.style.transition = "none";
  targetEl.style.color = "#fff";

  setTimeout(() => {
    targetEl.style.transition = "color 0.5s";
    targetEl.style.color = "#00e676";
    setNextWord();
  }, 100);
}

// 初期化実行
initPractice();
