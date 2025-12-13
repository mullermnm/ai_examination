export default {
  mounted: (el, binding) => {
    el.escapeHandler = (e) => {
      if (e.key === "Escape") {
        binding.value()
      }
    }
    document.body.addEventListener("keydown", el.escapeHandler)
  },
  unmounted: (el) => {
    document.body.removeEventListener("keydown", el.escapeHandler)
  },
}
