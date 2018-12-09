import Vue from 'vue'
import Vuex from 'vuex'
import ui from './ui'
import user from './user'
import splitter from './splitter'
import tabbar from './tabbar'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    deviceReady: false
  },
  getters: {
    DEVICE_READY (state) {
      return state.deviceReady
    }
  },
  actions: {},
  mutations: {
    SET_DEVICE_READY (state, value) {
      state.deviceReady = true
    }
  },
  modules: {
    [ui.name]: ui,
    [user.name]: user,
    [splitter.name]: splitter,
    [tabbar.name]: tabbar
  }
})
