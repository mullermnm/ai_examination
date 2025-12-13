import apiService from "./services/apiService"
import { tokenService } from "./services/storageService"
// import {
//     i18n
// } from './plugins/i18n';

apiService.init(apiService.getBaseUrl())
apiService.addInterceptor()

if (tokenService.getToken()) {
  apiService.setHeader()
  apiService.mount401Interceptor()
}

import { createApp } from "vue"

import installPlugins from "@/plugins"
import "@/mixins/global"

// import store from './store';

import { directives } from "./directives/index"

import App from "./App.vue"
import store from "./store/index.js"
import "./plugins/install"
import router from "./utils/routes"
// import i18n from './plugins/i18n'

const app = createApp(App) //.mount('#app');
// app.use(i18n)
installPlugins(app)
app.use(router)
app.use(store)
// app.use(getRouter)
// app.component('App', App)
app.config.devtools = true
app.config.silent = true
directives.forEach((d) => app.directive(d.name, d.hooksContainer))

app.mount("#app")
