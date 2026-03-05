<div align="center">

# 🤖 pdf-scan-autofill-ai

### AI-powered PDF Scanner that Auto-fills Forms using Google Gemini

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> Upload any PDF → Gemini AI reads it → Form fills itself automatically ✨

</div>

---

## 📋 Overview

**pdf-scan-autofill-ai** is an Angular web application that uses the **Google Gemini AI API** to intelligently extract structured data from PDF files and automatically populate form fields — with zero manual input.

It works on **both types of PDFs**:

| PDF Type | How It Works | Accuracy |
|---|---|---|
| 📄 Text-based PDF | Gemini reads embedded text directly | ✅ Very High |
| 🖼️ Scanned / Image PDF | Gemini Vision OCR processes the image | ✅ High |

---

## ✨ Features

- 📤 **PDF Upload** — Simple file select interface
- 🔍 **Smart Extraction** — Gemini reads both text and scanned PDFs
- 📝 **Auto Form Fill** — Extracted data patches the form automatically
- 🧠 **Structured AI Output** — Uses Gemini's `responseSchema` for reliable JSON
- ⚡ **Reactive UI** — Built with Angular Signals for real-time state
- 🔑 **API Key Management** — Supports AI Studio key selector

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 14+ (Standalone Components) |
| AI Model | `gemini-2.0-flash-preview` |
| AI SDK | `@google/genai` |
| PDF Handling | Base64 inline — no server upload needed |
| OCR | Built-in via Gemini Vision |
| Forms | Angular Reactive Forms |
| UI | Angular Material |
| State Management | Angular Signals |
| Language | TypeScript |

---

## ⚙️ How It Works

```
📂 User uploads PDF
        ↓
🔄 File converted to Base64
        ↓
🤖 Sent to Gemini API (text + scanned both supported)
        ↓
📦 Gemini returns structured JSON (responseSchema)
        ↓
✅ Angular form auto-filled with extracted data
```

### Extracted Fields

| Field | Type | Description |
|---|---|---|
| `numberOfColors` | Number | Total number of colors |
| `colorNames` | String | Names of all colors used |
| `height` | Number | Height dimension |
| `width` | Number | Width dimension |
| `stitches` | Number | Total stitch count |

---

## 🤖 Gemini API Configuration

```typescript
const response = await ai.models.generateContent({
  model: "gemini-2.0-flash-preview",
  contents: [{
    parts: [
      { inlineData: { mimeType: "application/pdf", data: base64Data } },
      { text: "Extract: numberOfColors, colorNames, height, width, stitches" }
    ]
  }],
  config: {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        numberOfColors: { type: Type.NUMBER },
        colorNames:     { type: Type.STRING },
        height:         { type: Type.NUMBER },
        width:          { type: Type.NUMBER },
        stitches:       { type: Type.NUMBER }
      },
      required: ["numberOfColors", "colorNames"]
    }
  }
});
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Angular CLI 14+
- Google Gemini API Key → [Get it free here](https://aistudio.google.com/app/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/Muhammad-Rameez-Ahmed/pdf-scan-autofill-ai.git

# Navigate into project
cd pdf-scan-autofill-ai

# Install dependencies
npm install
```

### Configure API Key

Open `src/app/app.ts` and replace the API key:

```typescript
const apiKey = "YOUR_GEMINI_API_KEY_HERE";
```

### Run

```bash
ng serve
```

Open your browser at **http://localhost:4200**

---

## 📁 Project Structure

```
pdf-scan-autofill-ai/
├── src/
│   └── app/
│       ├── app.ts        # Main component + Gemini logic
│       ├── app.html      # Form template
│       └── app.css       # Styles
├── angular.json
├── package.json
└── README.md
```

---

## 👨‍💻 Author

**Muhammad Rameez Ahmed**  
Software Engineer | AI Integration Specialist

<p align="left">
  <a href="https://linkedin.com/in/muhammadrameez-ahmed" target="_blank">
    <img src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" height="30" width="30" />
  </a>&nbsp;&nbsp;
  <a href="https://github.com/Muhammad-Rameez-Ahmed" target="_blank">
    <img src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/github.svg" height="30" width="30" />
  </a>&nbsp;&nbsp;
  <a href="mailto:muhammadrameezahmed73@gmail.com">
    <img src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/google.svg" height="30" width="30" />
  </a>
</p>

---

<div align="center">

⭐ **If this project helped you, please give it a star!** ⭐

</div>
