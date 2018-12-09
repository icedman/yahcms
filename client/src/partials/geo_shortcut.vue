<template>
  <div v-if="!shownOnce && show">
     <v-ons-toast :visible.sync="toastVisible" animation="fall">
      You are currently near in {{geo.context}}
      <button @click="toastVisible = false">Visit Hotel</button>
    </v-ons-toast>
  </div>
</template>
<script>
export default {
  data () {
    return {
      toastVisible: false,
      shownOnce: false,
      show: true,
      geo: {
        lat: 123,
        lng: 456,
        context: this.$store.state.ui.menu.context
      },
      coordinates: {
        wcchc: { lat: 10.3261234, lng: 123.9032286, name: 'Waterfront Cebu City Hotel & Casino' },
        wahc: { lat: 10.3168226, lng: 123.9766027, name: 'Waterfront Airport Hotel & Casino' },
        wihd: { lat: 7.1064277, lng: 125.6481222, name: 'Waterfront Insular Hotel Davao' },
        mphc: { lat: 14.5816372, lng: 120.9819414, name: 'Manila Pavilion Hotel & Casino' }
      }
    }
  },
  methods: {
    getNearestHotel () {
      var _component = this
      var tempnearest
      var temphotels = this.coordinates
      Object.keys(temphotels).forEach(function (prop) {
        console.log('user: ' + _component.geo.lat + ' -> ' + _component.geo.lng)
        console.log('hotel: ' + temphotels[prop].lat + ' -> ' + temphotels[prop].lng)
        var range = _component.getLocationRange(_component.geo, temphotels[prop])
        if (tempnearest == null) {
          tempnearest = {distance: range, name: temphotels[prop].name, context: prop}
        } else if (tempnearest.distance > range) {
          tempnearest = {distance: range, name: temphotels[prop].name, context: prop}
        }
        console.log('%c' + prop + ' --> ' + range, ' color: #ee3839;')
      })
      console.log('%cclosest: ' + tempnearest.name, 'background: #ee3839; color: #fff; padding: 3px')
      _component.geo.context = tempnearest.name
      this.toastVisible = true
      this.$store.commit('ui/setContext', tempnearest.context)

      setTimeout(() => {
        this.toastVisible = false
      }, 10000)
    },
    getLocationRange (from, to) {
      var latFrom = this.convertDegtoRad(from.lat)
      var longFrom = this.convertDegtoRad(from.lng)
      var latTo = this.convertDegtoRad(to.lat)
      var longTo = this.convertDegtoRad(to.lng)
      var R = 6371 // km
      var x = (longTo - longFrom) * Math.cos((latFrom + latTo) / 2)
      var y = (latTo - latFrom)
      var distance = Math.sqrt(x * x + y * y) * R
      return distance
    },
    convertDegtoRad (deg) {
      return deg * Math.PI / 180
    }
  },
  mounted () {
    this.shownOnce = this.$store.state.ui.geoChecked
    if (!this.shownOnce) {
      this.$store.commit('ui/setGeoChecked', true)
      try {
        // fetch geo data
        this.$getLocation({
          enableHighAccuracy: true, // defaults to false
          timeout: 30000, // defaults to Infinity
          maximumAge: 0 // defaults to 0
        }).then(coordinates => {
          console.log(coordinates)
          this.geo = coordinates
          this.getNearestHotel()
          console.log('%ccurrent Lat: ' + this.geo.lat + ' Long: ' + this.geo.lng, 'background: #222; color: #bada55; padding: 3px')
        }).catch(error => {
          console.log(error)
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style>
.toast__message {
    white-space: normal;
}

.toast {
    padding: 16px 16px;
    line-height: 1.5;
}
</style>
