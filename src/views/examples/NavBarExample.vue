<!--
 * @Author: rueen
 * @Date: 2025-04-01 10:20:00
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-01 16:05:00
 * @Description: 导航栏示例
 -->
<template>
  <div class="navbar-example">
    <!-- 基础用法 -->
    <nav-bar
      title="基础用法"
      left-text="返回"
      right-text="按钮"
      @click-right="onClickRight"
    />
    
    <div class="section">
      <h3>基础用法</h3>
      <p>继承 van-nav-bar 的所有属性和方法，点击左侧返回按钮时会智能判断返回路径。</p>
    </div>
    
    <!-- 自定义样式 -->
    <nav-bar
      title="自定义样式"
      left-text="返回"
      right-text="更多"
      @click-right="onClickRight"
      class="custom-nav"
    />
    
    <div class="section">
      <h3>自定义样式</h3>
      <p>可以通过 CSS 自定义导航栏样式。</p>
    </div>
    
    <!-- 总是返回首页 -->
    <nav-bar
      title="总是返回首页"
      left-text="首页"
      :always-go-home="true"
    />
    
    <div class="section">
      <h3>总是返回首页</h3>
      <p>设置 always-go-home 属性为 true，点击返回按钮时将始终返回首页。</p>
    </div>
    
    <!-- 自定义返回行为 -->
    <nav-bar
      title="自定义返回行为"
      left-text="返回"
      :on-back="customBack"
    />
    
    <div class="section">
      <h3>自定义返回行为</h3>
      <p>通过 on-back 属性设置自定义返回函数。</p>
    </div>
    
    <!-- 使用插槽 -->
    <nav-bar title="使用插槽">
      <template #left>
        <van-icon name="arrow-left" size="18" @click="$router.back()" />
        <span class="slot-text">返回</span>
      </template>
      <template #right>
        <van-icon name="search" size="18" />
        <van-icon name="more-o" size="18" style="margin-left: 12px;" />
      </template>
    </nav-bar>
    
    <div class="section">
      <h3>使用插槽</h3>
      <p>通过插槽可以自定义导航栏左右两侧的内容。</p>
    </div>
    
    <!-- 直接提供 onClickLeft 和 onClickRight 回调 -->
    <nav-bar
      title="直接提供回调"
      left-text="自定义左侧"
      right-text="自定义右侧"
      :on-click-left="customLeftClick"
      :on-click-right="customRightClick"
    />
    
    <div class="section">
      <h3>直接提供回调</h3>
      <p>通过 onClickLeft 和 onClickRight 属性可以直接提供回调函数，这些函数会优先于组件的默认行为执行。</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from 'vant'
import NavBar from '@/components/NavBar.vue'

// 点击右侧按钮
const onClickRight = () => {
  showToast('点击了右侧按钮')
}

// 自定义返回逻辑
const customBack = () => {
  showToast('触发了自定义返回逻辑')
  setTimeout(() => {
    window.history.back()
  }, 1000)
}

// 自定义左侧按钮点击
const customLeftClick = () => {
  showToast('自定义左侧按钮点击')
}

// 自定义右侧按钮点击
const customRightClick = () => {
  showToast('自定义右侧按钮点击')
}
</script>

<style lang="less" scoped>
.navbar-example {
  padding-bottom: 20px;
}

.section {
  padding: 16px;
  margin-bottom: 30px;
  
  h3 {
    font-size: 16px;
    font-weight: 500;
    color: #323233;
    margin: 0 0 8px;
  }
  
  p {
    font-size: 14px;
    color: #646566;
    line-height: 1.5;
    margin: 0;
  }
}

// 自定义导航栏样式
:deep(.custom-nav) {
  .van-nav-bar__title {
    color: #ff4d4f;
  }
  
  .van-nav-bar__text {
    color: #1989fa;
  }
  
  .van-nav-bar__arrow {
    color: #1989fa;
  }
}

// 插槽内容样式
.slot-text {
  margin-left: 4px;
  font-size: 14px;
}
</style> 