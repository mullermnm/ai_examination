/* eslint-disable no-undef */
// import { createApp } from 'vue';
// const app = createApp({})
// import { createRouter } from 'vue-router';

const moduleRoutes = []
// app.use(createRouter({}))
// https://webpack.js.org/guides/dependency-management/#require-context
const requireContext = import.meta.globEager("../modules/*/routes.js")

Object.entries(requireContext).forEach(([path, definition]) => {
  // Get name of component, based on filename
  // "./components/Fruits.vue" will become "Fruits"
  // const route = path.split('/').pop().replace(/\.\w+$/, '')
  const routes = definition.default || definition
  moduleRoutes.push(...routes)
})

console.log("modules", moduleRoutes)
export default moduleRoutes
