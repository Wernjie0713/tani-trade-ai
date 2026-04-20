import React, { useRef, useState } from "react";

// Simple browser SpeechRecognition wrapper (Web Speech API)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function VoiceInput({ onTranscript, language = "ms-MY" }) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser.");
      return;
    }
    setError(null);
    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setListening(false);
    };
    recognition.onerror = (event) => {
      setError(event.error);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div className="flex flex-col items-center gap-2 my-4">
      <button
        className={`px-6 py-3 rounded-full font-bold text-white bg-primary ${listening ? 'opacity-60' : ''}`}
        onClick={listening ? stopListening : startListening}
        type="button"
      >
        {listening ? "Stop Recording" : "Start Voice Input"}
      </button>
      {error && <div className="text-error text-xs mt-1">{error}</div>}
    </div>
  );
}
