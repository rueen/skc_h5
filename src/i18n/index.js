/*
 * @Author: diaochan
 * @Date: 2025-03-21 18:36:18
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-11 18:55:58
 * @Description: 
 */
import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'
import tl from './tl'

// 获取本地存储的语言设置，默认中文
const defaultLocale = localStorage.getItem('language') || 'zh-CN'

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zh,
    'en-US': en,
    'tl-PH': tl
  }
})

export default i18n 