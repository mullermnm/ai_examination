import { ref } from "vue"
let message = ref("No message")
let warn = ref("")
let error = ref(false)
let open = ref(false)
let timeout = 20

export function useToast() {
  return {
    message: message,
    warn: warn,
    error: error,
    open: open,
  }
}
export function openToast(_message, _error = false, _timeout = 5, _warn) {
  open.value = true
  message.value = _message
  warn.value = _warn
  error.value = _error
  timeout = _timeout
  closeLater(timeout)
}
export function closeToast() {
  open.value = false
}
export function closeLater(timeout) {
  setTimeout(() => {
    closeToast()
  }, timeout * 1000)
}
