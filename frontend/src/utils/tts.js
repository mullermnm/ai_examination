import { ref } from 'vue'

const selectedVoice = ref(null)
let speaking = false

export function isAvailable() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
}

export const initTTS = async () => {
  if (!isAvailable()) return

  const loadVoices = () =>
    new Promise((resolve) => {
      const vs = window.speechSynthesis.getVoices()
      if (vs && vs.length) return resolve(vs)
      window.speechSynthesis.onvoiceschanged = () => resolve(window.speechSynthesis.getVoices())
      setTimeout(() => resolve(window.speechSynthesis.getVoices() || []), 700)
    })

  try {
    const voices = await loadVoices()
    const preferred = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en')) || voices[0]
    if (preferred) selectedVoice.value = preferred
  } catch (e) {
    selectedVoice.value = null
  }
}

export function cancel() {
  try {
    if (isAvailable()) {
      window.speechSynthesis.cancel()
    }
  } finally {
    speaking = false
  }
}

export function speak(text, { force = false } = {}) {
  if (!isAvailable()) {
    console.info('TTS not supported; text:', text)
    return Promise.resolve()
  }

  if (speaking && !force) {
    // do not overlap
    return Promise.resolve()
  }

  speaking = true

  return new Promise((resolve) => {
    try {
      window.speechSynthesis.cancel()
    } catch (e) {
      // ignore
    }

    const u = new SpeechSynthesisUtterance(text)
    if (selectedVoice.value) u.voice = selectedVoice.value
    u.onend = () => {
      speaking = false
      resolve()
    }
    u.onerror = () => {
      speaking = false
      resolve()
    }
    try {
      window.speechSynthesis.speak(u)
    } catch (e) {
      speaking = false
      resolve()
    }
  })
}

export default {
  isAvailable,
  initTTS,
  speak,
  cancel,
}
