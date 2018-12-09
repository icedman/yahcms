/* eslint-disable camelcase */
import * as WPAPI from 'wpapi'
import Vue from 'vue'
import vc_empty_space from '@/partials/vc_empty_space'
import vc_row from '@/partials/vc_row'
import vc_column from '@/partials/vc_column'
import vc_column_text from '@/partials/vc_column_text'
import vc_hoverbox from '@/partials/vc_hoverbox'
import vc_toggle from '@/partials/vc_toggle'
import vc_single_image from '@/partials/vc_single_image'
import vc_btn from '@/partials/vc_button'
import vc_video from '@/partials/vc_video'
import vc_gallery from '@/partials/vc_gallery'
import geo_shortcut from '@/partials/geo_shortcut'
import rev_slider_vc from '@/partials/rev_slider_vc'
import reda_homepage_slides from '@/partials/reda_homepage_slides'

// -----------------------------
// class components
// -----------------------------
import reda_carousel_container from '@/partials/reda_carousel_container'

// const shortcode = require('./shortcode')
require('./shortcode')

const config = {
  // domain: 'localhost',
  // menu: 2,
  // frontPage: 'sample-page',
  // endpoint: 'http://wp5.localhost/wp-json/'

  domain: 'waterfronthotels.com.ph',
  menu: 'wcchc', // waterfront cebu casino hotel
  // frontPage: 'waterfronthotels.com.ph', // static local
  frontPage: 'home-test-1',
  endpoint: 'http://www.waterfronthotels.com.ph/wp-json/'
}

const menuCached = {}

class Util {
  cleanLink (link) {
    link = link.replace('url:', '')
    link = link.replace(/\|/g, '')
    link = link.replace(/%2F/g, '/')
    link = link.replace(/%23/g, '/')
    link = link.replace(/%3A/g, ':')
    link = link.replace(/%3F/g, '?')
    link = link.replace(/%3D/g, '=')
    return link
  }

  getLinkSlug (link) {
    link = this.cleanLink(link)

    var ll = link.split('/')
    if (!ll.length) {
      return ''
    }
    var l = ll[ll.length - 1]
    if (l === '' && ll.length > 2) {
      l = ll[ll.length - 2]
    }

    // hack
    l = l + ':XXX'
    l = l.replace('-2:XXX', '')
    l = l.replace('-3:XXX', '')
    l = l.replace('-4:XXX', '')
    l = l.replace('-5:XXX', '')
    l = l.replace(':XXX', '')
    return l
  }

  mutateLinks (app, src) {
    var links = src.querySelectorAll('a')
    Array.prototype.forEach.call(links, link => {
      if (link.href.indexOf(app.$wp.options.domain) !== -1) {
        // mutate to router push
        var l = this.getLinkSlug(link.href)
        link.removeAttribute('href')
        // link.setAttribute('href', `#/pages/${l}`)
        // link.setAttribute('@click', `$router.push('/pages/${l}')`)
        link.setAttribute('href', '#')
        link.addEventListener('click', (evt) => {
          evt.preventDefault()
          evt.stopPropagation()
          app.$router.push('/pages/' + l)
        })
      } else {
        // mutate to browser open
      }
    })
  }

  async fetchMenus (app, id, force) {
    if (typeof (id) === 'string') {
      if (menuCached[id]) {
        id = menuCached[id].term_id
      }
    }

    var key = `wp-menus-${id}`
    if (force) {
      app.$cache.clearCached(key)
    }

    var menus
    if (id !== null) {
      menus = await app.$cache.getCached(key, () => {
        return app.$wp.wpapi
          .menus()
          .id(id)
          .then(res => {
            return Promise.resolve([ res ])
          })
      })
    }

    if (id === null) {
      menus = await app.$cache.getCached(key, () => {
        return app.$wp.wpapi
          .menus()
          .get()
          .then(res => {
            return Promise.resolve(res)
          })
      })
    }

    menus.forEach(m => {
      if (m.slug) {
        menuCached[m.slug] = m
      }
    })

    return Promise.resolve(menus)
  }

  fetchImage (app, img, force) {
    var key = `wp-media-${img}`
    if (force) {
      app.$cache.clearCached(key)
    }
    return app.$cache.getCached(key, () => {
      return app.$wp.wpapi
        .media()
        .id(img)
        .then(res => {
          return Promise.resolve(res.source_url)
        })
    })
  }

  // reda
  fetchSlider (app, alias, force) {
    var key = `wp-slider-${alias}`
    if (force) {
      app.$cache.clearCached(key)
    }
    return app.$cache.getCached(key, () => {
      var url = `${app.$wp.options.endpoint}wfh/v1/sliders?alias=${alias}`
      return app.$http({
        method: 'get',
        url: url
      })
    })
  }

  fetchSlides (app, img, force) {
    var key = `wp-slides-${img}`
    if (force) {
      app.$cache.clearCached(key)
    }
    return app.$cache.getCached(key, () => {
      var url = `${app.$wp.options.endpoint}wfh/v1/slides?slider=${img}`
      return app.$http({
        method: 'get',
        url: url
      })
    })
  }
}

// -----------------------------
// shortcode components
// -----------------------------
const components = []
const registerComponent = (name, component) => {
  components.push(name)
  Vue.component(name, component)
}

registerComponent('vc_empty_space', vc_empty_space)
registerComponent('vc_separator', vc_empty_space)
registerComponent('vc_row', vc_row)
registerComponent('vc_row_inner', vc_row)
registerComponent('vc_column', vc_column)
registerComponent('vc_column_inner', vc_column)
registerComponent('vc_column_text', vc_column_text)
registerComponent('vc_hoverbox', vc_hoverbox)
registerComponent('vc_toggle', vc_toggle)
registerComponent('vc_single_image', vc_single_image)
registerComponent('vc_btn', vc_btn)
registerComponent('vc_video', vc_video)
registerComponent('vc_gallery', vc_gallery)
registerComponent('vc_media_grid', vc_gallery)
registerComponent('geo_shortcut', geo_shortcut)
registerComponent('rev_slider_vc', rev_slider_vc)
registerComponent('reda_homepage_slides', reda_homepage_slides)

// -----------------------------
// class components
// -----------------------------
const class_components = []
const registerClassComponent = (name, component) => {
  class_components.push(name)
  Vue.component(name.replace(/-/g, '_'), component)
}
registerClassComponent('reda-carousel-container', reda_carousel_container)

const wpapi = new WPAPI(config)
wpapi.menus = wpapi.registerRoute('wp-api-menus/v2', '/menus/(?P<id>)')

export default {
  options: config,
  components,
  class_components,
  wpapi: wpapi,
  util: new Util(),
  /* eslint-disable no-undef */
  shortcode: wp.shortcode
}
