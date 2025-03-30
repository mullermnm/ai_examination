export const _2Letters = {
  filters: {
    get_2Letters(fullName) {
      let fullNameSplitted = fullName.split(" ")
      let result = ""
      if (fullNameSplitted.length === 1)
        result = fullNameSplitted[0][0] + fullNameSplitted[0][1]
      else result = fullNameSplitted[0][0] + fullNameSplitted[1][0]
      return result
    },
  },
  methods: {
    get_2Letters(fullName) {
      let fullNameSplitted = fullName.split(" ")
      let result = ""
      if (fullNameSplitted.length === 1)
        result = fullNameSplitted[0][0] + fullNameSplitted[0][1]
      else result = fullNameSplitted[0][0] + fullNameSplitted[1][0]
      return result
    },
  },
}
