import { createI18n } from 'vue-i18n'

// 中文语言包
const zh = {
  common: {
    cancel: '取消'
  },
  login: {
    title: 'SKC 种草',
    subtitle: '分享你的种草清单',
    phoneLogin: '手机号登录',
    emailLogin: '邮箱登录',
    phone: '手机号',
    email: '邮箱',
    code: '验证码',
    getCode: '获取验证码',
    phonePlaceholder: '请输入手机号',
    emailPlaceholder: '请输入邮箱',
    codePlaceholder: '请输入验证码',
    agreement: '我已阅读并同意',
    userAgreement: '《用户协议》',
    and: '和',
    privacyPolicy: '《隐私政策》',
    login: '登录',
    phoneRequired: '请输入手机号',
    emailRequired: '请输入邮箱',
    codeRequired: '请输入验证码',
    agreementRequired: '请同意用户协议和隐私政策'
  },
  tabbar: {
    home: '首页',
    tasks: '任务',
    groups: '小组',
    profile: '我的'
  },
  home: {
    all: '全部',
    loadingText: '加载中...',
    finishedText: '没有更多了',
    pullText: '下拉刷新',
    loosingText: '释放刷新',
    loadingText: '加载中...'
  },
  tasks: {
    enrolled: '已报名',
    published: '已发布',
    completed: '已完成',
    finishedText: '没有更多了',
    loadingText: '加载中...',
    pullText: '下拉刷新',
    loosingText: '释放刷新'
  },
  settings: {
    language: '语言设置',
    selectLanguage: '选择语言',
    logout: '退出登录',
    logoutConfirm: '确认退出',
    logoutMessage: '确定要退出登录吗？'
  }
}

// 英文语言包
const en = {
  common: {
    cancel: 'Cancel'
  },
  login: {
    title: 'SKC List',
    subtitle: 'Share Your Shopping List',
    phoneLogin: 'Phone Login',
    emailLogin: 'Email Login',
    phone: 'Phone',
    email: 'Email',
    code: 'Code',
    getCode: 'Get Code',
    phonePlaceholder: 'Enter phone number',
    emailPlaceholder: 'Enter email address',
    codePlaceholder: 'Enter verification code',
    agreement: 'I have read and agree to',
    userAgreement: 'User Agreement',
    and: 'and',
    privacyPolicy: 'Privacy Policy',
    login: 'Login',
    phoneRequired: 'Phone number is required',
    emailRequired: 'Email is required',
    codeRequired: 'Verification code is required',
    agreementRequired: 'Please agree to the user agreement and privacy policy'
  },
  tabbar: {
    home: 'Home',
    tasks: 'Tasks',
    groups: 'Groups',
    profile: 'Profile'
  },
  home: {
    all: 'All',
    loadingText: 'Loading...',
    finishedText: 'No more data',
    pullText: 'Pull to refresh',
    loosingText: 'Release to refresh',
    loadingText: 'Loading...'
  },
  tasks: {
    enrolled: 'Enrolled',
    published: 'Published',
    completed: 'Completed',
    finishedText: 'No more data',
    loadingText: 'Loading...',
    pullText: 'Pull to refresh',
    loosingText: 'Release to refresh'
  },
  settings: {
    language: 'Language Settings',
    selectLanguage: 'Select Language',
    logout: 'Logout',
    logoutConfirm: 'Confirm Logout',
    logoutMessage: 'Are you sure you want to logout?'
  }
}

// 创建i18n实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: localStorage.getItem('language') || 'zh', // 从本地存储读取默认语言
  messages: {
    zh,
    en
  }
})

export default i18n 