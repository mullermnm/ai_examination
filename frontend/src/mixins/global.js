import { activity } from "@/mixins/activity"
import VuePapaParse from "vue-papa-parse"
import { formateDate, formateNumber } from "../utils"

export default function (app) {
  app.mixin(activity)
  app.use(VuePapaParse)

  app.mixin({
    computed: {},
    filters: {
      formateDate(date, format = "MMM DD YYYY") {
        return formateDate(date, format)
      },
      formateNumber(number) {
        return formateNumber(number)
      },
    },
  })
}
