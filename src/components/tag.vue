<!--
 * @Author: diaochan
 * @Date: 2025-03-20 15:09:42
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-20 15:16:26
 * @Description: 
-->
<template>
  <span :class="[$style.layout, $style[process]]">
    <slot></slot>
  </span>
</template>

<script setup>
const props = defineProps({
  process: {
    type: String,
    default: 'pending'
  }
})
</script>

<style lang="less" module>
.layout {
  display: inline-block;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;
  padding: 0 6px;
  height: 20px;
  line-height: 20px;
  box-sizing: border-box;
}
.pending{
  background-color: #faad14;
  color: #fff;
}
.approved{
  background-color: #19be6b;
  color: #fff;
}
.rejected{
  background-color: #f56c6c;
  color: #fff;
}
</style>