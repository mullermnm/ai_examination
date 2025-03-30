import { createApp } from "vue";
import installAxios from "./plugins/axios";
import { createPinia } from "pinia";

// router
import { createRouter, createWebHashHistory } from "vue-router";

import Login from "./modules/auth/components/Login.vue";
import Landing from "./modules/home/Landing.vue";
import NotFound from "./modules/notfound/NotFound.vue";

import OpenApp from "./views/Open.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Landing,
      meta: {
        onlyWhenLoggedOut: true,
        public: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        onlyWhenLoggedOut: true,
        public: true,
      },
    },
    // Catch-all route for 404 pages
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFound,
      meta: {
        public: true,
      },
    }
  ],
});

export default async function () {
  const app = createApp(OpenApp);
  app.use(router);
  installAxios(app);
  app.use(createPinia());
  app.mount("#app");
}
