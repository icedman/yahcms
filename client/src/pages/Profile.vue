<template>
    <div>
        <!-- <pre> {{$store.state.user.user}} </pre> -->
        <div class="accountinfocont">
          <div class="accountinfo" >
              <img src="static/images/logo.png">
              <div>
                  <span class="name">{{$store.state.user.user.name}}</span><br>
                  <span class="email">{{$store.state.user.user.email}}</span>
              </div>
               <button class="button" @click="logout()">Logout</button>
          </div>
        </div>
    </div>
</template>
<script>
export default {
  methods: {
    logout () {
      delete this.$http.defaults.headers.common['Authorization']
      this.$firebase.auth().signOut()
      this.$store.commit('user/setUser', {
        token: null,
        user: null
      })
      this.$router.replace('/')
    }
  }
}
</script>
<style scoped>
.accountinfo {
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 45vh;
}
.accountinfo img{
    height: 150px;
    width: 150px;
    border-radius: 50%;
    margin-top: 20px;
}
</style>
