/*
 * @Author: diaochan
 * @Date: 2025-03-09 16:07:50
 * @LastEditors: rueen
 * @LastEditTime: 2025-07-21 18:00:33
 * @Description: API 路径配置
 */
const API_PATH = {
  // 站内信
  messages: {
    list: '/messages',
    read: '/messages/read', // POST
  },
  notification: {
    list: '/notifications',
    read: '/notifications/:id/read', // put
    batchRead: '/notifications/batch-read', // post
  },
  task: {
    list: '/tasks',
    detail: '/tasks/:id',
    // 任务报名
    enroll: '/task-enroll/:taskId',
    // 取消报名
    cancelEnroll: '/task-enroll/:taskId', // DELETE
    // 任务报名列表
    enrolled: '/task-enroll/record',
    // 提交任务 POST
    submit: '/task-submit',
    // 获取已提交任务列表
    submitted: '/task-submit',
    // 获取已提交任务详情
    submittedDetail: '/task-submit/:id',
  },
  taskGroup: {
    detail: '/task-groups/:id',
    relatedTasks: '/task-groups/:id/related-tasks',
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
    findUidByHomeUrl: '/members/accounts/find-uid-by-home-url',
  },
  groups: {
    groups: '/members/groups',
    stats: '/members/groups/stats',
    members: '/members/groups/:groupId/members',
    commissionTasks: '/members/groups/commission-tasks', // 获取为群主带来收益的任务列表
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
  // 支付渠道
  paymentChannels: {
    list: '/payment-channels',
  },
  // 系统相关接口（公共API）
  system: {
    enum: '/enums/:enumType',
    enumAll: '/enums',
    time: '/time/server',
  },
  // 系统配置
  systemConfig: {
    list: '/system-configs',
  },
  // 上传相关接口（公共API）
  upload: {
    image: '/upload/image',
    file: '/upload/file',
  },
  ad: {
    list: '/ads',
  },
  article: {
    byId: '/articles/:id',
    byLocation: '/articles/location/:location',
  },
  scrape: {
    facebook: '/facebook/scrape'
  }
}

export default API_PATH