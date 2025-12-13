import { validate } from "@/utils.js"
import { set, get } from "lodash"
export const validation = {
  methods: {
    validate,
    isValid(errorsKey = "errors", metaKey = "meta") {
      console.log(this)
      let errors = this.validate(get(this, metaKey), this.$v)
      if (errors && this.hasErrors(errors)) {
        set(this, errorsKey, errors)
        return false
      } else {
        set(this, errorsKey, {})
        return true
      }
    },
    hasErrors(errors) {
      return Object.keys(errors).some((key) => errors[key].length > 0)
    },
  },
}
