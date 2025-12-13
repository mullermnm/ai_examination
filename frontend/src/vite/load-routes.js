/* eslint-disable no-undef */
import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

// https://webpack.js.org/guides/dependency-management/#require-context
const requireContext = require.context("../modules", true, /routes.js$/i)
// For each matching file name...
requireContext.keys().forEach((fileName) => {
  const componentConfig = requireContext(fileName)
  vite[fileName.split("/")[1]]["routes"] =
    componentConfig.default || componentConfig
})
