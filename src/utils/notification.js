/*
 * @Author: diaochan
 * @Date: 2025-03-29 22:29:04
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-19 08:07:22
 * @Description: 
 */
import { get, post } from '@/utils/request'
import { createPopup } from '@/utils/popup'
import { getI18n } from '@/i18n/get'

const { common: { notification } } = getI18n()

const readNotification = async (ids) => {
  const res = await post('notification.batchRead', {
    ids
  })
  return res.code === 0
}

export const checkNotification = async (router) => {
  try {
    const res = await get('notification.list')
    if(res.code === 0) {
      const notifications = res.data;
      // 入群通知
      const joinGroupNotice = notifications.find(item => item.type === 0);
      // 账号审核拒绝通知
      const accountAuditRejectNotice = notifications.filter(item => item.type === 1);
      if(joinGroupNotice){
        const popup = createPopup({
          title: notification.joinGroupTitle,
          message: `${notification.joinGroupMessage}【${joinGroupNotice.content.groupName}】`,
          buttonText: notification.joinGroupButtonText,
          onConfirm: async () => {
            popup.destroy()
            await readNotification([joinGroupNotice.id])
            window.open(joinGroupNotice.content.groupLink, '_blank')
          }
        }).show()
      }
      if(accountAuditRejectNotice.length > 0){
        const popup = createPopup({
          title: notification.accountAuditRejectTitle,
          message: notification.accountAuditRejectMessage,
          buttonText: notification.accountAuditRejectButtonText,
          onConfirm: async () => {
            popup.destroy()
            await readNotification(accountAuditRejectNotice.map(item => item.id))
            router.push('/social')
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