/* ============================================================
   Thorpie — Frontend Logic
   Handles: Q&A with API, voice input (STT), voice output (TTS)
   ============================================================ */

const API_BASE = window.location.origin;

// Elements
const questionInput = document.getElementById("question");
const askBtn = document.getElementById("askBtn");
const micBtn = document.getElementById("micBtn");
const answerSection = document.getElementById("answerSection");
const answerBox = document.getElementById("answerBox");
const speakBtn = document.getElementById("speakBtn");
const stopBtn = document.getElementById("stopBtn");
const voiceSettings = document.getElementById("voiceSettings");
const voiceSelect = document.getElementById("voiceSelect");
const speedSlider = document.getElementById("speedSlider");
const pitchSlider = document.getElementById("pitchSlider");
const speedVal = document.getElementById("speedVal");
const pitchVal = document.getElementById("pitchVal");
const errorBox = document.getElementById("errorBox");
const loadingBox = document.getElementById("loadingBox");

// ---- Ask Thorpie --------------------------------------------------------

async function askThorpie() {
  const question = questionInput.value.trim();
  if (!question) return;

  setLoading(true);
  hideError();
  hideAnswer();

  try {
    const res = await fetch(`${API_BASE}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Summat went wrong at t'mill.");
    }

    showAnswer(data.answer);
  } catch (err) {
    showError(err.message || "Couldn't reach Thorpie. He's probably out on t'moors.");
  } finally {
    setLoading(false);
  }
}

// ---- UI State -----------------------------------------------------------

function setLoading(on) {
  askBtn.disabled = on;
  loadingBox.classList.toggle("hidden", !on);
}

function showAnswer(text) {
  answerBox.textContent = text;
  answerSection.classList.remove("hidden");
  voiceSettings.classList.remove("hidden");
}

function hideAnswer() {
  answerSection.classList.add("hidden");
  voiceSettings.classList.add("hidden");
  window.speechSynthesis?.cancel();
  setSpeaking(false);
}

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove("hidden");
}

function hideError() {
  errorBox.classList.add("hidden");
}

// ---- Voice Output (TTS) -------------------------------------------------

function setSpeaking(on) {
  speakBtn.classList.toggle("speaking", on);
  speakBtn.classList.toggle("hidden", on);
  stopBtn.classList.toggle("hidden", !on);
}

function speakAnswer() {
  const text = answerBox.textContent;
  if (!text || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = parseFloat(speedSlider.value);
  utterance.pitch = parseFloat(pitchSlider.value);

  const selectedVoice = voiceSelect.value;
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find((v) => v.name === selectedVoice);
  if (voice) utterance.voice = voice;

  utterance.onstart = () => setSpeaking(true);
  utterance.onend = () => setSpeaking(false);
  utterance.onerror = () => setSpeaking(false);

  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  window.speechSynthesis?.cancel();
  setSpeaking(false);
}

// ---- Voice Selection ----------------------------------------------------

function populateVoices() {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  voiceSelect.innerHTML = "";

  // Prefer British/UK voices for Thorpie's charm
  const preferred = voices.filter((v) =>
    v.lang.startsWith("en-GB") || v.lang.startsWith("en-AU")
  );
  const others = voices.filter((v) => v.lang.startsWith("en-") && !preferred.includes(v));
  const rest = voices.filter((v) => !v.lang.startsWith("en-"));

  const groups = [
    { label: "British & Australian (recommended)", voices: preferred },
    { label: "Other English", voices: others },
    { label: "Other Languages", voices: rest },
  ];

  groups.forEach(({ label, voices }) => {
    if (!voices.length) return;
    const group = document.createElement("optgroup");
    group.label = label;
    voices.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v.name;
      opt.textContent = `${v.name} (${v.lang})`;
      group.appendChild(opt);
    });
    voiceSelect.appendChild(group);
  });

  // Select first GB voice by default if available
  const firstGB = preferred[0];
  if (firstGB) voiceSelect.value = firstGB.name;
}

// ---- Voice Input (STT) --------------------------------------------------

let recognition = null;
let isRecording = false;

function initSpeechRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    micBtn.title = "Speech recognition not supported in this browser";
    micBtn.style.opacity = "0.4";
    micBtn.style.cursor = "not-allowed";
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-GB";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    questionInput.value = transcript;
  };

  recognition.onend = () => {
    isRecording = false;
    micBtn.classList.remove("recording");
    micBtn.title = "Speak thy question";
  };

  recognition.onerror = (event) => {
    isRecording = false;
    micBtn.classList.remove("recording");
    if (event.error !== "no-speech") {
      showError(`Microphone trouble: ${event.error}. Thorpie can't 'ear thee.`);
    }
  };
}

function toggleRecording() {
  if (!recognition) return;

  if (isRecording) {
    recognition.stop();
    isRecording = false;
    micBtn.classList.remove("recording");
  } else {
    hideError();
    recognition.start();
    isRecording = true;
    micBtn.classList.add("recording");
    micBtn.title = "Recording... click to stop";
  }
}

// ---- Slider Labels ------------------------------------------------------

speedSlider.addEventListener("input", () => {
  speedVal.textContent = parseFloat(speedSlider.value).toFixed(2);
});

pitchSlider.addEventListener("input", () => {
  pitchVal.textContent = parseFloat(pitchSlider.value).toFixed(2);
});

// ---- Event Listeners ----------------------------------------------------

askBtn.addEventListener("click", askThorpie);

questionInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    askThorpie();
  }
});

micBtn.addEventListener("click", toggleRecording);
speakBtn.addEventListener("click", speakAnswer);
stopBtn.addEventListener("click", stopSpeaking);

// ---- Init ---------------------------------------------------------------

if (window.speechSynthesis) {
  // Voices may load asynchronously
  window.speechSynthesis.onvoiceschanged = populateVoices;
  populateVoices();
}

initSpeechRecognition();
