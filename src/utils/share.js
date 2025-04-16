/*
 * @Author: rueen
 * @Date: 2025-03-21 14:30:00
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-16 11:16:36
 * @Description: 分享和复制工具方法
 */
import { copyToClipboard } from './copyToClipboard'
/**
 * 生成带有邀请码的链接
 * @param {String} path - 页面路径
 * @param {String} inviteCode - 邀请码
 * @param {Object} params - 其他参数
 * @returns {String} - 返回生成的链接
 */
export const generateInviteLink = (path, inviteCode, params = {}) => {
  const urlObj = new URL(window.location.origin + path)
  
  // 添加邀请码参数
  if (inviteCode) {
    urlObj.searchParams.set('inviteCode', inviteCode)
  }
  
  // 添加其他参数
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      urlObj.searchParams.set(key, params[key])
    }
  })
  
  return urlObj.toString()
}

/**
 * 分享带有邀请码的链接
 * @param {String} path - 页面路径
 * @param {String} inviteCode - 邀请码
 * @param {Object} params - 其他参数
 * @returns {Promise<boolean>} - 返回分享是否成功
 */
export const shareInviteLink = async (path, inviteCode, params = {}, successMessage, failMessage) => {
  const inviteLink = generateInviteLink(path, inviteCode, params)
  return copyToClipboard(inviteLink, 'share')
}

export default {
  shareInviteLink
} 