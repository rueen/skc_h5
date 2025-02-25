<!--
 * @Author: diaochan
 * @Date: 2025-02-25 10:09:01
 * @LastEditors: rueen
 * @LastEditTime: 2025-02-25 10:32:53
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
  return route.path !== '/login'
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
