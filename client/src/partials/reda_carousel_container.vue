<template>
  <div><!-- REDA CAROUSEL :: USED --></div>
  <!--
    <div style="display:block">REDA_CAROUSEL
        <div style="display:none">
            <slot></slot>
        </div>
        <ons-carousel ref="carousel">
            <div class="ons-swiper-target">
            <ons-carousel-item v-for="(s, idx) in slides" :key="idx">
                <div v-html="s.content" style="display:block;"></div>
            </ons-carousel-item>
            </div>
        </ons-carousel>
    </div>
  -->
</template>
<script>
export default {
  /*
  data () {
    return {
      interval: 2500,
      autoScrollerId: null,
      slides: []
    }
  },
  methods: {
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
    var sl = []
    var ss = this.$slots.default[0].elm.querySelectorAll('.reda-carousel-item')
    Array.prototype.forEach.call(ss, s => {
      sl.push({
        content: s.innerHTML
      })
    })
    this.slides = sl

    this.autoScrollerId = setInterval(() => {
      if (this.slides.length > 1) {
        this.next()
      }
    }, this.interval)
  }
  */
}
</script>
<style scoped>
.reda-carousel-item {
    width: 100%;
}
.reda-carousel-img span img {
    max-width: 100%;
}
</style>
