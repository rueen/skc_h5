/*
 * @Author: diaochan
 * @Date: 2025-03-09 16:07:50
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-16 19:19:36
 * @Description: API 路径配置
 */
const API_PATH = {
  task: {
    list: '/tasks',
  },
  channel: {
    list: '/channels',
  },
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
  },
  user: {
    info: '/user/info',
  },
  // 系统相关接口（公共API）
  system: {
    enum: '/enums/:enumType',
  },
  // 上传相关接口（公共API）
  upload: {
    image: '/upload/image',
    file: '/upload/file',
  },
}

export default API_PATH