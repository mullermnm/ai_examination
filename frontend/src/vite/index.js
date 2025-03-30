/* eslint-disable no-undef */
const { join } = require("path")
import Vite from "./Vite"
const dir = join(process.cwd(), `../modules`)
export default new Vite({
  dir: dir,
  openedModals: [],
  base: {
    components: {},
  },
})
