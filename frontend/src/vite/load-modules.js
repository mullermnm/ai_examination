/* eslint-disable no-undef */

const requireModules = require.context("../modules/", true)
requireModules
  .keys()
  .filter((fileName) => !fileName.includes(".", 1))
  .reduce(
    (acc, fileName) =>
      !acc.includes(fileName.split("/")[1])
        ? [...acc, fileName.split("/")[1]]
        : acc,
    [],
  )
  .filter((mod) => mod)
  .forEach(
    (moduleName) =>
      (vite[moduleName] = {
        components: {},
        routes: [],
        functions: {},
        actionHandlers: {},
        headers: {},
        api: {},
        nav: "",
      }),
  )
