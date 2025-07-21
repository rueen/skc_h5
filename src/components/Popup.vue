<!--
 * @Author: rueen
 * @Date: 2025-03-31 10:00:00
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-30 09:30:17
 * @Description: 简易弹窗组件
 -->
<template>
  <teleport to="body">
    <transition name="popup-fade">
      <div class="popup" v-if="visible">
        <div class="popup-mask" @click="onMaskClick"></div>
        <div class="popup-container">
          <div class="popup-content">
            <div class="popup-title" v-if="title">{{ title }}</div>
            <div class="popup-message-wrapper">
              <div 
                class="popup-message" 
                v-if="isHtml"
                v-html="message"
              ></div>
              <div 
                class="popup-message" 
                v-else
              >{{ message }}</div>
            </div>
          </div>
          <div class="popup-footer">
            <button 
              class="popup-button" 
              :class="{ 'popup-button-disabled': isCountdownActive }"
              :disabled="isCountdownActive"
              @click="onConfirm"
            >
              {{ buttonText }}
              <span v-if="countdown > 0" class="popup-countdown">({{ countdown }}s)</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  buttonText: {
    type: String,
    default: '我知道了'
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  /**
   * 是否将 message 渲染为 HTML
   */
  isHtml: {
    type: Boolean,
    default: false
  },
  /**
   * 倒计时时间（秒），0 表示不倒计时
   */
  countdownTime: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:visible', 'confirm'])

// 倒计时相关
const countdown = ref(0)
const countdownTimer = ref(null)

/**
 * 倒计时是否激活
 */
const isCountdownActive = computed(() => countdown.value > 0)

/**
 * 开始倒计时
 */
const startCountdown = () => {
  if (props.countdownTime > 0) {
    countdown.value = props.countdownTime
    countdownTimer.value = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownTimer.value)
        countdownTimer.value = null
      }
    }, 1000)
  }
}

/**
 * 停止倒计时
 */
const stopCountdown = () => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
    countdownTimer.value = null
  }
  countdown.value = 0
}

// 监听弹窗可见性变化
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    startCountdown()
  } else {
    stopCountdown()
  }
})

// 组件销毁时清理定时器
onUnmounted(() => {
  stopCountdown()
})

// 点击遮罩层关闭
const onMaskClick = () => {
  if (props.maskClosable) {
    close()
  }
}

// 点击确认按钮
const onConfirm = () => {
  if (isCountdownActive.value) {
    return // 倒计时期间不允许点击
  }
  emit('confirm')
  close()
}

// 关闭弹窗
const close = () => {
  stopCountdown()
  emit('update:visible', false)
}
</script>

<style scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-container {
  position: relative;
  background-color: #fff;
  border-radius: 8px;
  width: 80%;
  max-width: 320px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  animation: bounceIn 0.3s;
}

.popup-content {
  padding: 20px;
}

.popup-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
  text-align: center;
}

.popup-message-wrapper {
  max-height: 60vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.popup-message {
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  text-align: center;
  word-wrap: break-word;
  
  /* HTML 内容样式优化 */
  :deep(p) {
    margin: 0 0 1em 0;
  }
  
  :deep(p:last-child) {
    margin-bottom: 0;
  }
  
  :deep(br) {
    line-height: 1.5;
  }
}

.popup-footer {
  border-top: 1px solid #eee;
}

.popup-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  color: #007aff;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.popup-button:active:not(.popup-button-disabled) {
  background-color: #f2f2f2;
}

.popup-button-disabled {
  color: #c8c9cc;
  cursor: not-allowed;
  background-color: #f8f8f8;
}

.popup-countdown {
  font-size: 14px;
  color: inherit;
  opacity: 0.8;
}

.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.3s ease;
}

.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  70% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}
</style> 