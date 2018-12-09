<template>
    <div class="vc_gallery">
      <div class="images-container">
        <div class="image-carousel">
        <ons-carousel item-height="200px" ref="carousel">
            <div class="ons-swiper-target">
            <ons-carousel-item v-for="(s, idx) in slides" :key="idx">
                <div :style="style(s)"></div>
            </ons-carousel-item>
            </div>
        </ons-carousel>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'images',
    'include'
  ],
  data () {
    return {
      interval: 2500,
      autoScrollerId: null,
      slides: []
    }
  },

  methods: {

    style (src) {
      if (src) {
        return {
          'background-image': `url('${src}')`,
          'background-size': 'cover',
          'background-position': 'center',
          'min-height': '300px'
        }
      }
      return null
    },

    async loadImages () {
      var _images = this.images || this.include
      var imgs = []
      var images = _images.split(',')
      for (var i = 0; i < images.length; i++) {
        var id = Number(images[i])
        var url = await this.$wp.util.fetchImage(this, id)
        imgs.push(url)
      }
      this.slides = imgs

      // autoscroll
      this.autoScrollerId = setInterval(() => {
        this.next()
      }, this.interval)
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
    }
  },

  beforeDestroy () {
    clearInterval(this.autoScrollerId)
  },

  mounted () {
    window.$gal = this
    this.loadImages()
  }
}
</script>
<style scoped>
.vc_gallery {
    padding: 20px;
}
.images-container {
    position: relative;
    overflow: hidden;
}
</style>
