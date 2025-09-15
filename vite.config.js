/*
 * @Author: diaochan
 * @Date: 2025-02-25 10:09:01
 * @LastEditors: rueen
 * @LastEditTime: 2025-09-15 19:13:52
 * @Description: 
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import sitesConfig from './config/sites.js'
import { htmlVariables } from './plugins/html-variables.js'

// 获取站点配置
const getSiteConfig = () => {
  const site = process.env.VITE_SITE || 'Local'
  const config = sitesConfig[site]
  
  if (!config) {
    throw new Error(`Site configuration not found for: ${site}`)
  }
  
  return { site, ...config }
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const siteConfig = getSiteConfig()
  
  return {
    plugins: [
      vue(),
      htmlVariables({
        VITE_FAVICON_PATH: siteConfig.faviconPath,
        VITE_APP_TITLE: siteConfig.title,
        VITE_APP_DESCRIPTION: siteConfig.description
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    define: {
      // 将站点配置注入到环境变量中
      __SITE_CONFIG__: JSON.stringify(siteConfig)
    },
    server: {
      port: 5173,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: siteConfig.baseUrl,
          changeOrigin: true,
          secure: siteConfig.baseUrl.startsWith('https'),
        }
      },
      cors: {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
      }
    },
    build: {
      outDir: `dist/${siteConfig.site.toLowerCase()}`
    }
  }
})
