/*
 * @Author: diaochan
 * @Date: 2025-04-11 14:41:16
 * @LastEditors: rueen
 * @LastEditTime: 2025-07-13 10:42:21
 * @Description: 
 */
export default {
  tabbar: {
    home: '首页',
    task: '任务',
    profile: '我的'
  },

  emptyText: '暂无数据',
  finishedText: '没有更多了',
  loadingText: '加载中...',
  errorText: '加载失败',
  pullingText: '下拉即可刷新...',
  loosingText: '释放即可刷新...',
  listRrrorText: '请求失败，点击重新加载',

  cancel: '取消',
  confirm: '确认',
  copySuccess: '复制成功',
  select: '选择',
  inputPlaceholder: '请输入',
  pleaseSelect: '请选择',
  inviteFriend: '邀请好友',

  upload: {
    invalidFile: '文件无效',
    uploading: '上传中...', 
    uploadFailed: '上传失败',
    uploadSuccess: '上传成功',
    imageRequired: '请上传图片文件',
    imageSize: '图片大小不能超过',
    uploadFailed: '上传失败',
  },

  notification: {
    joinGroupTitle: '入群通知',
    joinGroupMessage: '欢迎加入',
    joinGroupButtonText: '立即加入',
    accountAuditRejectTitle: '账号审核拒绝通知',
    accountAuditRejectMessage: '您的账号审核未通过，请重新提交审核',
    accountAuditRejectButtonText: '立即查看',
  },

  copy: (type) => {
    switch (type) {
      case 'share':
        return {
          success: '邀请链接已复制到剪贴板',
          failed: '复制邀请链接失败',
        }
      default:
        return {
          success: '复制成功',
          failed: '复制失败',
        }
    }
  }
}