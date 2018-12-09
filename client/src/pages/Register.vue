<template>
  <ion-content style="background:red;">

    <div class="wrapper">
      <div class="login-container">
        <h5>Signup</h5>
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
        <div class="form-input">
          <label>
            <input type="password" v-model="confirm_password" required>
            <span class="placeholder">Confirm Password</span>
          </label>
        </div>
        <small>{{authStatus}}</small>
        <ons-button modifier="large" class="auth-btn" @click="register()">SIGN UP</ons-button>
        <!-- <p>or Sign Up using</p>
        <div style="display:inline-flex;margin-bottom:10px;">
            <a href="#" class="social-links fb"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="social-links tt"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-links gg"><i class="fab fa-google-plus-g"></i></a>
        </div> -->
        <p><router-link to="/auth/login">Log in instead</router-link></p>
        <p class="lastText">Just continue as <router-link to="/">Guest</router-link></p>
      </div>
    </div>

  </ion-content>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      confirm_password: '',
      isLoading: false,
      authStatus: ''
    }
  },

  computed: {},

  methods: {
    GuestLogin () {
      this.$router.push('/')
    },

    checkPassword () {
      if (this.password && this.password.length > 0) {
        if (this.password.length < 6) {
          return {
            type: 'is-danger',
            type2: '',
            message: 'password is too short'
          }
        }
        if (this.password !== this.confirm_password) {
          return {
            type: 'is-danger',
            type2: 'is-danger',
            message: 'passwords do not match'
          }
        }
      }
      return {
        type: '',
        type2: '',
        message: ''
      }
    },

    register () {
      if (this.email.length < 4) {
        // this.$root.$emit('toast', {
        //   severity: 3,
        //   message: 'Please enter an email address.'
        // })
        alert('Please enter an email address.')
        return
      }

      var passwordCheck = this.checkPassword()
      if (passwordCheck.type !== '') {
        // this.$root.$emit('toast', passwordCheck)
        this.authStatus = passwordCheck.message
        return
      }

      // this.$root.$emit('indicator', true)

      this.$firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(() => {
          //
          // this.$root.$emit('toast', {
          //   type: 'is-success',
          //   message: 'Registration successful.'
          // })
          console.log('Registration successful.')
          this.$router.replace('/auth/login')
        })
        .catch(error => {
          // Handle Errors here.
          // const errorCode = error.code
          const errorMessage = error.message
          // this.$root.$emit('toast', {
          //   severity: 3,
          //   message: errorMessage
          // })

          this.authStatus = errorMessage
        })
        .finally(() => {
          // this.$root.$emit('indicator', false)
        })
    },

    // register(){
    //     if(this.validateEmail(this.email)){
    //         if(this.password.length<6){
    //             this.authStatus = "Password must be 6 characters or more.";
    //         } else {
    //             alert("Logged in");
    //         }
    //     } else {
    //          this.authStatus = "Please input a valid email.";
    //     }
    // },
    validateEmail (email) {
      /* eslint-disable no-useless-escape */
      var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return regex.test(String(email).toLowerCase())
    }
  },

  mounted () {
    // this.$wp.preLogin();
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
  margin: 30px auto 0px auto;
  max-width: 100%;
}

.form-input {
  margin: 20px 0;
  width: 100%;
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
</style>
