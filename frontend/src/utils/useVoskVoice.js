import { ref } from 'vue'

export function useVoskVoice({
  modelPath = '/models/vosk-model-small-en-us-0.15/model',
  serverUrl = 'https://cdn.jsdelivr.net/npm/vosk-browser@0.0.3/dist/vosk.js',
  preferVosk = true,
  onResult = () => {},
  onError = () => {}
} = {}) {
  const isLoaded = ref(false)
  const isListening = ref(false)
  const transcript = ref('')

  let audioCtx
  let micStream
  let processor
  let recognizer
  let model
  let mediaRecorder
  let webRecognition
  let webSpeechDisabled = false

  /* ------------------ VOSK ------------------ */

  const loadVosk = async () => {
    if (!preferVosk) return false

    try {
      const { createModel } = await import('vosk-browser')
      model = await createModel(modelPath)
      recognizer = new model.KaldiRecognizer()

      recognizer.on('result', r => {
        const text = r?.result?.text
        if (text) {
          transcript.value = text.toLowerCase()
          onResult(transcript.value)
        }
      })

      recognizer.on('partialresult', r => {
        const text = r?.result?.partial
        if (text) onResult(text.toLowerCase())
      })

      isLoaded.value = true
      console.info('✅ Vosk loaded (offline)')
      return true
    } catch (e) {
      console.warn('⚠️ Vosk unavailable', e)
      return false
    }
  }

  const startVosk = async () => {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    audioCtx = new AudioContext()

    const source = audioCtx.createMediaStreamSource(micStream)
    processor = audioCtx.createScriptProcessor(4096, 1, 1)

    processor.onaudioprocess = e => {
      if (isListening.value) recognizer.acceptWaveform(e.inputBuffer)
    }

    source.connect(processor)
    processor.connect(audioCtx.destination)

    isListening.value = true
  }

  /* ------------------ SERVER ASR ------------------ */

  const startServerASR = async () => {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true })

    mediaRecorder = new MediaRecorder(micStream)
    mediaRecorder.ondataavailable = async e => {
      try {
        const res = await fetch(serverUrl, { method: 'POST', body: e.data })
        const text = await res.text()
        if (text) {
          transcript.value = text.toLowerCase()
          onResult(transcript.value)
        }
      } catch {
        onError('Server ASR failed')
      }
    }

    mediaRecorder.start(3000)
    isListening.value = true
  }

  /* ------------------ WEB SPEECH ------------------ */

  const startWebSpeech = () => {
    if (webSpeechDisabled) return

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return

    webRecognition = new SR()
    webRecognition.lang = navigator.language || 'en-US'
    webRecognition.continuous = false

    webRecognition.onresult = e => {
      const text = e.results[0][0]?.transcript
      if (text) {
        transcript.value = text.toLowerCase()
        onResult(transcript.value)
      }
    }

    webRecognition.onerror = e => {
      console.error('WebSpeech error:', e.error)
      if (e.error === 'network') webSpeechDisabled = true
      stop()
    }

    webRecognition.start()
    isListening.value = true
  }

  /* ------------------ CONTROL ------------------ */

  const start = async () => {
    transcript.value = ''

    if (await loadVosk()) {
      await startVosk()
      return
    }

    if (serverUrl) {
      try {
        await startServerASR()
        return
      } catch {}
    }

    startWebSpeech()
  }

  const stop = () => {
    isListening.value = false

    try {
      processor?.disconnect()
      audioCtx?.close()
      micStream?.getTracks().forEach(t => t.stop())
      mediaRecorder?.stop()
      webRecognition?.stop()
      recognizer?.free?.()
    } catch (e){
      console.error('Error stopping voice recognition:', e)
    }

    processor = audioCtx = micStream = recognizer = mediaRecorder = webRecognition = null
  }

  return { isLoaded, isListening, transcript, start, stop }
}
