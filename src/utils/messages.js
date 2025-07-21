/*
 * @Author: diaochan
 * @Date: 2025-07-21 17:36:16
 * @LastEditors: rueen
 * @LastEditTime: 2025-07-21 17:59:52
 * @Description: 
 */
import { h } from 'vue'
import { get, post } from '@/utils/request'
import { createPopup } from '@/utils/popup'
import { getI18n } from '@/i18n/get'

const { common: { messages } } = getI18n()

const readMessages = async (id) => {
  const res = await post('messages.read', {
    messageId: id
  })
  return res.code === 0
}

export const checkMessages = async () => {
  try {
    const res = await get('messages.list')
    if(res.code === 0) {
      const messageList = res.data || [];
      const message = messageList[0];
      if(message) {
        const popup = createPopup({
          title: message.title,
          message: message.content,
          buttonText: messages.buttonText,
          onConfirm: async () => {
            popup.destroy()
            await readMessages(message.id)
          }
        }).show()
      }
    }
  } catch (error) {
    console.error('检查站内信失败:', error)
  }
}

export default {
  checkMessages
}