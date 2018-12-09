<template>
  <v-ons-page>
    <custom-toolbar modifier="white-content">
      {{ title }}
      <v-ons-toolbar-button slot="right" modifier="white-content" @click="$store.commit('splitter/toggle')">
        <v-ons-icon icon="ion-navicon, material:md-menu"></v-ons-icon>
      </v-ons-toolbar-button>
    </custom-toolbar>

    <!-- <v-ons-progress-bar indeterminate :value="progress"></v-ons-progress-bar> -->

    <v-ons-tabbar>
      <template slot="pages">
        <div class="content">

  <!--
    <v-ons-modal :visible="$store.state.ui.offers">
      <reda_homepage_slides alias="reda" slider="1"></reda_homepage_slides>
    </v-ons-modal>
  -->

          <router-view v-if="show"></router-view>
        </div>
      </template>
      <v-ons-tab v-for="(t, idx) in tabs" :key="idx"
        :label="t.label"
        :icon="t.icon"
        :active="$store.state.route.name && $store.state.route.name.includes(t.name)"
        @click.prevent="tab(t)"
      ></v-ons-tab>
    </v-ons-tabbar>

  </v-ons-page>
</template>

<script>
export default {

  watch: {
    '$store.state.route.path': {
      handler: function (newValue, oldValue) {
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
  },

  data () {
    return {
      show: true,
      progress: 100,
      tabs: [
        {
          name: 'pages',
          label: 'Hotel',
          icon: 'fa-building',
          path: '/pages/'
        },
        {
          name: 'book',
          label: 'Book',
          icon: 'fa-bed',
          path: '/pages/book-now'
        },
        {
          name: 'offers',
          label: 'Offers',
          icon: 'fa-tag',
          action: 'offers'
        },
        {
          account: 'account',
          label: 'Account',
          icon: 'fa-user',
          path: '/profile'
        }
      ]
    }
  },

  methods: {
    tab (tab) {
      if (tab.path) {
        this.$store.commit('ui/setOffers', false)
        this.$router.push(tab.path)
      }
      if (tab.action) {
        if (tab.action === 'offers') {
          this.$store.commit('ui/setOffers', true)
        }
      }
    }
  },

  computed: {
    index: {
      get () {
        return this.$store.state.tabbar.index
      },
      set (newValue) {
        this.$store.commit('tabbar/set', newValue)
      }
    },
    title () {
      // return this.$store.state.route.path
      // return this.$store.state.deviceReady
      return ''
    }
  },

  mounted () {
    this.tabs[0].url = `/pages/${this.$wp.options.frontPage}`
  }
}
</script>

<style>
</style>
