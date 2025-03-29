/*
 * @Author: diaochan
 * @Date: 2025-03-29 22:29:04
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-29 23:13:11
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
          window.location.href = joinGroupNotice.content.groupLink
        }
      }).show()
    }
  }
}

export default {
  checkNotification
}