/* eslint-disable no-undef */
const authCodes = []
;("use strict")
const requireContext = require.context("../modules/", true, /authCodes.js/)
requireContext.keys().forEach((fileName) => {
  authCodes.push(requireContext(fileName))
})
export default authCodes
