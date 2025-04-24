/*
 * @Author: diaochan
 * @Date: 2025-02-25 10:09:01
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-24 13:43:03
 * @Description: 
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      // 特别注意：如果后端API已经包含/api前缀，则不要重写路径
      '/api': {
        target: 'http://api.skcpop.com',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // 移除重写规则，保留/api前缀
      }
    },
    cors: true
  }
})
