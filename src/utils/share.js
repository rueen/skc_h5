/*
 * @Author: rueen
 * @Date: 2025-03-21 14:30:00
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-21 14:30:00
 * @Description: 分享和复制工具方法
 */

import { showToast } from 'vant'

/**
 * 复制文本到剪贴板
 * @param {String} text - 要复制的文本
 * @param {String} successMessage - 复制成功时的提示消息
 * @returns {Promise<boolean>} - 返回复制是否成功
 */
export const copyToClipboard = async (text, successMessage = '复制成功') => {
  try {
    await navigator.clipboard.writeText(text)
    showToast(successMessage)
    return true
  } catch (err) {
    console.error('复制失败:', err)
    showToast('复制失败，请重试')
    return false
  }
}

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
export const shareInviteLink = async (path, inviteCode, params = {}) => {
  const inviteLink = generateInviteLink(path, inviteCode, params)
  return copyToClipboard(inviteLink, '邀请链接已复制到剪贴板')
}

export default {
  copyToClipboard,
  generateInviteLink,
  shareInviteLink
} 