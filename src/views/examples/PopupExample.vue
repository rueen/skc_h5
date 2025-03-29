<!--
 * @Author: rueen
 * @Date: 2025-03-31 10:30:00
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-31 10:30:00
 * @Description: 弹窗示例
 -->
<template>
  <div class="popup-example">
    <van-nav-bar
      title="弹窗示例"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    
    <div class="container">
      <h3>基本用法</h3>
      <div class="button-group">
        <van-button type="primary" @click="showBasicPopup">基础弹窗</van-button>
        <van-button type="primary" @click="showWithTitle">带标题弹窗</van-button>
        <van-button type="primary" @click="showCustomButton">自定义按钮文字</van-button>
      </div>
      
      <h3>回调函数</h3>
      <div class="button-group">
        <van-button type="success" @click="showWithCallback">带回调弹窗</van-button>
        <van-button type="success" @click="showWithPromise">Promise方式</van-button>
      </div>
      
      <h3>组件方式</h3>
      <div class="button-group">
        <van-button type="warning" @click="showComponentPopup">组件方式</van-button>
      </div>
      
      <!-- 组件方式使用弹窗 -->
      <popup
        v-model:visible="popupVisible"
        title="组件方式弹窗"
        message="这是使用组件方式显示的弹窗"
        button-text="我明白了"
        @confirm="handleConfirm"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import Popup from '@/components/Popup.vue'
import { 
  createPopup, 
  showPopup, 
  showPopupPromise 
} from '@/utils/popup'

const router = useRouter()
const $popup = inject('$popup')

// 控制组件方式弹窗显示
const popupVisible = ref(false)

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 基础弹窗
const showBasicPopup = () => {
  showPopup('这是一个基础弹窗')
}

// 带标题弹窗
const showWithTitle = () => {
  showPopup('这是一个带标题的弹窗', '弹窗标题')
}

// 自定义按钮文字
const showCustomButton = () => {
  showPopup('您的操作已完成', '操作结果', {
    buttonText: '确定'
  })
}

// 带回调函数的弹窗
const showWithCallback = () => {
  const popup = createPopup({
    title: '确认操作',
    message: '点击按钮将触发回调函数',
    buttonText: '执行操作',
    onConfirm: () => {
      showToast('回调函数已执行')
      popup.destroy()
    }
  }).show()
}

// Promise 方式
const showWithPromise = async () => {
  const result = await showPopupPromise(
    '点击按钮将触发 Promise 解析',
    '异步操作',
    { buttonText: '完成' }
  )
  
  if (result) {
    showToast('Promise 已解析')
  }
}

// 组件方式
const showComponentPopup = () => {
  popupVisible.value = true
}

// 组件确认回调
const handleConfirm = () => {
  showToast('组件确认按钮点击')
}
</script>

<style lang="less" scoped>
.popup-example {
  padding-top: 46px;
}

.container {
  padding: 16px;
}

h3 {
  margin: 24px 0 16px;
  font-size: 16px;
  font-weight: 500;
  color: #323233;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}
</style> 