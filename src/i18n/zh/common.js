/*
 * @Author: diaochan
 * @Date: 2025-04-11 14:41:16
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-16 16:40:49
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

  cancel: '取消',
  confirm: '确认',
  copySuccess: '复制成功',
  select: '选择',
  inputPlaceholder: '请输入',
  pleaseSelect: '请选择',

  upload: {
    invalidFile: '文件无效',
    uploading: '上传中...', 
    uploadFailed: '上传失败',
    uploadSuccess: '上传成功',
    imageRequired: '请上传图片文件',
    imageSize: '图片大小不能超过',
    uploadFailed: '上传失败',
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