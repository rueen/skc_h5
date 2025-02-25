<!--
 * @Author: diaochan
 * @Date: 2025-02-25 10:09:01
 * @LastEditors: rueen
 * @LastEditTime: 2025-02-25 19:22:54
 * @Description: 
-->
<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Tabbar, TabbarItem } from 'vant'

const route = useRoute()
const { t } = useI18n()
const active = ref(0)

// 计算是否显示底部导航栏
const showTabbar = computed(() => {
  // 在登录页、任务详情页、邀请人列表页、名片列表页、设置页、个人信息编辑页、名片详情页、钱包页、结算账单页、提现记录页、提现账户页和添加账户页不显示底部导航
  return !['Login', 'TaskDetail', 'Invites', 'Social', 'Settings', 'ProfileEdit', 'SocialDetail', 'Wallet', 'WalletBills', 'WalletRecords', 'WalletAccounts', 'WalletAccountsAdd'].includes(route.name)
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
