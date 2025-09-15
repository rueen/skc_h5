/*
 * @Author: rueen  
 * @Date: 2025-01-20 10:00:00
 * @LastEditors: rueen
 * @LastEditTime: 2025-09-15 19:05:57
 * @Description: 多站点配置文件
 */

export default {
  Local: {
    baseUrl: 'http://localhost:3001',
    apiSignSecret: '81fe9c1f0a2d564bf827eb5ca3f3ed7b46592b7dc40b9a47fd3cb8fbf5308e9a',
    faviconPath: '/vite.svg',
    title: 'SKC Local',
    description: 'SKC 本地开发环境'
  },
  Malaysia: {
    baseUrl: 'http://api.skcpop.com',
    apiSignSecret: '81fe9c1f0a2d564bf827eb5ca3f3ed7b46592b7dc40b9a47fd3cb8fbf5308e9a',
    faviconPath: '/vite.svg',
    title: 'SKC Malaysia',
    description: 'SKC Malaysia - Quick, Easy & Legit Earnings'
  },
  Japan: {
    baseUrl: 'https://api.jpskc.com',
    apiSignSecret: '4eUFufSZIlBEFSUynMcHVQGT2TpcNHjWb+C+ebZhPEQ=',
    faviconPath: '/favicon-japan.ico',
    title: 'SKC Japan',
    description: 'SKC Japan - クイック、簡単、合法的な収益'
  }
}
