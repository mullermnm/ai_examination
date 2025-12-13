import outsideClick from "./outsideClick"
import escape from "./escape"
import working from "./working"
export const directives = [
  {
    name: "outsideClick",
    hooksContainer: outsideClick,
  },
  {
    name: "escape",
    hooksContainer: escape,
  },
  {
    name: "working",
    hooksContainer: working,
  },
]
