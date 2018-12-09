<template>
    <div style="margin-bottom: 12px">
    <ons-list>
        <ons-list-item @click="show=!show">
            <div class="center">{{title}}</div>
            <div class="right">
                <v-ons-icon :icon="icon" :class="color"></v-ons-icon>
            </div>
        </ons-list-item>
        <ons-list-item v-if="show">
            <div class="left">
                <slot></slot>
            </div>
        </ons-list-item>
    </ons-list>
    </div>
</template>
<script>
export default {
  data () {
    return {
      show: false
    }
  },

  props: [ 'title', 'color', 'size', '_style' ],

  computed: {
    icon () {
      return this.show ? 'fa-chevron-left' : 'fa-chevron-down'
    }
  }
}
</script>
<style scoped>
.pink {
    color: hsl(348, 100%, 61%);
}
</style>
