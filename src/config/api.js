/*
 * @Author: diaochan
 * @Date: 2025-03-09 16:07:50
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-29 23:08:45
 * @Description: API 路径配置
 */
const API_PATH = {
  notification: {
    list: '/notifications',
    read: '/notifications/:id/read',
  },
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
    enrolled: '/task-enroll/record?excludeSubmitted=true', // excludeSubmitted=true 排除已提交任务
    // 提交任务 POST
    submit: '/task-submit',
    // 获取已提交任务列表
    submitted: '/task-submit',
    // 获取已提交任务详情
    submittedDetail: '/task-submit/:id',
  },
  channel: {
    list: '/channels',
  },
  member: {
    update: '/members/profile',
    // 获取余额
    balance: '/members/balance',
    // 结算账单
    bills: '/members/bills',
  },
  invite: {
    stats: '/members/invite/stats',
    list: '/members/invite/friends',
  },
  account: {
    list: '/members/accounts',
    detail: '/members/accounts/:id',
    create: '/members/accounts',
    update: '/members/accounts/:id',
    delete: '/members/accounts/:id',
  },
  groups: {
    groups: '/members/groups',
    stats: '/members/groups/stats',
    members: '/members/groups/:groupId/members',
  },
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    changePassword: '/auth/change-password',
  },
  user: {
    info: '/user/info',
  },
  // 提现账户
  withdrawals: {
    accounts: '/withdrawal/accounts', // 提现账户列表 GET
    create: '/withdrawal/accounts', // 创建提现账户 POST
    update: '/withdrawal/accounts/:id', // 更新提现账户 PUT
    delete: '/withdrawal/accounts/:id', // 删除提现账户 DELETE
    apply: '/withdrawal', // 申请提现 POST
    records: '/withdrawal', // 提现记录列表 GET
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