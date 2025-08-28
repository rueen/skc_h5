/*
 * @Author: diaochan
 * @Date: 2025-04-16 11:06:56
 * @LastEditors: rueen
 * @LastEditTime: 2025-08-28 16:00:22
 * @Description: 
 */
import zh from './zh'
import en from './en'
import tl from './tl'
import ja from './ja'

export const getI18n = () => {
  const locale = localStorage.getItem('language');
  return locale === 'zh-CN' ? zh : locale === 'tl-PH' ? tl : locale === 'ja-JP' ? ja : en
}

export default {
  getI18n
}

