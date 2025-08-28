/*
 * @Author: diaochan
 * @Date: 2025-03-21 18:36:18
 * @LastEditors: rueen
 * @LastEditTime: 2025-08-28 17:44:16
 * @Description: 
 */
import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'
import tl from './tl'
import ja from './ja'

// 获取本地存储的语言设置，如果没有则使用临时默认值
const defaultLocale = localStorage.getItem('language') || 'en-US';

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zh,
    'en-US': en,
    'tl-PH': tl,
    'ja-JP': ja
  }
})

// 导出设置语言的方法
export const setLocale = (locale) => {
  i18n.global.locale.value = locale || 'en-US';
  localStorage.setItem('language', locale)
}

export default i18n 