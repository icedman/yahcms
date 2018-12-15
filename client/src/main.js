// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import Axios from 'axios'
import store from './store'
import { sync } from 'vuex-router-sync'
import VueOnsen from 'vue-onsenui'

// geolocation
// import VueGeolocation from 'vue-browser-geolocation'

// Webpack CSS import
// import 'onsenui/css/onsenui.css'
import './onsenui.css'
import 'onsenui/css/onsen-css-components.css'

// import 'onsenui/css/onsenui.css'; // Onsen UI basic CSS
// import 'onsenui/css/onsen-css-components.css'; // Default Onsen UI CSS components
import './onsen-css-components.css' // Onsen UI CSS components source for custom themes (requires cssnext)

// layouts
import CustomToolbar from './partials/CustomToolbar'
import AppFullPage from './AppFullPage'
import AppTabbar from './AppTabbar'
import AppSplitter from './AppSplitter'

// extern
/* eslint-disable no-unused-vars */
import _ from 'lodash'
import Firebase from '@/lib/firebase'
import WordPress from '@/lib/wordpress'
import WebCache from '@/lib/cache'
import CmsAPI from '@/lib/cmsapi'

// -----------------------------

Vue.use(VueOnsen)

// geolocation
// Vue.use(VueGeolocation)

Vue.config.productionTip = false

sync(store, router, {
  moduleName: 'route'
})

router.beforeEach((to, from, next) => {
  if ((!store.state.user.user || !store.state.user.user.name) &&
    to.matched.some(record => record.meta.requiresAuth)) {
    next('/auth/login')
    return
  }

  let layout
  to.matched.forEach(record => {
    if (record.meta) {
      if (record.meta.layout) {
        layout = record.meta.layout
      }
    }
  })
  if (layout) {
    store.commit('ui/SET_LAYOUT', layout)
  }

  next()
})
router.afterEach((to, from) => {
  // try {
  //   store.commit('ui/setContext', store.state.route.params.slug)
  // } catch (e) {
  //   console.log(e)
  // }
})

/* cordova */
// see ons.ready
// https://onsen.io/v2/guide/cordova.html#cordova-specific-features
document.addEventListener('deviceready', onDeviceReady, false)
function onDeviceReady () {
  store.commit('SET_DEVICE_READY', true)
}

Vue.component('custom-toolbar', CustomToolbar)
Vue.component('app-full-page', AppFullPage)
Vue.component('app-tabbar', AppTabbar)
Vue.component('app-splitter', AppSplitter)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<component :is="layout"/>',
  router,
  store,

  computed: {
    layout () {
      if (this.$store.state.ui && this.$store.state.ui.layout) {
        return this.$store.state.ui.layout
      }
      return 'app-tabbar'
    }
  },

  beforeCreate () {
    window.$app = this

    // Shortcut for Material Design
    Vue.prototype.md = true // this.$ons.platform.isAndroid()
    Vue.prototype.$http = Axios
    Vue.prototype.$firebase = Firebase
    Vue.prototype.$wp = WordPress
    Vue.prototype.$cache = WebCache
    Vue.prototype.$cms = CmsAPI

    /* cordova */
    document.addEventListener('deviceready', onDeviceReady, false)
    function onDeviceReady () {
      store.commit('SET_DEVICE_READY', true)
    }

    // Set iPhoneX flag based on URL
    if (window.location.search.match(/iphonex/i)) {
      document.documentElement.setAttribute('onsflag-iphonex-portrait', '')
      document.documentElement.setAttribute('onsflag-iphonex-landscape', '')
    }
  }
})
