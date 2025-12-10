// Offline Speech Recognition using Vosk WASM with graceful fallback to Web Speech API
import { ref } from 'vue';

export function useVoskVoice({ onResult = () => {}, onError = () => {} } = {}) {
  let model = null;
  let recognizer = null;
  let mediaStream = null;
  let audioContext = null;
  const isLoaded = ref(false);
  const isListening = ref(false);
  let voskAvailable = false;
  let useWebSpeech = false;
  let webRecognition = null;

  // Try dynamic import of vosk-browser; if unavailable, fall back
  const loadModel = async () => {
    if (isLoaded.value) return;

    try {
      const mod = await import('vosk-browser');
      // Try multiple export shapes
      const VoskModel = mod.VoskModel || mod.Model || mod.default?.VoskModel || mod.default?.Model;
      const KaldiRecognizer = mod.KaldiRecognizer || mod.Recognizer || mod.default?.KaldiRecognizer;

      if (!VoskModel || !KaldiRecognizer) {
        // mark unavailable and fallback
        voskAvailable = false;
        useWebSpeech = true;
        onError?.('Vosk not available in this build; falling back to browser SpeechRecognition.');
        return;
      }

      model = new VoskModel('models/vosk-model-small-en-us-0.15');
      await model.load();
      voskAvailable = true;
      isLoaded.value = true;
      console.log('Vosk model loaded');
    } catch (e) {
      console.error('Model load error or vosk not present:', e);
      voskAvailable = false;
      useWebSpeech = true;
      onError?.('Failed to load Vosk voice model; falling back to browser SpeechRecognition.');
    }
  };

  // Start voice recognition (Vosk if available, otherwise Web Speech API)
  const start = async () => {
    try {
      if (!isLoaded.value && !useWebSpeech) await loadModel();

      if (isListening.value) return;

      if (voskAvailable) {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        const src = audioContext.createMediaStreamSource(mediaStream);

        const mod = await import('vosk-browser');
        const KaldiRecognizer = mod.KaldiRecognizer || mod.Recognizer || mod.default?.KaldiRecognizer;
        recognizer = new KaldiRecognizer(model, audioContext.sampleRate);

        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        src.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = async (e) => {
          if (!isListening.value) return;
          const data = e.inputBuffer.getChannelData(0);
          const int16 = new Int16Array(data.length);
          for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32767;

          const result = recognizer.acceptWaveform(int16);
          if (result) {
            const res = recognizer.finalResult();
            const text = res.text?.trim();
            if (text) onResult?.(text.toLowerCase());
          }
        };

        isListening.value = true;
        return;
      }

      // Fallback: use Web Speech API (online, vendor-prefixed)
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
      if (!SR) {
        onError?.('No SpeechRecognition available in this browser.');
        return;
      }

      webRecognition = new SR();
      webRecognition.continuous = true;
      webRecognition.interimResults = false;
      webRecognition.lang = navigator.language || 'en-US';

      webRecognition.onresult = (event) => {
        try {
          const results = event.results;
          const last = results[results.length - 1];
          const transcript = (last[0]?.transcript || '').trim().toLowerCase();
          if (transcript) onResult?.(transcript);
        } catch (e) {
          console.warn('webRecognition onresult error', e);
        }
      };

      webRecognition.onerror = (ev) => {
        onError?.(ev.error || 'Speech recognition error');
      };

      webRecognition.onend = () => {
        // keep listening continuous behavior handled by start/stop calls
        isListening.value = false;
      };

      webRecognition.start();
      isListening.value = true;
    } catch (e) {
      console.error('Vosk Start Error:', e);
      onError?.('Microphone permission required or unavailable.');
    }
  };

  // Stop listening
  const stop = () => {
    isListening.value = false;

    try {
      if (mediaStream) mediaStream.getTracks()?.forEach(t => t.stop());
      if (audioContext) audioContext.close();
      if (recognizer && typeof recognizer.free === 'function') recognizer.free();
      if (webRecognition) webRecognition.stop();
    } catch (e) {}

    recognizer = null;
    mediaStream = null;
    audioContext = null;
    webRecognition = null;
  };

  return {
    isLoaded,
    isListening,
    start,
    stop
  };
}
