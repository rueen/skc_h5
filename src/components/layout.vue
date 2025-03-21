<!--
 * @Author: diaochan
 * @Date: 2025-03-21 10:50:39
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-21 11:12:15
 * @Description: 
-->
<template>
  <div :class="$style.layout">
    <slot></slot>
  </div>
</template>

<style lang="less" module>
.layout{
  padding-top: var(--van-nav-bar-height);
  min-height: 100vh;
  background: #f7f8fa;
  box-sizing: border-box;
}
</style>