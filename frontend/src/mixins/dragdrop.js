export const dragdrop = {
  data() {
    return {
      dragIndex: -1,
      dropIndex: -1,
    }
  },
  watch: {
    dropIndex() {
      this.swap()
    },
  },
  methods: {
    // drag and drop action listeners
    dragElement(index) {
      this.dragIndex = index
    },
    dropElement() {
      this.dragIndex = -1
      this.dropIndex = -1
    },
    readyDropElement(index) {
      if (this.dragIndex > -1) this.dropIndex = index
    },
  },
}
