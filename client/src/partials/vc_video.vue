<template>
<div class="vc_video">
<div class="video-container">
    <iframe xxwidth="560" xxheight="315"
        :src="url"
        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
    </iframe>
</div>
</div>
</template>
<script>
export default {
  props: [ 'title', 'link', 'color' ],
  computed: {
    url () {
      if (this.link.includes('embed')) {
        return this.link
      }

      // must use embed: "https://www.youtube.com/embed/xxx"
      var s = this.link.split('=')[1]
      return `https://www.youtube.com/embed/${s}`
    },
    show () {
      return !this.title.toLowerCase().includes('book an event')
    }
  }
}
</script>
<style scoped>
.vc_video {
    padding: 20px;
}
.video-container {
    position: relative;
    overflow: hidden;
    padding-top: 56.25%;
}

.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
}
</style>
