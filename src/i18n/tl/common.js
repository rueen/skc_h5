/*
 * @Author: diaochan
 * @Date: 2025-04-11 14:41:16
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-19 11:17:58
 * @Description: 
 */
export default {
  tabbar: {
    home: 'Tahanan',
    task: 'Mga Gawain',
    profile: 'Profile'
  },

  emptyText: 'Walang Data',
  finishedText: 'Wala nang Karagdagan',
  loadingText: 'Nagloading...',
  errorText: 'Nagload na nawala',
  pullingText: 'Pull to refresh...',
  loosingText: 'Release to refresh...',

  cancel: 'Kanselahin',
  confirm: 'Kumpirmahin',
  copySuccess: 'Kopyahin na matagumpay',
  select: 'Pumili',
  inputPlaceholder: 'Maglagay ng',
  pleaseSelect: 'Pumili',

  upload: {
    invalidFile: 'Diwalidong file',
    uploading: 'Kumopyahin...',
    uploadFailed: 'Kumopyahin na nawala', 
    uploadSuccess: 'Kumopyahin na matagumpay',
    imageRequired: 'Maglagay ng imahe',
    imageSize: 'Di mas malaki kaysa',
    uploadFailed: 'Kumopyahin na nawala',
  },

  notification: {
    joinGroupTitle: 'Pag-join sa Grupo',
    joinGroupMessage: 'Maligayang pag-join',
    joinGroupButtonText: 'Mag-join Ngayon',
    accountAuditRejectTitle: 'Pagkabigo sa Pag-audit ng Account',
    accountAuditRejectMessage: 'Hindi nawala ang iyong pag-audit ng account, mangyaring i-resubmit ang audit',
    accountAuditRejectButtonText: 'Mag-view Ngayon',
  },

  copy: (type) => {
    switch (type) {
      case 'share':
        return {
          success: 'Nakopya na ang link ng imbitasyon sa clipboard',
          failed: 'Hindi mabigay ang link ng imbitasyon sa clipboard',
        }
      default:
        return {
          success: 'Kopyahin na matagumpay',
          failed: 'Kopyahin na nawala',
        }
    }
  }
} 