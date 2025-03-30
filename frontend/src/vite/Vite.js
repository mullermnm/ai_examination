class Vite {
  constructor() {}
  async loadModules() {
    require("./load-modules")
    require("./load-menus")
    require("./load-components")
    require("./load-functions")
    require("./load-action-handlers")
    require("./load-headers")
    require("./load-apis")
    require("./load-routes")
  }
}
module.exports = (options) => {
  let vite = new Vite(options)
  global.vite = vite
  return vite
}
