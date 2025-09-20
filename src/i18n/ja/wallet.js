/*
 * @Author: diaochan
 * @Date: 2025-04-11 16:05:39
 * @LastEditors: rueen
 * @LastEditTime: 2025-09-20 19:16:13
 * @Description: 
 */
export default {

  index: {
    title: 'マイウォレット',
    withdrawableBalance: '残高',
    withdraw: '引き出す',
    settlementBill: '取引明細',
    withdrawalRecords: '引出履歴',
    withdrawalAccount: '引き出し口座',
    notSet: '未設定',

    pleaseSetWithdrawalAccount: 'まず出金アカウントを設定してください',
  },
  
  bills: {
    title: '取引明細',
    daifuFailureReason: '電子ウォレットアカウントを更新してください',
  },

  records: {
    title: '引出履歴',
    withdrawTo: '出金先',
  },

  accounts: {
    addTitle: '引き出し口座を追加',
    editTitle: '引き出し口座を編集',
    edit: '編集',
    cancel: 'キャンセル',
    confirmAdd: '追加を確認',
    saveChanges: '変更を保存',
    previewTitle: '引き出し口座詳細',
    accountType: '電子ウォレットタイプ',
    account: 'アカウント番号',
    accountPlaceholder: 'アカウント番号を入力してください',
    name: '氏名',
    namePlaceholder: '氏名を入力してください',
    confirmAdd: '追加を確認',
    saveChanges: '変更を保存',
    pleaseSelect: '選択してください',
    createSuccess: '作成が完了しました',
    createFailed: '作成に失敗しました',
    updateSuccess: '更新が完了しました',
    updateFailed: '更新に失敗しました',
    pleaseSelectAccountType: 'アカウントタイプを選択してください',
    pleaseEnterAccount: 'アカウント番号を入力してください',
    invalidAccount: '無効なアカウント番号',
    invalidAccountMessage: '0で始まり、その後に9、10桁の数字、例：09888888888',
    pleaseEnterName: '氏名を入力してください',
  },

  withdraw: {
    title: '出金',
    amount: '出金額',
    amountPlaceholder: '出金額を入力してください',
    withdrawThreshold: '出金閾値',
    withdrawableBalance: '出金可能残高',
    withdrawAll: '全額出金',
    confirmWithdraw: '出金を確認',
    withdrawAccount: '引き出し口座',
    notSet: '未設定',

    pleaseSetWithdrawalAccount: 'まず出金アカウントを設定してください',
    pleaseEnterWithdrawalAmount: '出金額を入力してください',
    insufficientBalance: '残高不足',
    withdrawalAmountLessThanThreshold: '出金額は以下より少なくできません',
    withdrawalApplicationSubmitted: '出金申請が提出されました',
  }
}
