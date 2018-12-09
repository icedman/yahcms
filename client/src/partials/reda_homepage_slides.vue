<template>
<v-ons-card style="max-width:97vw; max-height: 98vh; padding: 8px; padding-top:2px">
<div class="title">
      <i class="fa fa-times" style="float: right; padding:8px; color: hsl(348, 100%, 61%);"
        @click="$store.commit('ui/setOffers', false)"></i>
        <div style="clear:both"></div>
</div>
<div>
  <ons-carousel ref="carousel">
      <div class="ons-swiper-target">
      <ons-carousel-item v-for="(s, idx) in slides" :key="idx">
          <div :style="style(s)" style="text-align: center">
            <div style="background: rgba(0,0,0,0.5); min-height: 480px; max-height: 88vh; padding: 4px">
            <component :is="layerComponent(l)"
              v-for="(l, idx) in s.layers" :key="idx"
              v-html="layerText(l)"
              :href="l.layer_action.image_link"
              :style="layerStyle(l)"
              :class="layerClass(l)"
              v-if="l.type==='text'">
            </component>
            </div>
          </div>
      </ons-carousel-item>
      </div>
  </ons-carousel>
</div>
</v-ons-card>
</template>
<script>
export default {
  props: [
    'alias',
    'slider'
  ],

  data () {
    return {
      interval: 5000,
      autoScrollerId: null,
      currentIndex: 0,
      slides: []
    }
  },

  beforeDestroy () {
    clearInterval(this.autoScrollerId)
  },

  methods: {
    style (slide) {
      if (slide) {
        return {
          'background-image': `url('${slide.image}')`,
          'background-size': 'cover',
          'background-position': 'center',
          'min-height': '480px'
        }
      }
      return null
    },

    layerText (layer) {
      return layer.text.replace(/<br\/>/g, '')
    },

    layerStyle (layer) {
      if (layer) {
        var style = {
          'padding': '8px'
        }
        style['font-size'] = layer.static_styles['font-size']['tablet']

        var action = layer.layer_action
        if (action && action.image_link && action.image_link.length) {
          // let button handle the color
          style['margin'] = '8px'
        } else {
          // style['color'] = layer.static_styles['color']['mobile']
          style['color'] = '#fff'
        }
        return style
      }
      return null
    },

    layerComponent (layer) {
      var action = layer.layer_action
      if (action && action.image_link && action.image_link.length) {
        return 'a'
      }
      return 'div'
    },

    layerClass (layer) {
      var action = layer.layer_action
      if (action && action.image_link && action.image_link.length) {
        return ['button', 'danger']
      }
    },

    prev () {
      this.$refs.carousel.prev()
    },

    next () {
      try {
        var idx = this.$refs.carousel.getActiveIndex()
        if (idx === this.slides.length - 1) {
          this.$refs.carousel.first()
          return
        }
        this.$refs.carousel.next()
      } catch (err) {
        //
      }
    },

    async loadSlider () {
      // var slider = await this.$wp.util.fetchSlider(this, this.alias)
      // console.log(JSON.parse(slider.data[0].params))
    },

    async loadImages () {
      var imgs = []
      var slides = await this.$wp.util.fetchSlides(this, this.slider)
      for (var i = 0; i < slides.data.length; i++) {
        var s = slides.data[i]
        var p = JSON.parse(s.params)
        var l = JSON.parse(s.layers)
        imgs.push({ image: p.image, layers: l })
      }

      this.slides = imgs

      // console.log(JSON.stringify(imgs[0].layers))

      this.autoScrollerId = setInterval(() => {
        this.next()
      }, this.interval)
    }
  },

  mounted () {
    this.loadImages()
  }
}
</script>
<style scoped>
</style>
