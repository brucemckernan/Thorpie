# Thorpie — The Ignorant Oracle of t'North

> "The artificial idiot. Ask him owt. Regret it immediately."

Thorpie is a comic parody chatbot in the style of a stubbornly ignorant, blunt, and proudly parochial Yorkshireman. Ask him anything. He'll answer with absolute confidence and magnificent wrongness.

---

## Features

- **Q&A interface** — Ask Thorpie any question, receive a response in Yorkshire dialect
- **Voice input** — Speak your question via Web Speech API (STT)
- **Voice output** — Hear Thorpie's wisdom via browser TTS (pitch/speed controls, voice selection)
- **Claude-powered** — Character responses generated via Anthropic's Claude API

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.11+ / FastAPI |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) |
| Frontend | Vanilla HTML / CSS / JS |
| Voice | Web Speech API (browser-native) |

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/Thorpie.git
cd Thorpie
```

### 2. Create virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate      # macOS/Linux
# .venv\Scripts\activate       # Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_key_here
```

Get an API key at [console.anthropic.com](https://console.anthropic.com).

### 5. Run the server

```bash
uvicorn backend.main:app --reload
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## Project Structure

```
Thorpie/
├── backend/
│   ├── __init__.py
│   ├── config.py       # Environment / settings
│   ├── thorpie.py      # Character prompt + Claude integration
│   └── main.py         # FastAPI app + routes
├── frontend/
│   ├── index.html      # UI
│   ├── styles.css      # Warm beige styling
│   └── app.js          # API calls, STT, TTS
├── tests/
│   └── test_thorpie.py
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

---

## Running Tests

```bash
pip install pytest httpx
python -m pytest tests/ -v
```

---

## Collaboration Notes

This project is co-developed between the UK and Australia. A few things to note:

- **Branching**: Use feature branches (`feature/your-feature-name`), open PRs against `main`
- **Secrets**: Never commit `.env`. Each developer needs their own Anthropic API key.
- **CORS**: The `CORS_ORIGINS` env var controls allowed origins. In dev, `*` is fine. Set it to your deployed frontend URL in production.
- **Model**: Defaults to `claude-sonnet-4-6`. Override via `CLAUDE_MODEL` env var.

---

## Roadmap

- [x] Text Q&A with Yorkshire character
- [x] Browser-based voice input (STT)
- [x] Browser-based voice output (TTS) with voice/pitch/speed controls
- [ ] Hosted TTS with Yorkshire-ish voice options (ElevenLabs / Azure Neural)
- [ ] Hosted STT (Whisper API)
- [ ] Persistent session / conversation history
- [ ] Thorpie's "mood" state (more grumpy if asked too many questions)
- [ ] Mobile-optimised layout

---

## Character Notes

Thorpie believes:
- Yorkshire is the centre of civilisation
- Anyone south of Sheffield is suspect
- All ailments are cured by Yorkshire tea and fresh air on t'moors
- The moon landing was filmed in Barnsley
- Shakespeare were from Leeds (probably)

He's pompously, magnificently wrong. That's the point.

---

*Powered by proper Yorkshire stubbornness and a Claude API key.*
