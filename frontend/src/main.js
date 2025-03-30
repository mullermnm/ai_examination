import installPlugins from "./plugins/index"
import installGlobalMixins from "@/mixins/global"
import "@/plugins/install"
import { directives } from "./directives/index"
import Toast, { POSITION } from "vue-toastification"
import "vue-toastification/dist/index.css"

import { createApp } from "vue"
import { createPinia } from "pinia"
import { piniaUserPersist } from './plugins/piniaPersist'
// import {DatePicker} from "v-calendar"
import App from "./App.vue"
// import router from "./router";
import router from "./utils/routes"

// import "./assets/main.css"

export default function () {
  const app = createApp(App)
  const pinia = createPinia()
  pinia.use(piniaUserPersist)
  app.use(pinia)
  installGlobalMixins(app)

  app.use(router)
  app.use(Toast, {
    position: POSITION.TOP_RIGHT,
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false
  })
  directives.forEach((d) => app.directive(d.name, d.hooksContainer))

  function bindJoiErrors(source, keys = "", setter) {
    console.info({source})
    const errors = keys
      .split(" ")
      .reduce(
        (acc, key) =>
          source[key]
            ? { ...acc, [key]: source[key].split('"').join("") }
            : acc,
        {},
      )
    setter(errors)
  }
  app.provide("bindJoiErrors", bindJoiErrors)

  installPlugins(app).then(() => app.mount("#app"))
}
