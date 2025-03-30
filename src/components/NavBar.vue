<!--
 * @Author: rueen
 * @Date: 2025-04-01 10:00:00
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-30 17:07:55
 * @Description: 导航栏组件，支持智能返回功能
 -->
<template>
  <van-nav-bar
    v-bind="$attrs"
    :left-arrow="leftArrow"
    @click-left="handleClickLeft"
    @click-right="handleClickRight"
  >
    <!-- 正确处理插槽，避免 null 错误 -->
    <template v-if="$slots.left" #left>
      <slot name="left"></slot>
    </template>
    <template v-if="$slots.title" #title>
      <slot name="title"></slot>
    </template>
    <template v-if="$slots.right" #right>
      <slot name="right"></slot>
    </template>
  </van-nav-bar>
</template>

<script setup>
import { computed, useAttrs, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// 定义props，继承van-nav-bar的props
const props = defineProps({
  // 是否显示左侧箭头，这里提供默认值
  leftArrow: {
    type: Boolean,
    default: true
  },
  // 是否始终返回首页
  alwaysGoHome: {
    type: Boolean,
    default: false
  },
  // 返回按钮的回调，如果提供则不会执行默认的返回行为
  onBack: {
    type: Function,
    default: null
  },
  // 左侧按钮点击回调，如果提供则会覆盖默认的返回行为
  onClickLeft: {
    type: Function,
    default: null
  },
  // 右侧按钮点击回调
  onClickRight: {
    type: Function,
    default: null
  }
})

// 获取router实例
const router = useRouter()

// 获取组件上的所有属性
const attrs = useAttrs()

// 记录是否有上一页历史记录
const hasHistory = ref(false)

// 在组件挂载时检查历史记录
onMounted(() => {
  // 一种简单的检查历史记录的方法
  // window.history.length > 1 表示有上一页
  hasHistory.value = window.history.length > 1
})

// 处理左侧按钮点击事件
const handleClickLeft = (event) => {
  
  // 如果提供了onClickLeft回调，则优先执行它并返回
  if (props.onClickLeft) {
    props.onClickLeft(event)
    return
  }
  
  // 如果提供了onBack回调，则执行它并返回
  if (props.onBack) {
    props.onBack()
    return
  }
  
  // 智能返回逻辑
  if (props.alwaysGoHome) {
    // 如果设置了始终返回首页，直接跳转到首页
    router.push('/')
  } else {
    // 尝试获取上一页路由信息
    const prevRoute = router.currentRoute.value?.redirectedFrom || 
                      (window.history.state && window.history.state.back)

    // 判断是否有上一页，或者上一页是否为登录页
    if (!hasHistory.value || 
        (prevRoute && typeof prevRoute === 'string' && prevRoute.includes('/login'))) {
      // 如果没有上一页，或者上一页是登录页，则跳转到首页
      router.push('/')
    } else {
      // 否则正常返回上一页
      router.back()
    }
  }
}

// 处理右侧按钮点击事件
const handleClickRight = (event) => {
  // 如果提供了onClickRight回调，则执行它
  if (props.onClickRight) {
    props.onClickRight(event)
  }
}
</script>

<style scoped>
/* 如需自定义样式，可以在这里添加 */
</style> 