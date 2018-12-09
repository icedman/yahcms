export default {
  name: 'tabbar',
  strict: true,
  namespaced: true,
  state: {
    index: 1
  },
  mutations: {
    set (state, index) {
      state.index = index
    }
  }
}
