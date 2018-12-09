let state = {
  layout: null,
  offers: false,
  geoChecked: false,
  menu: {
    active: false,
    context: '',
    menus: [],
    items: []
  },
  nearestHotel: {}
}

let actions = {}

let getters = {}

let mutations = {
  SET_LAYOUT (state, layout) {
    state.layout = layout
  },

  setOffers (state, show) {
    state.offers = show
  },

  setGeoChecked (state, show) {
    state.geoChecked = show
  },

  showMenu (state, { path, show }) {
    state.menu.items.forEach(i => {
      if (i.path === path && i.hide !== undefined) {
        i.hide = !show
      }
      (i.children || []).forEach(c => {
        if (c.path === path && c.hide !== undefined) {
          c.hide = !show
        }
      })
    })
  },

  setMenuActive (state, active) {
    state.menu = Object.assign(state.menu, {
      active: active
    })
  },

  setMenus (state, menus) {
    state.menu.menus = menus
  },

  setMenuItems (state, items) {
    state.menu.items = items
  },

  setContext (state, slug) {
    if (!slug) {
      return
    }
    if (
      slug.includes('waterfront-cebu-city-hotel-casino') ||
      slug.includes('wcchc')
    ) {
      state.menu.context = 'wcchc-nav'
      return
    }
    if (
      slug.includes('waterfront-airport-hotel-casino') ||
      slug.includes('wahc')
    ) {
      state.menu.context = 'wahc-nav'
      return
    }
    if (
      slug.includes('waterfront-insular-hotel-davao') ||
      slug.includes('wihd')
    ) {
      state.menu.context = 'wihd-nav'
      return
    }
    if (
      slug.includes('manila-pavilion-hotel-casino') ||
      slug.includes('mphc')
    ) {
      state.menu.context = 'mphc-nav'
      return
    }
    if (slug.includes('front')) {
      state.menu.context = 'main'
    }
  }
}

export default {
  name: 'ui',
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
