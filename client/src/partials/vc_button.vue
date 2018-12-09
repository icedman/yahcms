<template>
    <a class="button" :class="extraCss" v-show="show" :href="cleanedLink">
        {{title}}
    </a>
</template>
<script>
export default {
  props: [ 'title', 'link', 'color', '_style', 'outline_custom_color' ],
  computed: {
    show () {
      return !this.title.toLowerCase().includes('book an event')
    },

    cleanedLink () {
      return this.$wp.util.cleanLink(this.link)
    },

    extraCss () {
      if (this.outline_custom_color) {
        return 'danger'
      }
      return this.color
    }
  }
}
</script>
<style scoped>
</style>
