export default {
  data () {
    return {
      toastTimeout: 2000,
      email: '',
      password: '',
      isLoading: false,
      authStatus: ''
    }
  },

  computed: {},

  methods: {

    _login (token, user) {
      this.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token
      this.$store.commit('user/setUser', {
        token: token,
        user: user
      })

      // this.$ons.notification.toast(token, { timeout: this.toastTimeout })
      this.$router.push('/pages')
    },

    checkLoginRedirect () {
      /* verify token */
      this.$firebase.auth().getRedirectResult().then((result) => {
        if (result.credential) {
          var token = result.credential.accessToken
          var user = result.user
          this._login(token, user)
        }
      }).catch(function (error) {
        // Handle Errors here.
        // var errorCode = error.code
        var errorMessage = error.message
        this.$ons.notification.toast(errorMessage, { timeout: this.toastTimeout })
      })
    },

    // verifyToken () {
    //   return this.$firebase
    //     .auth()
    //     .currentUser.getIdToken(/* forceRefresh */ true)
    //     .then(idToken => {
    //       // check with server '/me'
    //       this.token = idToken
    //       this.$http.defaults.headers.common['Authorization'] =
    //         'Bearer ' + idToken

    //       this.$store.commit('user/setUser', {
    //         token: this.token,
    //         user: this.$firebase.auth().currentUser
    //       })

    //       this.$nextTick(() => {
    //         this.$router.push('/pages')
    //       })
    //     })
    // },

    login () {
      if (this.email.length < 4) {
        this.$ons.notification.toast('Please enter an email address', { timeout: this.toastTimeout })
        return
      }
      if (this.password.length === 0) {
        this.$ons.notification.toast('Please enter a password', { timeout: this.toastTimeout })
        return
      }
      // this.$root.$emit('indicator', true)
      this.$firebase
        .auth()
        .setPersistence(this.$firebase.auth.Auth.Persistence.LOCAL)
        .then(() =>
          this.$firebase
            .auth()
            .signInWithEmailAndPassword(this.email, this.password)
        )
        .then(result => {
          var token = result.credential.accessToken
          var user = result.user
          this._login(token, user)
        })
        .catch(error => {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          if (errorCode === 'auth/wrong-password') {
            this.$ons.notification.toast('Password error', { timeout: this.toastTimeout })
          } else {
            this.$ons.notification.toast(errorMessage, { timeout: this.toastTimeout })
          }
        })
        .finally(() => {
          // this.$root.$emit('indicator', false)
        })
    },

    gglogin (_provider) {
      let provider = _provider
      if (!provider) {
        provider = new this.$firebase.auth.GoogleAuthProvider()
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly')
      }
      // this.$root.$emit('indicator', true)

      return this.$firebase
        .auth()
        .setPersistence(this.$firebase.auth.Auth.Persistence.LOCAL)
        .then(() => this.$firebase.auth().signInWithRedirect(provider))
        .then(() => {
          return this.$firebase.auth().getRedirectResult()
        }).then((result) => {
          var token = result.credential.accessToken
          var user = result.user
          this._login(token, user)
        }).catch((error) => {
          // Handle Errors here.
          // var errorCode = error.code
          var errorMessage = error.message
          this.$ons.notification.toast(errorMessage, { timeout: this.toastTimeout })
        })
    },

    fblogin () {
      const provider = new this.$firebase.auth.FacebookAuthProvider()
      this.gglogin(provider)
    },

    validateEmail (email) {
      /* eslint-disable no-useless-escape */
      var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return regex.test(String(email).toLowerCase())
    },

    back () {
      this.$router.go(-1)
    }
  },

  mounted () {
    this.checkLoginRedirect()
  }
}