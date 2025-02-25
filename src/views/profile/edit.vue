<!--
 * @Author: diaochan
 * @Date: 2025-02-25 18:25:46
 * @LastEditors: rueen
 * @LastEditTime: 2025-02-25 19:09:39
 * @Description: 
-->
<template>
  <div :class="$style.editPage">
    <van-nav-bar
      title="编辑个人信息"
      left-arrow
      @click-left="onClickLeft"
      :class="$style.navbar"
      fixed
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
.editPage {
  min-height: 100vh;
  background: #f7f8fa;
  padding-top: 46px;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  max-width: 750px;
  margin: 0 auto;

  :global {
    .van-nav-bar {
      background: #fff;
    }

    .van-nav-bar__title {
      color: #323233;
      font-size: 16px;
    }

    .van-nav-bar__arrow {
      color: #323233;
      font-size: 18px;
    }
  }
}
</style> 