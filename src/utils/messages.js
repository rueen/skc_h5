/*
 * @Author: diaochan
 * @Date: 2025-07-21 17:36:16
 * @LastEditors: rueen
 * @LastEditTime: 2025-07-21 18:34:40
 * @Description: 
 */
import { get, post } from '@/utils/request'
import { createPopup } from '@/utils/popup'
import { getI18n } from '@/i18n/get'
import { convertToHtml } from '@/utils/util'

const { common: { messages } } = getI18n()

const readMessages = async (id) => {
  const res = await post('messages.read', {
    messageId: id
  })
  return res.code === 0
}

/**
 * 显示单条消息弹窗
 * @param {Object} message - 消息对象
 * @param {Array} remainingMessages - 剩余待显示的消息列表
 * @returns {Promise} - 返回Promise以支持链式调用
 */
const showMessagePopup = (message, remainingMessages = []) => {
  return new Promise((resolve) => {
    const popup = createPopup({
      title: message.title,
      message: `<div style="text-align: left;">${convertToHtml(message.content)}</div>`,
      buttonText: messages.buttonText,
      isHtml: true,
      countdownTime: 5,
      onConfirm: async () => {
        popup.destroy()
        
        // 标记当前消息为已读
        await readMessages(message.id)
        
        // 继续显示下一条消息
        if (remainingMessages.length > 0) {
          const nextMessage = remainingMessages[0]
          const nextRemainingMessages = remainingMessages.slice(1)
          await showMessagePopup(nextMessage, nextRemainingMessages)
        }
        
        resolve()
      }
    }).show()
  })
}

/**
 * 检查并逐条显示站内信
 */
export const checkMessages = async () => {
  try {
    const res = await get('messages.list')
    if(res.code === 0) {
      const messageList = res.data || [];
      
      if (messageList.length > 0) {
        // 开始逐条显示消息
        const firstMessage = messageList[0]
        const remainingMessages = messageList.slice(1)
        await showMessagePopup(firstMessage, remainingMessages)
      }
    }
  } catch (error) {
    console.error('检查站内信失败:', error)
  }
}

export default {
  checkMessages
}