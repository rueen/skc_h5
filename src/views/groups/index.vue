<!--
 * @Author: diaochan
 * @Date: 2025-03-21 11:10:52
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-11 19:00:54
 * @Description: 
-->
<template>
  <Layout>
    <!-- 顶部导航 -->
    <nav-bar
      :title="$t('groups.index.title')"
      left-arrow
      fixed
    />
    <!-- 未加入任何群组 -->
    <van-empty v-if="groups.length === 0" :description="$t('groups.index.noData')" />
    <!-- 群组列表 群主 -->
    <template v-if="isGroupOwner">
      <div :class="$style.title">
        <van-space :size="20">
          <span>{{ $t('groups.index.groupCount') }}：{{ groupStats.groupCount }}</span>
          <span>{{ $t('groups.index.memberCount') }}：{{ groupStats.memberCount }}</span>
          <span>{{ $t('groups.index.taskCount') }}：{{ groupStats.taskCount }}</span>
          <span>{{ $t('groups.index.totalCommission') }}：<span :class="$style.earnings">{{ groupStats.totalCommission }}</span></span>
        </van-space>
      </div>
      <div :class="$style.header">
        <div :class="[$style.headerItem, $style.headerItemLeft]">{{ $t('groups.index.groupName') }}</div>
        <div :class="[$style.headerItem, $style.headerItemCenter]">{{ $t('groups.index.memberCount') }}</div>
        <div :class="[$style.headerItem, $style.headerItemRight]">{{ $t('groups.index.totalCommission') }}</div>
      </div>
      <div
        :class="$style.listItem"
        @click="router.push(`/groups/members/${group.id}`)"
        v-for="group in groups"
        :key="group.id"
      >
        <div :class="$style.listItemLeft">
          <span :class="$style.text">{{ group.groupName }}</span>
        </div>
        <div :class="$style.listItemCenter">
          <span :class="$style.text">{{ group.memberCount }}</span>
        </div>
        <div :class="$style.listItemRight">
          <div :class="[$style.text, $style.earnings]">{{ group.totalEarnings }}</div>
        </div>
        <van-icon name="arrow" />
      </div>
      <!-- 群主任务统计 -->
      <div :class="$style.header">
        <div :class="[$style.headerItem, $style.headerItemLeft]">{{ $t('groups.index.taskName') }}</div>
        <div :class="[$style.headerItem, $style.headerItemCenter]">{{ $t('groups.index.memberCount') }}</div>
        <div :class="[$style.headerItem, $style.headerItemRight]">{{ $t('groups.index.totalCommission') }}</div>
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          v-model:finished="finished"
          :finished-text="$t('common.finishedText')"
        >
          <div
            :class="$style.listItem"
            v-for="item in commissionTasks"
            :key="item.taskId"
          >
            <div :class="$style.listItemLeft">
              <span :class="$style.text">{{ item.taskName }}</span>
            </div>
            <div :class="$style.listItemCenter">
              <span :class="$style.text">{{ item.participantCount }}</span>
            </div>
            <div :class="$style.listItemRight" style="margin-right: 16px;">
              <div :class="[$style.text, $style.earnings]">{{ item.commission }}</div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </template>

    <!-- 群组列表 非群主 -->
    <template v-else>
      <div :class="$style.groupItem" v-for="group in groups" :key="group.id">
        <div :class="$style.formItem">
          <div :class="$style.label">{{ $t('groups.index.groupName') }}</div>
          <div :class="$style.value">{{ group.groupName }}</div>
        </div>
        <div :class="$style.formItem">
          <div :class="$style.label">{{ $t('groups.index.groupLink') }}</div>
          <div :class="$style.value">
            <span>{{ group.groupLink }}</span>
            <van-icon name="copy" />
          </div>
        </div>
      </div>
    </template>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { get } from '@/utils/request'
import Layout from '@/components/layout.vue'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()

const groups = ref([])
const isGroupOwner = computed(() => {
  return groups.value.some(group => group.isGroupOwner)
})
const groupStats = ref({
  groupCount: 0, // 群主拥有的群组数量
  memberCount: 0,         // 群主名下所有群成员总数
  totalCommission: 0,  // 群主累计获得的佣金总额
  taskCount: 0            // 为群主带来收益的任务总数
})

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

const page = ref(1)
const pageSize = ref(10)
const commissionTasks = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const loadCommissionTasks = async () => {
  const res = await get('groups.commissionTasks', {
    page: page.value,
    pageSize: pageSize.value,
  })
  if (res.code === 0) {
    commissionTasks.value = res.data.list
    loading.value = false
    finished.value = res.data.total <= commissionTasks.value.length
    refreshing.value = false
    if (commissionTasks.value.length >= res.data.total) {
      finished.value = true
    }
  }
}

// 下拉刷新
const onRefresh = () => {
  finished.value = false
  loading.value = true
  loadCommissionTasks()
}

onMounted(async () => {
  await loadGroups()
  if (isGroupOwner.value) {
    loadGroupStats()
    loadCommissionTasks()
  }
})
</script>

<style lang="less" module>
.title{
  font-size: 14px;
  color: #323233;
  padding: 12px 16px;
  background: #FFF3EE;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;

  .headerItem {
    text-align: center;
    font-size: 14px;
    color: #323233;
  }

  .headerItemLeft {
    flex: 1;
    text-align: left;
  }

  .headerItemCenter {
    width: 70px;
    text-align: center;
  } 

  .headerItemRight {
    width: 120px;
    text-align: center;
    margin-right: 16px;
  }
}
.listItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #f5f6f7;
  &:last-child {
    border-bottom: none;
  }

  .listItemLeft{
    flex: 1;
  }

  .listItemCenter{
    width: 70px;
    text-align: center;
  }

  .listItemRight{
    width: 120px;
    text-align: center;
  }
}
.groupItem {
  background: #fff;
  margin-bottom: 12px;
  overflow: hidden;
  
  .formItem {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f5f6f7;

    &:last-child {
      border-bottom: none;
    }

    .label {
      width: 80px;
      font-size: 14px;
      color: #323233;
    }

    .value {
      font-size: 14px;
      color: #323233;
    }
  }
}
.text {
  font-size: 14px;
  color: #323233;
}
.earnings {
  color: #FF951C;
}

</style> 