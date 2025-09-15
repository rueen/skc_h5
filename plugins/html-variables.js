/*
 * @Author: rueen
 * @Date: 2025-01-20 10:00:00
 * @LastEditors: rueen
 * @LastEditTime: 2025-01-20 10:00:00
 * @Description: HTML变量替换插件
 */

export function htmlVariables(variables = {}) {
  return {
    name: 'html-variables',
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        // 替换HTML中的变量占位符
        let transformedHtml = html
        
        Object.entries(variables).forEach(([key, value]) => {
          const placeholder = `%${key}%`
          transformedHtml = transformedHtml.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value || '')
        })
        
        return transformedHtml
      }
    }
  }
}
