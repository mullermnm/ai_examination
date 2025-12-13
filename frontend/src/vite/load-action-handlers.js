/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
"use strict"

const requireContext = require.context(
  "../modules",
  true,
  /actionHandlers.js$/i,
)
requireContext.keys().forEach((fileName) => {
  const componentConfig = requireContext(fileName)
  vite[fileName.split("/")[1]]["actionHandlers"] = componentConfig
})
