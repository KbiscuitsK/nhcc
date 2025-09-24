<template>
  <el-row>
    <el-col :span="2" :offset="6">
    <RouterLink :to="{ name: 'WelcomeView' }"><el-button type="primary"><el-icon>
          <HomeFilled />
        </el-icon>首&emsp;&emsp;页</el-button></RouterLink></el-col>
    <el-col :span="2"><RouterLink :to="{ name: 'UsersView' }"><el-button type="primary"><el-icon>
          <User />
        </el-icon>用户管理</el-button></RouterLink></el-col>
    <el-col :span="2"><RouterLink :to="{ name: 'BloodGlucoseView' }"><el-button type="primary">血&emsp;&emsp;糖</el-button></RouterLink></el-col>
    <el-col :span="2"><RouterLink :to="{ name: 'BloodPressureView' }"><el-button type="primary">血&emsp;&emsp;压</el-button></RouterLink></el-col>
    <el-col :span="2"><RouterLink :to="{ name: 'HeartRateView' }"><el-button type="primary">心&emsp;&emsp;率</el-button></RouterLink></el-col>
    <el-col :span="2"><el-button @click="loginQuit" type="primary">
      <el-icon>
        <Close />
      </el-icon>&emsp;退出&emsp;</el-button></el-col>
  </el-row>
  <hr style="margin-bottom: 0;padding: 0;" />
  <RouterView />
</template>

<script>
import { HomeFilled } from '@element-plus/icons-vue';
import axios from 'axios';
export default {
  name: 'MainView',
  emits: ['login-quit'],
  methods: {
    loginQuit() {
      this.$emit('login-quit');
    }
  },
  data() {
    return {
    }
  }
}
</script>
