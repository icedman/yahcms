<template>
  <v-ons-page>
    <div class="wrapper">
      <div class="login-container">
        <h5>Welcome</h5>
        <div class="loginLogo-container">
          <img class="loginLogo" src="static/images/waterfront_main_logo_red.png">
        </div>
        <div class="form-input">
          <label>
            <input type="text" v-model="email" required>
            <span class="placeholder">Email</span>
          </label>
        </div>
        <div class="form-input">
          <label>
            <input type="password" v-model="password" required>
            <span class="placeholder">Password</span>
          </label>
        </div>
        <small>{{authStatus}}</small>

        <!-- <button class="input button-login" @click="login()">LOGIN</button> -->
        <ons-button modifier="large" class="auth-btn" @click.prevent="login()">LOGIN</ons-button>

        <p>or Sign Up using</p>
        <div style="display:inline-flex;margin-bottom:10px;">
          <a href="#" class="social-links fb" @click.prevent="fblogin()"><i class="fab fa-facebook-f"></i></a>
          <!-- <a href="#" class="social-links tt"><i class="fab fa-twitter"></i></a> -->
          <a href="#" class="social-links gg" @click.prevent="gglogin()"><i class="fab fa-google-plus-g"></i></a>
        </div>
        <p>Forget your password? <router-link to="/auth/forget">Reset Password</router-link></p>
        <p>Don’t have an account? <router-link to="/auth/register">Sign Up</router-link></p>
        <p class="lastText">Just continue as <router-link to="/pages">Guest</router-link></p>
      </div>
    </div>
  </v-ons-page>
</template>

<script>
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
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Quicksand:500");

.hero {
  background-position: center center;
  background-size: cover;
}

p.control {
  margin-bottom: 8px;
}

button.is-facebook {
  background: #3b5998;
  color: #fff;
}

button.is-facebook:hover {
  background: #4b69a8;
  color: #fff;
}

h5,
p {
  font-family: "Quicksand", sans-serif;
  margin: 0;
}

.social-links {
  display: block;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  margin: 7px;
  transition: box-shadow 0.3s ease-in-out;
}

.social-links:hover {
  color: #fff;
  background: grey;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.fb {
  background-color: #2c82c9;
}

.gg {
  background-color: #e74c3c;
}

.tt {
  background-color: #19b5fe;
}

a {
  text-decoration: none;
  font-weight: 800;
}

a:hover {
  color: #ee3943;
}

.wrapper {
  background-color: #fff;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-container {
  padding: 25px;
  width: 450px;
  height: 100vh;
  max-height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  z-index: 1001;
  border-radius: 8px;
}

.loginLogo-container {
  width: 40%;
}

.loginLogo {
  display: inline-block;
  margin: auto;
  max-width: 100%;
}

.form-input {
  margin: 10px 0;
  width: 100%;
  margin-bottom: 40px;
}

.form-input label {
  position: relative;
  display: block;
  width: 100%;
  min-height: 45px;
}

.form-input .placeholder {
  font-family: "Quicksand", sans-serif;
  color: rgba(0, 0, 0, 0.7);
  position: absolute;
  display: block;
  top: 27px;
  z-index: 2;
  font-size: 20px;
  transition: all 0.2s ease-in-out;
  width: 100%;
  cursor: text;
}

.form-input input {
  position: absolute;
  top: 15px;
  z-index: 1;
  width: 100%;
  font-size: 20px;
  border: 0;
  border-bottom: 2px solid rgba(0, 0, 0, 0.2);
  transition: border-color 0.3s ease-in-out;
  padding: 5px 0;
  outline: none;
  margin: 0;
  background: rgba(255, 255, 255, 0);
}

.form-input input {
  height: 30px;
}

.form-input input:focus,
.form-input input:valid {
  border-bottom: 2px solid #ee3943;
}

.form-input input:focus + .placeholder,
.form-input input:valid + .placeholder {
  top: 0;
  cursor: inherit;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.7);
}

@media screen and (min-width: 320px) and (max-width: 900px) and (orientation: landscape) {
  .loginLogo-container {
    width: 25%;
  }

  .wrapper {
    height: 700px;
  }

  .login-container {
    height: 100%;
  }
}

@media only screen and (max-width: 1024px) {
  /* For mobile phones: */
  .login-container {
    width: 550px;
  }
}

@media only screen and (max-width: 675px) {
  /* For mobile phones: */
  .login-container {
    width: 90%;
  }
}

small {
  color: #ee3943;
  font-size: 1em;
  font-family: "Quicksand", sans-serif;
}

.btnBack {
  position: absolute;
  top: 15px;
  left: 15px;
}
</style>
