/*
 * @Author: diaochan
 * @Date: 2025-03-29 22:29:04
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-30 17:24:31
 * @Description: 
 */
import { get, put } from '@/utils/request'
import { createPopup } from '@/utils/popup'

const readNotification = async (id) => {
  const res = await put('notification.read', {}, {
    urlParams: {
      id
    }
  })
  return res.code === 0
}

export const checkNotification = async () => {
  try {
    const res = await get('notification.list')
    if(res.code === 0) {
      const notifications = res.data;
      // 入群通知
      const joinGroupNotice = notifications.find(item => item.type === 0);
      if(joinGroupNotice){
      const popup = createPopup({
        title: '入群通知',
        message: `欢迎加入【${joinGroupNotice.content.groupName}】`,
        buttonText: '立即加入',
        onConfirm: async () => {
          popup.destroy()
          await readNotification(joinGroupNotice.id)
          window.open(joinGroupNotice.content.groupLink, '_blank')
        }
      }).show()
      }
    }
  } catch (error) {
    console.error('检查通知失败:', error)
  }
}

export default {
  checkNotification
}