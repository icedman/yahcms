<template>
  <v-ons-page>
    <v-ons-list>
      <v-ons-list-item class="item-list-logo">
        <div class="menu-logo">
        <img :src="imageLogo"/>
        </div>
      </v-ons-list-item>
    <!--
      <v-ons-list-item>
        {{$store.state.ui.menu.context}}
      </v-ons-list-item>
    -->
      <div class="list-group-container">
        <div v-for="(menus, index) in menu_stack" :id="'item-group'+(index+1)" :style="'z-index: '+ index" :key='index' class="list-group-item">
          <v-ons-list-item v-for="(item, idx) in menus"
          :key="idx"
          :modifier="md ? 'nodivider' : ''"
          @click="click(item, index)" tappable>
            <div class="left">
            </div>
            <div class="center"><i :class="icon(item)"></i><div v-html="title(item)"></div></div>
            <div class="right">
              <i :class="iconRight(item)"></i>
            </div>
          </v-ons-list-item>
        </div>
      </div>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
export default {
  data () {
    return {
      menu_id: '',
      menu_stack: [],
      items: [],
      logos: {
        wcchc: { img: 'static/images/cc_logo_sml.png' },
        wahc: { img: 'static/images/mac_logo_sml.png' },
        wihd: { img: 'static/images/dav_logo_sml.png' },
        mphc: { img: 'static/images/man_logo_sml.png' }
      }
    }
  },

  watch: {
    '$store.state.ui.menu.context': {
      handler: function (newValue, oldValue) {
        this.fetch()
      }
    }
  },

  computed: {
    imageLogo () {
      var context = this.$store.state.ui.menu.context
      if (context.includes('wcchc')) {
        return this.logos.wcchc.img
      }
      if (context.includes('wahc')) {
        return this.logos.wahc.img
      }
      if (context.includes('wihd')) {
        return this.logos.wihd.img
      }
      if (context.includes('mphc')) {
        return this.logos.mphc.img
      }
      return 'static/images/waterfront_main_logo_1797.png'
    }
  },

  methods: {

    title (item) {
      if (item.title.includes('<')) {
        return 'Hotels'
      }

      // if (t === 'Home') {
      //   switch(this.$store.state.ui.menu.context) {
      //     case 'wcchc-nav':
      //       return 'Cebu City Hotel & Casino'
      //     break;
      //     case 'wahc-nav':
      //       return 'Airport Hotel & Casino Mactan'
      //     break;
      //     case 'wihd-nav':
      //       return 'Insular Hotel Davao'
      //     break;
      //     case 'mphc-nav':
      //       return 'Manila Pavillon'
      //     break;
      //   }
      // }

      return item.title
    },

    icon (item) {
      if (item.title.includes('<')) {
        return 'fa-pad fa fa-hotel'
      }
      if (item.title === 'Back') {
        return 'fa-pad fa fa-chevron-left'
      }
      if (item.title === 'Home') {
        return 'fa-pad fa fa-home'
      }
      if (item.title === 'Dining') {
        return 'fa-pad fa fa-utensils'
      }
      if (item.title === 'Rooms & Suites') {
        return 'fa-pad fa fa-bed'
      }
      if (item.title === 'Events & Activities') {
        return 'fa-pad fa fa-calendar-alt'
      }
      if (item.title === 'Gaming') {
        return 'fa-pad fa fa-dice'
      }
      if (item.title === 'Contact') {
        return 'fa-pad fa fa-phone'
      }
    },

    iconRight (item) {
      if (item.children && item.children.length) {
        return 'fa fa-chevron-right'
      }
    },

    async fetch () {
      if (!this.$store.state.ui.menu.context) {
        this.$store.commit('ui/setContext', this.$wp.options.menu)
      }

      // load again the main menus ... (this will have been cached the second time it is called)
      var menus = await this.$wp.util.fetchMenus(this, null)
      var m = menus.find(t => {
        return t.slug === this.$store.state.ui.menu.context
      })

      if (m) {
        this.menu_id = m.term_id
        var mi = await this.$wp.util.fetchMenus(this, this.menu_id)
        mi[0].items.forEach(i => { i.shown = true })
        this.items = mi[0].items
        if (this.menu_stack.length === 0) {
          this.menu_stack.push(mi[0].items)
        }
      }
    },

    click (item, group) {
      var menuEl
      if (item.back && this.menu_stack.length) {
        menuEl = document.querySelector('#item-group' + (group + 1))
        menuEl.classList.add('out')
        menuEl = document.querySelector('#item-group' + (group))
        menuEl.classList.remove('in')
        setTimeout(() => {
          this.items = this.menu_stack.pop()
        }, 250)
        return
      }

      if (item.children && item.children.length) {
        menuEl = document.querySelector('#item-group' + (group + 1))
        menuEl.classList.add('in')
        this.items = [ { title: 'Back', back: true }, ...item.children ]
        this.menu_stack.push(this.items)
        return
      }

      var l = this.$wp.util.getLinkSlug(item.url)
      if (l.indexOf('#') === -1) {
        this.$router.push(`/pages/${l}`)
      }

      this.$store.commit('splitter/toggle', false)
    },
    clean (item) {
      return item.replace(/&#038;/g, '&')
    }
  },

  mounted () {
    // get geolocation
    this.menu_id = this.$wp.options.menu

    // // load and cache the main menus
    // this.$wp.util.fetchMenus(this, null).then(() => {
    //   // then load the default menu
    //   this.fetch()
    // })
    this.fetch()
  }
}

</script>

<style scope>
.fa-pad {
  min-width: 35px;
}
.list-group-container{
  width: 100%;
  overflow-x: hidden;
}
.list-group-item{
  width: 100%;
  background: #fff;
  position: absolute;
  top:175px;
  left:0;
  animation: 0.30s ease-out 0s 1 slideInFromRight;
  animation-fill-mode:forwards;
  transition: left 0.40s;
}
.list-group-item.out{
  animation: 0.30s ease-out 0s 1 slideOutToRight;
}
.list-group-item.in{
  left:-260px;
}
.menu-logo{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.menu-logo img{
  max-height: 150px;
}
.item-list-logo{
  height: 175px;
}
@keyframes slideInFromRight {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes slideOutToRight {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}
@keyframes slideOutToLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
