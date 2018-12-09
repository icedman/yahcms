let state = {
  token: null,
  gatepass: false,
  user: {
    name: null,
    email: null
  }
}

try {
  var cachedState = window.localStorage.getItem('vuex-user', state)
  if (cachedState) {
    state = JSON.parse(cachedState)
    state.gatepass = false
  }
} catch (err) {
  //
}

let actions = {}

let getters = {}

let mutations = {
  setGatePass (state, pass) {
    state.gatepass = pass
  },

  setUser (state, claims) {
    state.token = claims.token
    if (!claims.user) {
      state.user.name = null
      state.user.email = null
      return
    }
    state.user.name = claims.user.displayName
    state.user.email = claims.user.email

    window.localStorage.setItem('vuex-user', JSON.stringify(state))
  },

  clearPasswords (state) {
    // ?
  }
}

export default {
  name: 'user',
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
