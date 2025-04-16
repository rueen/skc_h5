/*
 * @Author: diaochan
 * @Date: 2025-04-11 14:41:16
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-16 11:25:17
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

  cancel: 'Kanselahin',
  confirm: 'Kumpirmahin',
  copySuccess: 'Kopyahin na matagumpay',
  select: 'Pumili',
  inputPlaceholder: 'Maglagay ng',

  upload: {
    invalidFile: 'Diwalidong file',
    uploading: 'Kumopyahin...',
    uploadFailed: 'Kumopyahin na nawala', 
    uploadSuccess: 'Kumopyahin na matagumpay',
    imageRequired: 'Maglagay ng imahe',
    imageSize: 'Di mas malaki kaysa',
    uploadFailed: 'Kumopyahin na nawala',
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