/*
 * @Author: diaochan
 * @Date: 2025-04-16 11:06:56
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-16 11:08:37
 * @Description: 
 */
import zh from './zh'
import en from './en'
import tl from './tl'

export const getI18n = () => {
  const locale = localStorage.getItem('locale') || 'zh'
  return locale === 'zh' ? zh : locale === 'en' ? en : tl
}

export default {
  getI18n
}

