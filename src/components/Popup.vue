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
            <div class="popup-message">{{ message }}</div>
          </div>
          <div class="popup-footer">
            <button class="popup-button" @click="onConfirm">{{ buttonText }}</button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>

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
  }
})

const emit = defineEmits(['update:visible', 'confirm'])

// 点击遮罩层关闭
const onMaskClick = () => {
  if (props.maskClosable) {
    close()
  }
}

// 点击确认按钮
const onConfirm = () => {
  emit('confirm')
  close()
}

// 关闭弹窗
const close = () => {
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

.popup-message {
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  text-align: center;
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
}

.popup-button:active {
  background-color: #f2f2f2;
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