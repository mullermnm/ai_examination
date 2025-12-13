import { createRouter, createWebHashHistory } from "vue-router";
// import { activityService } from '../services/activityService';
import { userTokenService } from "../services/storageService";

import protectedRoutes from "../routes/protectedRoutes";
import { isDefined, useTitle } from "@vueuse/core";
import nProgress from "nprogress";
import Login from "../modules/auth/components/Login.vue";

const openRoutes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      onlyWhenLoggedOut: true,
      public: true,
    },
  },
 
];

const routes = [...openRoutes, ...protectedRoutes];

// Add root route with dynamic redirection
routes.unshift({
  path: '/',
  name: 'Home',
  component: Login,
  beforeEnter: (to, from, next) => {
    const userRole = userTokenService.getUserRole();
    const userLoggedIn = !!userTokenService.getToken();

    if (userLoggedIn) {
      if (userRole === 'student') {
        next({ name: "StudentDashboard" });
      } else if (userRole === 'teacher') {
        next({ name: "TeacherDashboard" });
      } else {
        next();
      }
    } else {
      next();
    }
  }
});

console.log("Routes:", routes);
console.info({ routes });

const router = createRouter({
  mode: "history",
  history: createWebHashHistory(),
  base: import.meta.env.BASE_URL,
  routes: routes,
});

router.beforeEach((to, from, next) => {
  nProgress.start();
  const title = useTitle("Ai Examination");
  if (isDefined(to.meta.title)) {
    title.value = title.value.concat(" | ", to.meta.title);
  }

  const isPublic = to.matched.some((route) => route.meta.public);
  const userLoggedIn = !!userTokenService.getToken();
  const onlyWhenLoggedOut = to.matched.some((route) => route.meta.onlyWhenLoggedOut);

  // Handle authenticated users
  if (userLoggedIn) {
    if (onlyWhenLoggedOut) {
      if (userRole === 'teacher') {
        return next({ name: "TeacherDashboard" });
      } else if (userRole === 'student') {
        return next({ name: "StudentDashboard" });
      }
    }
    return next();
  }

  // Handle unauthenticated users
  if (!isPublic && !userLoggedIn) {
    return next({ name: "Login" });
  }

  next();
});

router.afterEach(() => {
  nProgress.done();
});

export default router;
