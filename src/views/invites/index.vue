<!--
 * @Author: diaochan
 * @Date: 2025-02-25 15:00:45
 * @LastEditors: rueen
 * @LastEditTime: 2025-02-25 15:00:45
 * @Description: 我的邀请人列表页
 -->
<template>
  <div :class="$style.invitesPage">
    <!-- 顶部导航 -->
    <van-nav-bar
      title="我的邀请人"
      left-arrow
      @click-left="onClickLeft"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const onClickLeft = () => {
  router.back()
}
</script>

<style lang="less" module>
.invitesPage {
  min-height: 100vh;
  background: #f7f8fa;
}
</style> 