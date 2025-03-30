import { ref } from "vue"

// global state, created in module scope
let openedModals = ref([])

export function useModal() {
  return openedModals.value
}
export function openModal(args) {
  let {
    component,
    componentProps = null,
    cbParams = null,
    cb = null,
    variant = "center",
    width = 0,
  } = args
  if (component) {
    const modalId = openedModals.value.length
    width
    const modal = {
      modalId,
      component,
      componentProps,
      cbParams,
      cb,
      width,
      variant,
    }
    openedModals.value.push(modal)
  }
}
export function closeModal(data) {
  if (openedModals.value.length < 1) return
  let { cb, cbParams } = openedModals.value.pop()
  if (!data) data = {}
  let { invokeCb = false, response = null } = data
  if (cb && invokeCb) {
    if (response) {
      if (cbParams) cbParams.response = response
      else {
        cbParams = {}
        cbParams.response = response
      }
    }
    if (cbParams) cb(cbParams)
    else cb()
  }
}
