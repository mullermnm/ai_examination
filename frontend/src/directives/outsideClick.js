export default {
  mounted: (el, binding) => {
    /**
     * if a root ref is passed it is recommended to access it in componentUpdated hook
     * so that its value will not be undefined
     */
    if ("outSideClickHandler" in el) return //in order no to add event listener if it is already added
    if ("$root" in binding.value && binding.value.$root === undefined) return
    el.$root = "$root" in binding.value ? binding.value.$root : document.body
    el.outSideClickHandler = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value.handler(...(binding.value.params || []))
      }
    }
    setTimeout(() => {
      el.$root.addEventListener("click", el.outSideClickHandler)
    }, 1)
  },
  updated: (el, binding) => {
    if ("outSideClickHandler" in el) return //in order no to add event listener if it is already added
    el.$root = "$root" in binding.value ? binding.value.$root : document.body
    el.outSideClickHandler = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value.handler(...(binding.value.params || []))
      }
    }
    setTimeout(() => {
      el.$root.addEventListener("click", el.outSideClickHandler)
    }, 1)
  },
  unmounted: (el) => {
    el.$root.removeEventListener("click", el.outSideClickHandler)
  },
}
