<!--
 * @Author: diaochan
 * @Date: 2025-02-25 10:09:01
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-25 11:27:13
 * @Description: 
-->
<template>
  <div class="app-container">
    <router-view />
    <van-tabbar v-if="showTabbar" v-model="active" route>
      <van-tabbar-item to="/" icon="home-o">{{ t('tabbar.home') }}</van-tabbar-item>
      <van-tabbar-item to="/taskApplications" icon="notes-o">{{ t('tabbar.taskApplications') }}</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">{{ t('tabbar.profile') }}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore, useEnumStore } from '@/stores'

const route = useRoute()
const { t } = useI18n()
const active = ref(0)
const userStore = useUserStore()
const enumStore = useEnumStore()

// 计算是否显示底部导航栏
const showTabbar = computed(() => {
  // 在登录页、任务详情页、邀请人列表页、账号列表页、设置页、个人信息编辑页、账号详情页、钱包页、结算账单页、提现记录页、提现账户页、添加账户页、提现页、任务报名页和报名详情页不显示底部导航
  return ![
    'Login',
    'TaskDetail',
    'Invites',
    'Social',
    'Settings',
    'ProfileEdit',
    'SocialDetail',
    'Wallet',
    'WalletBills',
    'WalletRecords',
    'WalletAccounts',
    'WalletAccountsAdd',
    'WalletWithdraw',
    'TaskSubmit',
    'SettingsPassword',
    'Article',
    'Groups'
  ].includes(route.name)
})
// 在应用启动时获取用户信息
onMounted(async () => {
  // 如果有 token，则获取用户信息
  if (userStore.token) {
    await userStore.fetchUserInfo()
  }
  // 加载枚举数据
  await enumStore.fetchEnum()
})
</script>

<style lang="less">
.app-container {
  max-width: 750px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f7f8fa;
}
</style>

<style>
:root {
  --van-image-placeholder-text-color: transparent;
}

/* 统一图片样式 */
.van-image {
  overflow: hidden;
}

.van-image__img {
  object-fit: cover;
}
</style>
