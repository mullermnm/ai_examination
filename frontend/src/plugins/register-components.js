/* eslint-disable no-undef */
/**
 * We register all the components so future cli-ui plugins
 * could use them directly
 */
// import ModalHeader from "../components/card/modal/ModalHeader.vue"
// https://webpack.js.org/guides/dependency-management/#require-context
const components = import.meta.globEager("../components/base/**")

export default function (app) {
  // For each matching file name...
  Object.entries(components).forEach(([path, definition]) => {
    // Get name of component, based on filename
    // "./components/Fruits.vue" will become "Fruits"
    const componentName = path
      .split("/")
      .pop()
      .replace(/\.\w+$/, "")

    // Register component on this Vue instance
    app.component(componentName, definition.default)
  })

  //
  // app.component("ModalHeader", ModalHeader)
}
