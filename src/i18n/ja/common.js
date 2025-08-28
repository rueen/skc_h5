/*
 * @Author: diaochan
 * @Date: 2025-04-11 14:41:16
 * @LastEditors: rueen
 * @LastEditTime: 2025-07-21 17:51:23
 * @Description: 
 */
export default {
  tabbar: {
    home: 'ホーム',
    task: 'タスク',
    profile: 'プロフィール'
  },

  emptyText: 'データがありません',
  finishedText: 'これ以上ありません',
  loadingText: '読み込み中...',
  errorText: '読み込みに失敗しました',
  pullingText: '下に引っ張って更新...',
  loosingText: '離して更新...',
  listRrrorText: 'リクエストに失敗しました。クリックして再読み込み',

  cancel: 'キャンセル',
  confirm: '確認',
  copySuccess: 'コピーが完了しました',
  select: '選択',
  inputPlaceholder: '入力してください',
  pleaseSelect: '選択してください',
  inviteFriend: '友達を招待',

  upload: {
    invalidFile: '無効なファイル',
    uploading: 'アップロード中...',
    uploadFailed: 'アップロードに失敗しました',
    uploadSuccess: 'アップロードが完了しました',
    imageRequired: '画像ファイルをアップロードしてください',
    imageSize: '画像サイズが制限を超えています',
    uploadFailed: 'アップロードに失敗しました',
  },

  notification: {
    joinGroupTitle: 'グループ参加通知',
    joinGroupMessage: 'ご参加ありがとうございます',
    joinGroupButtonText: '今すぐ参加',
    accountAuditRejectTitle: 'アカウント審査拒否通知',
    accountAuditRejectMessage: 'アカウント審査が拒否されました。再審査を提出してください',
    accountAuditRejectButtonText: '今すぐ確認',
  },

  messages: {
    buttonText: '読む',
  },

  copy: (type) => {
    switch (type) {
      case 'share':
        return {
          success: '招待リンクがクリップボードにコピーされました',
          failed: '招待リンクのコピーに失敗しました',
        }
      default:
        return {
          success: 'コピーが完了しました',
          failed: 'コピーに失敗しました',
        }
    }
  }
}
