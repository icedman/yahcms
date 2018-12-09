<template>
  <v-ons-page>
    <div v-if="loadingProgress" class="circular-progress-container">
      <v-ons-progress-circular indeterminate></v-ons-progress-circular>
    </div>
    <geo_shortcut></geo_shortcut>
    <div id="body-container"></div>
  </v-ons-page>
</template>
<script>
import Vue from 'vue'

export default {
  data () {
    return {
      post_type: 'post',
      slug: null,
      posts: [],
      isLoading: true
    }
  },
  computed: {
    loadingProgress () {
      return this.isLoading
    }
  },
  methods: {
    shortcodeHandler (tag, content, callback = undefined) {
      const reserved = [ 'style' ]
      if (callback === undefined) {
        // var self = this
        callback = sc => {
          var tag = sc.tag
          var content = sc.content || ''
          var extraClass = ''
          var style = ''
          var data = ''
          if (sc.attrs) {
            for (var n in sc.attrs.named) {
              var val = sc.attrs.named[n].trim().replace(/"/g, "'")
              if (reserved.indexOf(n) !== -1) {
                n = '_' + n
              }
              data += `${n}="${val}" `
            }
          }
          console.log(`${tag} > ${data}`)
          return `<${tag} class="${extraClass}" style="${style}" ${data}><div>${content}</div></${tag}>`
        }
      }

      var result = content
      while ((this.$wp.shortcode.next(tag, result)) !== undefined) {
        result = this.$wp.shortcode.replace(tag, result, callback)
      }
      return result
    },

    pageComponent (id, content) {
      var name = `wp-post-${id}`
      var result = content

      // shortcodes!
      this.$wp.components.forEach(tag => {
        result = this.shortcodeHandler(tag, result)
      })

      // clean
      var d = document.createElement('div')
      d.innerHTML = result

      this.$wp.class_components.forEach(cc => {
        var directives = d.querySelectorAll(`.${cc}`)
        Array.prototype.forEach.call(directives, dc => {
          var dcWrap = document.createElement('component')
          dcWrap.innerHTML = dc.innerHTML
          dcWrap.setAttribute('is', cc.replace(/-/g, '_'))
          dc.innerHTML = dcWrap.outerHTML
        })
      })

      result = d.innerHTML

      var c = {
        name: name,
        template: `<div>
          ${result}
          </div>`,

        methods: {
          buttonClick () {
            this.$parent.buttonClick()
          }
        }
      }

      var ComponentClass = Vue.extend(c)
      var instance = new ComponentClass({
        parent: this
      })

      // console.log(c)
      var container = document.querySelector('#body-container')

      instance.$mount() // pass nothing
      container.appendChild(instance.$el)

      setTimeout(() => {
        this.$wp.util.mutateLinks(this, container)
      }, 500)

      setTimeout(() => {
        this.initMap()
        this.isLoading = false
      }, 1000)
      return name
    },

    async fetch () {
      this.post_type = this.$store.state.route.meta['post_type'] || 'posts'
      this.slug = this.$store.state.route.params['slug']

      if (!this.slug) {
        this.$nextTick(() => {
          this.$router.replace('/pages/' + this.$wp.options.frontPage)
        })
        return
      }

      if (this.slug.includes(this.$wp.options.domain)) {
        // this.$nextTick(() => {
        //   this._posts = [ this.pageComponent('start-page', require('@/front_page.json').content) ]
        // })
        // return
        this.$nextTick(() => {
          this.$router.replace('/pages/' + this.$wp.options.frontPage)
        })
        return
      }

      var response = await this.$cache.getCached(this.slug, () => this.$http({
        method: 'get',
        url: `${this.$wp.options.endpoint}wp/v2/${this.post_type}?slug=${
          this.slug
        }`,
        params: {}
      }))

      var data = response.data
      var _posts = []
      data.forEach(d => {
        if (!d.content) {
          return
        }
        var content = d.content.rendered

        // cleanup
        content = content.replace(/<p>\[vc_/g, '[vc_')
        content = content.replace(/&#8221;/g, "'")
        content = content.replace(/&#8243;/g, "'")
        content = content.replace(/<style/g, '<!--style')
        content = content.replace(/\/style>/g, '/style-->')
        content = content.replace(/<script/g, '<!--script')
        content = content.replace(/\/script>/g, '/script-->')

        _posts.push(this.pageComponent(d.id, content))
      })
      this.posts = _posts
    },
    initMap () {
      var slug = this.$store.state.route.params['slug']
      if (!slug.includes('contact')) {
        return
      }
      var mapEl = document.querySelector('.reda-google-map')
      mapEl.id = 'map'
      var map
      // eslint-disable-next-line
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 10.3044297, lng: 123.9018764},
        zoom: 12,
        gestureHandling: 'cooperative'
      })
      // eslint-disable-next-line
      var marker = new google.maps.Marker({
        position: {lat: 10.3044297, lng: 123.9018764},
        description: 'waterfront',
        // eslint-disable-next-line
        animation: google.maps.Animation.DROP,
        icon: 'static/images/icon.png'
      })
      // To add the marker to the map, call setMap();
      marker.setMap(map)
    }
  },

  mounted () {
    this.fetch()
  },

  update () {
    var container = document.querySelector('#body-container')
    this.$nextTick(() => {
      this.$wp.util.mutateLinks(this, container)
    })
  }
}
</script>
<style>
#body-container {
  padding: 0px;
  background-color: white;
  overflow-x: hidden;
}
#body-container a {
  color: #000;
}
#body-container a.button {
  color: #fff;
}
.circular-progress-container{
  position:absolute;
  background: #fff;
  z-index: 50;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.progress-circular__primary{
  stroke: #ee3839 !important;
}
ons-progress-circular{
  height: 50px;
  width: 50px;
}
.header_text-white span{
  color: #fff;
  font-size: 40px !important;
}
.vc-row[parallax=content-moving]{
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px !important;
}
.vc-col-text div{
  text-align: justify;
  margin-bottom: 15px;
  line-height: 25px;
}
h1 span{
  font-size: 1.75em !important;
}
</style>
