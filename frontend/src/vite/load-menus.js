/* eslint-disable no-undef */
const requireContext = require.context("../modules", true, /info.json$/i)
// For each matching file name...
requireContext.keys().forEach((fileName) => {
  vite[fileName.split("/")[1]]["nav"] = requireContext(fileName)
})
