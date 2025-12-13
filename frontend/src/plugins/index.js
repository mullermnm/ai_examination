// import { createApp } from 'vue'
// const app = createApp({})
// import translation from './i18n.js'
// translation()

// register base components globally
import registerComponents from "./register-components"
import VuePapaParse from "vue-papa-parse"

// import VueHtml2Pdf from 'vue-html2pdf';
// app.use(VueHtml2Pdf)

import "viewerjs/dist/viewer.css"
// import Viewer from 'v-viewer';
// app.use(Viewer);

// import Vuelidate from 'vuelidate'
// app.use(Vuelidate)

import setupI18n from "./i18n"
async function localization(app) {
  const i18n = await setupI18n()
  app.use(i18n)
}
// app.use(i18n)

import { installApex } from "./apex"

import "../eventBus"
import tippy from "./tippy"

// import VueMoment from "vue-moment";
// import moment from "moment";

import axios from "./axios"

// perfect scrollbar
// import PerfectScrollbar from "vue3-perfect-scrollbar"
import "vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css"

export default async function (app) {
  registerComponents(app)
  axios(app)
  tippy(app)
  installApex(app)
  app.use(VuePapaParse)
  await localization(app)
  // .then((i18n) => app.use(i18n))
  // app.use(PerfectScrollbar, {
  //   name: "scroll",
  //   watchOptions: false,
  //   options: {
  //     suppressScrollX: false,
  //     suppressScrollY: false,
  //     scrollingThreshold: 200,
  //     minScrollbarLength: 40,
  //   },
  // })
  // app.use(VueMoment, { moment });
}
