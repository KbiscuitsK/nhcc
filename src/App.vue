<template>
  <el-row>
    <el-col>
      <img alt="Neuedu logo" src="./assets/logo.svg" height="50px" 
      style="padding-bottom: 10px;vertical-align:middle;" />
    </el-col>
  </el-row>
  <el-row>
    <el-col>
      <MainView v-if="user" @login-quit="loginQuit" />
      <LoginView v-else title="Neusoft Health Check-up Center" @login-success="loginSuccess" />
    </el-col>
  </el-row>

</template>

<script>
import LoginView from './components/LoginView.vue'
import MainView from './components/MainView.vue'
export default {
  name: 'App',
  components: {
    LoginView,
    MainView
  },
  methods: {
    loginSuccess(user) {
      console.log(user);
      this.user = user;
    },
    loginQuit() {
      this.user = null;
    }
  },
  data() {
    return {
      user: null
    }
  }

}
</script>
