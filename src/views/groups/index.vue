<!--
 * @Author: diaochan
 * @Date: 2025-03-21 11:10:52
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-25 21:49:20
 * @Description: 
-->
<template>
  <Layout :class="$style.groupsPage">
    <!-- 顶部导航 -->
    <van-nav-bar
      title="我的群组"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { get } from '@/utils/request'
import Layout from '@/components/layout.vue'

const router = useRouter()

const groups = ref([])
const groupStats = ref({
  groupCount: 0,
  totalEarnings: 0
})
// 事件处理
const onClickLeft = () => {
  router.back()
}

const loadGroups = async () => {
  const res = await get('groups.groups')
  if (res.code === 0 && res.data) {
    groups.value = res.data
  }
}

const loadGroupStats = async () => {
  const res = await get('groups.stats')
  if (res.code === 0) {
    groupStats.value = res.data
  }
}

onMounted(async () => {
  await loadGroups()
  loadGroupStats()
})
</script>

<style lang="less" module>
.groupsPage {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 140px;
  padding-top: 0;
}

</style> 