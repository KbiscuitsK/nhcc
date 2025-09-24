// vite.config.js (Vue3 + Vite项目)
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 配置代理规则
      '^/(user|bloodglucose|bloodpressure|heartrate)': {
        target: 'http://localhost:8080/', // 后端服务地址
        changeOrigin: true, // 开启跨域
      },

    }
  }
})
