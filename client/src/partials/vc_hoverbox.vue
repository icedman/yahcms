<template>
  <div class="vc-hoverbox">
      <div :class="flipped?'flipped hoverImage':'hoverImage'" :style="hoveImageStyle" @click="flipped=!flipped">
          <div class="title" :style="titleStyle">{{primary_title}}</div>
      </div>
      <div class="content" @click="flipped=!flipped">
        <slot></slot>
        <a class="button danger" @click.prevent="action()">{{hover_btn_title}}</a>
      </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      flipped: false,
      image_url: ''
    }
  },

  props: [
    'primary_title',
    'primary_title_font_container',
    'hover_btn_title',
    'hover_btn_color',
    'hover_btn_size',
    'hover_btn_link',
    'image'
  ],

  computed: {
    titleStyle () {
      var style = this.primary_title_font_container || ''
      return style.replace(/%23/g, '#').replace(/\|/g, ';')
    },

    hoveImageStyle () {
      return [
        { 'background-image': `url(${this.image_url})` },
        { 'background-size': 'cover' },
        { 'background-position': 'center center' },
        { 'background-color': '' }
      ]
    }
  },

  methods: {
    action () {
      var l = this.$wp.util.getLinkSlug(this.hover_btn_link)
      this.$router.push(l)
    }
  },

  mounted () {
    this.$wp.util.fetchImage(this, this.image).then(img => {
      this.image_url = img
    })
  }
}
</script>
<style scoped>
.vc-hoverbox {
  margin-top: 10px;
  position: relative;
  overflow: hidden;
}
.vc-hoverbox .title {
  margin: auto;
}
.vc-hoverbox .content p  {
  display: block;
  line-height: 20px;
}
.vc-hoverbox .content{
  text-align: center;
  padding: 0 10px;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fafafa;
  z-index: 5;
}
.vc-hoverbox .hoverImage, .vc-hoverbox .content, .vc-hoverbox{
  height: 490px !important;
}
.vc-hoverbox .hoverImage{
  width: 100%;
  position: absolute;
  top:0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
	transition: top 0.4s;
}
.vc-hoverbox .content img{
  display: block;
  margin: 0 auto 15px auto;
  width: auto;
  max-height: 160px;
}
.hoverImage.flipped{
  top: -500px;
}
.vc-hoverbox p:empty{
  display: none;
}
.vc-hoverbox .title{
  font-size: 1.2em;
  text-align: center;
}
</style>
