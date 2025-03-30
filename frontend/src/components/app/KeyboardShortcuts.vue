<script>
import { useMagicKeys, whenever } from "@vueuse/core"
const keys = useMagicKeys()
export default {
  setup() {
    // whenever(keys.shift_space, () => {
    //   console.info("Shift+Space have been pressed")
    // })
    // whenever(keys.current, (e) => {
    //   console.log(Object.getOwnPropertyNames(e), e)
    // })
  },
}
</script>
