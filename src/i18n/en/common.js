/*
 * @Author: diaochan
 * @Date: 2025-04-11 14:41:16
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-16 11:13:23
 * @Description: 
 */
export default {
  tabbar: {
    home: 'Home',
    task: 'Tasks',
    profile: 'Profile'
  },

  emptyText: 'No Data',
  finishedText: 'No More',

  cancel: 'Cancel',
  confirm: 'Confirm',
  copySuccess: 'Copy successful',
  select: 'Select',
  inputPlaceholder: 'Please fill up',

  upload: {
    invalidFile: 'Invalid file',
    uploading: 'Uploading...',
    uploadFailed: 'Upload failed',
    uploadSuccess: 'Upload successful',
    imageRequired: 'Please upload an image file',
    imageSize: 'Image size cannot exceed',
    uploadFailed: 'Upload failed',
  },

  copy: (type) => {
    switch (type) {
      case 'share':
        return {
          shareSuccess: 'Invitation link copied to clipboard',
          shareFailed: 'Failed to copy invitation link',
        }
      default:
        return {
          success: 'Copy successful',
          failed: 'Copy failed',
        }
    }
  }
} 