<!--
 * @Author: diaochan
 * @Date: 2025-03-26 11:00:41
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-26 11:10:38
 * @Description: 
-->
<template>
  <Layout>
    <!-- 顶部导航 -->
    <van-nav-bar
      title="群组成员"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />

    <!-- 列表内容区域 -->
    <div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          v-model:finished="finished"
          finished-text="没有更多了"
        >
          <div 
            v-for="item in list"
            :key="item.id"
          >
            <div>
              
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { get } from '@/utils/request'
import Layout from '@/components/layout.vue'

const router = useRouter()
const route = useRoute()
const groupId = ref(route.params.groupId)

// 列表数据
const page = ref(1)
const pageSize = ref(10)
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

// 事件处理
const onClickLeft = () => {
  router.back()
}

const loadMembers = async () => {
  const res = await get('groups.members', {
    page: page.value,
    pageSize: pageSize.value
  }, {
    urlParams: {
      groupId: groupId.value
    }
  })
  if(res.code === 0){
    list.value = res.data.list
    loading.value = false
    finished.value = res.data.total <= list.value.length
    refreshing.value = false
    if (list.value.length >= res.data.total) {
      finished.value = true
    }
  }
}

onMounted(async () => {
  loadMembers()
})
</script>

<style lang="less" module>
</style>