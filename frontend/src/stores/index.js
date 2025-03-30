import useUserStore from "./modules/user"
import useMainStore from "./modules/main"
import useSocketStore from "./modules/socket"
import useModalStore from "./modules/modal"
import usePasswordStore from "./modules/password"
// import modulesStore from "./modules/load-modules-store";

// const store =
// new Vuex.Store({})
// const store = new Vuex.Store({
//   modules: {
// const store = {
//     // ...modulesStore,
// };
export {
  usePasswordStore,
  useUserStore,
  useSocketStore,
  useModalStore,
  useMainStore,
}
