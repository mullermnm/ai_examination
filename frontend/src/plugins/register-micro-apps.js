import { registerMicroApps, start } from "qiankun"

registerMicroApps([
  {
    name: "Distribution",
    entry: "http://localhost:3000",
    container: "#container",
    activeRule: "/distribution",
  },
])
// start qiankun
start()
