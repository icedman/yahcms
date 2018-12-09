<template>
    <div class="vc-row" :style="style">
      <!-- <div :style="this.images.length ? 'background: rgba(0,0,0,0.5); min-height: 600px' : null"> -->
        <slot></slot>
      <!-- </div> -->
    </div>
</template>
<script>
export default {
  props: [
    'parallax_image'
  ],

  data () {
    return {
      interval: 2500,
      autoScrollerId: null,
      currentIndex: 0,
      images: []
    }
  },

  beforeDestroy () {
    clearInterval(this.autoScrollerId)
  },

  computed: {
    style () {
      if (this.images.length) {
        return {
          'background-image': `url('${this.images[this.currentIndex].image}')`,
          'background-size': 'cover',
          'background-position': 'center',
          'min-height': '600px'
        }
      }
      return null
    }
  },

  methods: {
    async loadImages () {
      var imgs = []
      var images = this.parallax_image.split(',')
      for (var i = 0; i < images.length; i++) {
        var id = Number(images[i])
        var url = await this.$wp.util.fetchImage(this, id)
        imgs.push({ image: url })
      }
      this.images = imgs

      // autoscroll
      this.autoScrollerId = setInterval(() => {
        if (this.images.length > 1) {
          var idx = this.currentIndex + 1
          if (idx === this.images.length) {
            idx = 0
          }
          this.currentIndex = idx
        }
      }, this.interval)
    }
  },

  mounted () {
    if (this.parallax_image) {
      this.loadImages()
    }
  }
}
</script>
<style scoped>
.vc-row > div {
 display:flex;
 flex-wrap: wrap;
 justify-content: center;
 padding: 5px 10px;
}
@media only screen and (max-width: 800px) {
    .vc-row > div {
        display:block
    }
}
</style>
