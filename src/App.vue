<!--
 * @Author: diaochan
 * @Date: 2025-02-25 10:09:01
 * @LastEditors: rueen
 * @LastEditTime: 2025-07-21 17:49:15
 * @Description: 
-->
<template>
  <div class="app-container">
    <router-view />
    <van-tabbar v-if="showTabbar" v-model="active" route>
      <van-tabbar-item to="/" icon="home-o">{{ $t('common.tabbar.home') }}</van-tabbar-item>
      <van-tabbar-item to="/taskApplications" icon="notes-o">{{ $t('common.tabbar.task') }}</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">{{ $t('common.tabbar.profile') }}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore, useEnumStore } from '@/stores'
import { checkNotification } from '@/utils/notification'
import { checkMessages } from '@/utils/messages'
import { useRouter } from 'vue-router'
import { get } from '@/utils/request'

const route = useRoute()
const router = useRouter()
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
    'Groups',
    'GroupsMembers',
    'ScrapeFacebook',
    'TaskGroupsDetail'
  ].includes(route.name)
})

// 获取服务器时间差
let serverTimeDiff = 0;
let timeSync = null; // 存储定时器ID

async function initTimeSync() {
  try {
    const res = await get('system.time')

    if (res.code === 0) {
      const serverTime = res.data.timestamp;
      const localTime = Math.floor(Date.now() / 1000);
      
      // 计算本地时间与服务器时间的差值
      serverTimeDiff = serverTime - localTime;
      localStorage.setItem('serverTimeDiff', serverTimeDiff)
    }
  } catch (error) {
    console.error('时间同步失败:', error);
  }
}

// 在应用启动时获取用户信息
onMounted(async () => {
  // 如果有 token，则获取用户信息
  if (userStore.token) {
    await userStore.fetchUserInfo()
    await checkNotification(router)
    await checkMessages()
    // 加载枚举数据
    await enumStore.fetchEnum()
  }
  // 在应用初始化时同步时间
  initTimeSync();
  // 可以定期重新同步，以处理时间偏移
  timeSync = setInterval(initTimeSync, 3600000); // 每小时同步一次
})

// 在组件卸载时清除定时器
onUnmounted(() => {
  if (timeSync) {
    clearInterval(timeSync);
    timeSync = null;
  }
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
