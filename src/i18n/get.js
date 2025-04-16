/*
 * @Author: diaochan
 * @Date: 2025-04-16 11:06:56
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-16 11:24:15
 * @Description: 
 */
import zh from './zh'
import en from './en'
import tl from './tl'

export const getI18n = () => {
  const locale = localStorage.getItem('language') || 'en-US';
  return locale === 'zh-CN' ? zh : locale === 'tl-PH' ? tl : en
}

export default {
  getI18n
}

