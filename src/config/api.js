/*
 * @Author: diaochan
 * @Date: 2025-03-09 16:07:50
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-17 21:27:03
 * @Description: API 路径配置
 */
const API_PATH = {
  task: {
    list: '/tasks',
  },
  channel: {
    list: '/channels',
  },
  member: {
    update: '/members/profile',
  },
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    changePassword: '/auth/change-password',
  },
  user: {
    info: '/user/info',
  },
  // 系统相关接口（公共API）
  system: {
    enum: '/enums/:enumType',
    enumAll: '/enums',
  },
  // 上传相关接口（公共API）
  upload: {
    image: '/upload/image',
    file: '/upload/file',
  },
}

export default API_PATH