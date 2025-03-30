/* eslint-disable no-undef */

import Vue from "vue"
import path from "path"

// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponents = require.context("../modules", true, /\.(vue)$/i)
// For each matching file name...
requireComponents.keys().forEach((fileName) => {
  const ext = path.extname(fileName)
  const baseName = path.basename(fileName, ext)

  const componentConfig = requireComponents(fileName)
  vite[fileName.split("/")[1]]["components"][baseName] =
    componentConfig.default || componentConfig
  const componentName = componentConfig.name || baseName

  Vue.component(componentName, componentConfig.default || componentConfig)
})
