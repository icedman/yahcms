<template>
    <div class="vc-single-image">
        <img :src="image_url" v-if="image_url"/>
    </div>
</template>
<script>
export default {
  data () {
    return {
      image_url: null
    }
  },

  props: [ 'image', 'image_size', 'alignment' ],

  mounted () {
    this.$wp.util.fetchImage(this, this.image).then(img => {
      this.image_url = img
    })
  }
}
</script>
<style scoped>
.vc-single-image img {
    display: block;
    margin: 10px auto;
    width: 100%;
}
</style>
