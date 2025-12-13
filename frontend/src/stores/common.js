module.exports.mutations = {
  SMART_SET: (state, { stateKey, data }) => {
    state[stateKey] = data
  },
  SMART_PUSH: (state, { stateKey, data }) => {
    if (typeof data == "object")
      data.id = data.id ? data.id : state[stateKey].length
    state[stateKey].push(data)
  },
  SMART_POP: (state, { stateKey, data }) => {
    const index =
      typeof data == "object"
        ? state[stateKey].findIndex(({ id }) => id == data.id)
        : state[stateKey].indexOf(data)
    state[stateKey].splice(index, 1)
  },
}

module.exports.actions = {
  smartSet({ commit }, { stateKey, data }) {
    commit("SMART_SET", {
      stateKey,
      data,
    })
  },
  smartPush({ commit }, attribute) {
    commit("SMART_PUSH", attribute)
  },
  smartPop({ commit }, attribute) {
    commit("SMART_POP", attribute)
  },
}
