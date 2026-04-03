// ── Hook: useSpeech ──
import { useState, useRef, useCallback } from 'react';

const DEMO_TEXT = "PM Kisan ke liye apply karna hai";

export function useSpeech({ lang = 'en-IN' } = {}) {
  const [state, setState] = useState('idle'); // idle | listening | processing | done | error
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const demoTimerRef = useRef(null);

  const hasSpeechAPI = typeof window !== 'undefined' && (
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  );

  // Demo simulation: typewriter effect
  const runDemoSimulation = useCallback((onDone) => {
    setState('listening');
    setTranscript('');
    let i = 0;
    const interval = setInterval(() => {
      if (i <= DEMO_TEXT.length) {
        setTranscript(DEMO_TEXT.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setState('processing');
        demoTimerRef.current = setTimeout(() => {
          setState('done');
          onDone?.(DEMO_TEXT);
        }, 1200);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const startListening = useCallback((onResult, onDone) => {
    if (!hasSpeechAPI) {
      // Fallback demo mode
      runDemoSimulation(onDone);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setState('listening');
      setTranscript('');
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      setTranscript(final || interim);
      onResult?.(final || interim);
    };

    recognition.onerror = () => {
      setState('error');
      // Fallback to demo on error
      setTimeout(() => runDemoSimulation(onDone), 500);
    };

    recognition.onend = () => {
      setState(prev => prev === 'listening' ? 'processing' : prev);
      setTimeout(() => {
        setState('done');
        onDone?.(transcript);
      }, 800);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      runDemoSimulation(onDone);
    }
  }, [hasSpeechAPI, lang, runDemoSimulation, transcript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    clearTimeout(demoTimerRef.current);
    setState('idle');
  }, []);

  const resetSpeech = useCallback(() => {
    stopListening();
    setTranscript('');
    setState('idle');
  }, [stopListening]);

  return { state, transcript, startListening, stopListening, resetSpeech, setTranscript, setState };
}
