<template>
  <div class="login-page">
    <!-- 登录卡片容器 -->
    <div class="login-card">
      <h1 class="login-title">{{ title }}</h1>
      
      <!-- 提示信息 -->
      <div class="login-message" v-if="message">{{ message }}</div>
      
      <!-- 登录表单 -->
      <el-form class="login-form" label-width="80px">
        <el-form-item label="账号">
          <el-input 
            type="text" 
            placeholder="请输入账号" 
            v-model="account" 
            class="login-input"
          />
        </el-form-item>
        
        <el-form-item label="密码">
          <el-input 
            type="password" 
            placeholder="请输入密码" 
            v-model="password" 
            class="login-input"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            @click="login" 
            type="primary" 
            class="login-button"
          >
            登&emsp;录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'LoginView',
  props: {
    title: {
      type: String,
      default: '系统登录'
    }
  },
  emits: ['login-success'],
  data() {
    return {
      account: '',
      password: '',
      message: ''
    };
  },
  methods: {
    login() {
      // 简单的表单验证
      if (!this.account || !this.password) {
        this.message = '请输入账号和密码';
        return;
      }

      axios.get('/user/login', {
        params: {
          account: this.account,
          password: this.password
        }
      })
      .then((response) => {
        if (response.status === 200) {
          this.message = response.data.description || '';
          if (response.data.code === 0) {
            this.$emit('login-success', response.data.data);
          }
        }
      })
      .catch((error) => {
        console.error('登录请求失败:', error);
        this.message = '登录失败，请检查网络或账号密码';
      });
    }
  }
};
</script>

<style scoped>
.login-page {
  /* 页面容器：全屏并居中内容 */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
  padding: 20px;
}

.login-card {
  /* 登录卡片样式 */
  width: 100%;
  max-width: 400px;
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-title {
  /* 标题样式 */
  text-align: center;
  margin-bottom: 20px;
  color: #1890ff;
}

.login-form {
  /* 表单样式 */
  margin-top: 20px;
}

.login-input {
  /* 输入框样式 */
  width: 100%;
}

.login-button {
  /* 按钮样式 */
  width: 100%;
}

.login-message {
  /* 提示信息样式 */
  text-align: center;
  color: #f5222d;
  margin-bottom: 10px;
  height: 24px;
}
</style>
