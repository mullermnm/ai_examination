export const colorFromName = {
  methods: {
    getColorFromName(colors, name) {
      name = name.toLocaleLowerCase()
      return colors[(name.charCodeAt(0) + name.charCodeAt(1)) % colors.length]
    },
  },
}
