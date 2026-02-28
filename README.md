# 🎹 Chord-e Evolution Project

## Beyond the 150-Year QWERTY Constraint

### Live Demo

🚀 **[Try Chord-e Evolution in your browser](https://channkenn.github.io/Chorde-Evolution/)**

### Standard Layout v1.1 (Vowel-Centric)

Optimized for intuitive vowel access and Roman-alphabet/English synergy.

| Chord (Bits)  |  Char  | Description               |
| :------------ | :----: | :------------------------ |
| **16**        | **a**  | Thumb                     |
| **8**         | **i**  | Index                     |
| **4**         | **u**  | Middle                    |
| **2**         | **e**  | Ring                      |
| **1**         | **o**  | Pinky                     |
| **24 (16+8)** | **t**  | High Frequency Consonant  |
| **31 (All)**  | **\n** | **Total Release (Enter)** |

_For the full 32-state mapping, see `chorde.js`._

---

## 日本語コンセプト (Concept)

150年前のQWERTYからの脱却。5ビットの和音（Chord）による「思考の直接出力」を目指すインターフェース。

### ライブデモ (Live Demo)

🚀 **[ブラウザでChord-eを試す](https://channkenn.github.io/Chorde-Evolution/)**

### 黄金配列 v1.0 (Standard Layout)

最も頻出する文字を1ビットに、次に頻出する文字を隣接する2ビットに配置した、エルゴノミクス重視の公式配列です。

- **1ビット (単押し):** e, a, i, n, s （全英文の約35%をカバー）
- **2ビット (隣接押し):** t, r, o, l （流れるような運指を実現）
- **全押し (31):** 改行（思考の放出と一区切り）

### 推奨ハードウェア (Recommended Hardware)

- **Realforce 23U** (静電容量無接点方式テンキー)
- その他、USBテンキーボード

> ### Developer Note
>
> これは速度を競うものではない。自分だけの「5ビット・ホール」を見つけ、生命の爆発を記録するためのプロトコルである。
