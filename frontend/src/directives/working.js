export default {
  mounted: (el, binding) => {
    el.handler = () => {
      binding.value()
    }
    document.body.addEventListener("keydown", el.handler)
    document.body.addEventListener("click", el.handler)
    document.body.addEventListener("contextmenu", el.handler)
    document.body.addEventListener("mousemove", el.handler)
  },
}
