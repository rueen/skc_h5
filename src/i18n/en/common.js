/*
 * @Author: diaochan
 * @Date: 2025-04-11 14:41:16
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-19 08:09:35
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
  pleaseSelect: 'Please select',

  upload: {
    invalidFile: 'Invalid file',
    uploading: 'Uploading...',
    uploadFailed: 'Upload failed',
    uploadSuccess: 'Upload successful',
    imageRequired: 'Please upload an image file',
    imageSize: 'Image size cannot exceed',
    uploadFailed: 'Upload failed',
  },

  notification: {
    joinGroupTitle: 'Join Group Notification',
    joinGroupMessage: 'Welcome to join',
    joinGroupButtonText: 'Join Now',
    accountAuditRejectTitle: 'Account Audit Reject Notification',
    accountAuditRejectMessage: 'Your account audit has been rejected, please resubmit the audit',
    accountAuditRejectButtonText: 'View Now',
  },

  copy: (type) => {
    switch (type) {
      case 'share':
        return {
          success: 'Invitation link copied to clipboard',
          failed: 'Failed to copy invitation link',
        }
      default:
        return {
          success: 'Copy successful',
          failed: 'Copy failed',
        }
    }
  }
} 