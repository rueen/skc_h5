<!--
 * @Author: diaochan
 * @Date: 2025-03-17 20:04:30
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-17 21:07:09
 * @Description: 
-->
<template>
  <div :class="$style.avatar" :style="{ width: width, height: height, borderRadius: round ? '50%' : '0' }">
    <van-image :src="avatar" :width="width" :height="height" :round="round" v-if="avatar" />
    <van-icon name="contact-o" :class="$style.avatarIcon" :style="{ fontSize: fontSize }" v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  avatar: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '40px'
  },
  height: {
    type: String,
    default: '40px'
  },
  round: {
    type: Boolean,
    default: false
  }
})

const fontSize = computed(() => {
  return props.width.replace('px', '') * 0.6 + 'px'
})
</script>

<style lang="less" module>
.avatar {
  background-color: #f1f1f1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatarIcon{
  color: #999;
}
</style>
