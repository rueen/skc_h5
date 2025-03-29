/*
 * @Author: rueen
 * @Date: 2025-03-31 10:20:00
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-31 10:20:00
 * @Description: 弹窗插件
 */

import { createPopup, showPopup, showPopupPromise } from '@/utils/popup'

const PopupPlugin = {
  install(app) {
    // 全局方法
    app.config.globalProperties.$popup = {
      create: createPopup,
      show: showPopup,
      showPromise: showPopupPromise
    }
    
    // 依赖注入
    app.provide('$popup', {
      create: createPopup,
      show: showPopup,
      showPromise: showPopupPromise
    })
  }
}

export default PopupPlugin 