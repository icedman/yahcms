<template>
    <div>
        <!--
        <ons-carousel auto-scroll>
            <div class="ons-swiper-target">
            <ons-carousel-item v-for="(s, idx) in slides" :key="idx">
                {{s.title}} {{idx}} {{s.params}}
            </ons-carousel-item>
            </div>
        </ons-carousel>
        -->
    </div>
</template>
<script>
export default {
  props: [ 'alias' ],

  data () {
    return {
      slides: []
    }
  },

  methods: {

    _layerText (slide) {
      var t = []
      slide.layers.forEach(l => {
        if (l.text.trim().length > 0) {
          l.text = l.text.replace('<br/>', ' ')
          l.text = l.text.replace('</br>', ' ')
          t.push(l.text)
        }
      })
      return t
    },

    async fetch () {
      var res = await this.$wp.util.fetchSlides(this, this.alias)
      var slides = []
      res.data.forEach(slide => {
        try { var layers = typeof (slide.layers) !== 'object' ? JSON.parse(slide.layers) : slide.layers } catch (err) {}
        try { var params = typeof (slide.params) !== 'object' ? JSON.parse(slide.params) : slide.params } catch (err) {}
        slide.layers = layers || []
        slide.text = this._layerText(slide)
        slide.params = params
        slide.params.image_path = slide.params.image
        slides.push(slide)
      })
      this.slides = slides
    }
  },

  mounted () {
    this.fetch()
  }
}
</script>
<style scoped>
</style>
