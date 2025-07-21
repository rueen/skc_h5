/*
 * @Author: rueen
 * @Date: 2025-03-31 10:10:00
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-31 10:10:00
 * @Description: 弹窗工具方法
 */

import { createApp, h, ref } from 'vue'
import Popup from '@/components/Popup.vue'

/**
 * 创建弹窗实例
 * @param {Object} options - 配置项
 * @param {string} options.title - 弹窗标题
 * @param {string} options.message - 弹窗消息内容
 * @param {string} options.buttonText - 按钮文本
 * @param {boolean} options.maskClosable - 是否允许点击遮罩关闭
 * @param {boolean} options.isHtml - 是否将消息内容渲染为HTML
 * @param {number} options.countdownTime - 倒计时时间（秒），0表示不倒计时
 * @param {function} options.onConfirm - 确认回调函数
 * @returns {Object} - 弹窗控制对象
 */
export const createPopup = (options = {}) => {
  // 创建容器元素
  const container = document.createElement('div')
  document.body.appendChild(container)
  
  // 控制弹窗可见性
  const visible = ref(false)
  
  // 创建弹窗应用实例
  const app = createApp({
    setup() {
      // 确认按钮回调
      const handleConfirm = () => {
        if (typeof options.onConfirm === 'function') {
          options.onConfirm()
        }
      }
      
      return () => h(Popup, {
        visible: visible.value,
        'onUpdate:visible': (value) => {
          visible.value = value
        },
        title: options.title || '',
        message: options.message || '',
        buttonText: options.buttonText || '我知道了',
        maskClosable: options.maskClosable !== false,
        isHtml: options.isHtml || false,
        countdownTime: options.countdownTime || 0,
        onConfirm: handleConfirm
      })
    }
  })
  
  // 挂载到容器
  app.mount(container)
  
  // 返回控制对象
  return {
    // 显示弹窗
    show() {
      visible.value = true
      return this
    },
    
    // 隐藏弹窗
    hide() {
      visible.value = false
      return this
    },
    
    // 销毁弹窗
    destroy() {
      visible.value = false
      
      // 等待过渡效果完成后销毁
      setTimeout(() => {
        app.unmount()
        document.body.removeChild(container)
      }, 300)
    }
  }
}

/**
 * 显示弹窗
 * @param {String} message - 消息内容
 * @param {String} title - 标题
 * @param {Object} options - 其他配置
 * @param {boolean} options.isHtml - 是否将消息内容渲染为HTML
 * @param {number} options.countdownTime - 倒计时时间（秒）
 * @returns {Object} - 弹窗控制对象
 */
export const showPopup = (message, title = '', options = {}) => {
  return createPopup({
    title,
    message,
    ...options
  }).show()
}

/**
 * 显示弹窗，返回Promise
 * @param {String} message - 消息内容
 * @param {String} title - 标题
 * @param {Object} options - 其他配置
 * @param {boolean} options.isHtml - 是否将消息内容渲染为HTML
 * @param {number} options.countdownTime - 倒计时时间（秒）
 * @returns {Promise} - Promise对象
 */
export const showPopupPromise = (message, title = '', options = {}) => {
  return new Promise((resolve) => {
    const popup = createPopup({
      title,
      message,
      onConfirm: () => {
        resolve(true)
        popup.destroy()
      },
      ...options
    }).show()
  })
}

export default {
  createPopup,
  showPopup,
  showPopupPromise
} 