<!--
 * @Author: diaochan
 * @Date: 2025-02-25 10:09:01
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-16 20:49:03
 * @Description: 
-->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore, useEnumStore } from '@/stores'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const active = ref(0)
const userStore = useUserStore()
const enumStore = useEnumStore()
// 计算是否显示底部导航栏
const showTabbar = computed(() => {
  // 在登录页、任务详情页、邀请人列表页、账号列表页、设置页、个人信息编辑页、账号详情页、钱包页、结算账单页、提现记录页、提现账户页、添加账户页、提现页、任务报名页和报名详情页不显示底部导航
  return !['Login', 'TaskDetail', 'Invites', 'Social', 'Settings', 'ProfileEdit', 'SocialDetail', 'Wallet', 'WalletBills', 'WalletRecords', 'WalletAccounts', 'WalletAccountsAdd', 'WalletWithdraw', 'TaskApply', 'TaskApplyDetail'].includes(route.name)
})

// 在应用启动时获取用户信息
onMounted(async () => {
  // 如果有 token，则获取用户信息
  if (userStore.token) {
    try {
      await userStore.fetchUserInfo()
      await enumStore.fetchEnum()
    } catch (error) {
      showToast(error.message)
      // 如果获取用户信息失败，可能是 token 过期，清除 token 并跳转到登录页
      if (error.code === 401) {
        userStore.clearToken()
        if (route.name !== 'Login') {
          router.push('/login')
        }
      }
    }
  }
})
</script>

<template>
  <div class="app-container">
    <router-view />
    <van-tabbar v-if="showTabbar" v-model="active" route>
      <van-tabbar-item to="/" icon="home-o">{{ t('tabbar.home') }}</van-tabbar-item>
      <van-tabbar-item to="/tasks" icon="notes-o">{{ t('tabbar.tasks') }}</van-tabbar-item>
      <van-tabbar-item to="/groups" icon="friends-o">{{ t('tabbar.groups') }}</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">{{ t('tabbar.profile') }}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

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
