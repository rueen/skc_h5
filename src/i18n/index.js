/*
 * @Author: diaochan
 * @Date: 2025-03-21 18:36:18
 * @LastEditors: rueen
 * @LastEditTime: 2025-08-28 16:00:30
 * @Description: 
 */
import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'
import tl from './tl'
import ja from './ja'

// 获取本地存储的语言设置
const defaultLocale = localStorage.getItem('language');

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zh,
    'en-US': en,
    'tl-PH': tl,
    'ja-JP': ja
  }
})

export default i18n 