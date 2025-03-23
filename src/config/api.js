/*
 * @Author: diaochan
 * @Date: 2025-03-09 16:07:50
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-23 15:55:46
 * @Description: API 路径配置
 */
const API_PATH = {
  task: {
    list: '/tasks',
    detail: '/tasks/:id',
    // 任务报名
    enroll: '/task-enroll/:taskId',
    // 取消报名
    cancelEnroll: '/task-enroll/:taskId', // DELETE
    // 检查是否已报名
    checkEnroll: '/task-enroll/:taskId/check',
    // 任务报名列表
    enrolled: '/enrolled-tasks',
    // 提交任务 POST
    submit: '/task-submit',
  },
  channel: {
    list: '/channels',
  },
  member: {
    update: '/members/profile',
  },
  account: {
    list: '/members/accounts',
    detail: '/members/accounts/:id',
    create: '/members/accounts',
    update: '/members/accounts/:id',
    delete: '/members/accounts/:id',
  },
  groups: {
    list: '/members/owned-groups',
    members: '/members/group-members',
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
  article: {
    byId: '/articles/:id',
    byLocation: '/articles/location/:location',
  },
}

export default API_PATH