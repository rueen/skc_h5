<!--
 * @Author: diaochan
 * @Date: 2025-03-21 11:10:52
 * @LastEditors: rueen
 * @LastEditTime: 2025-07-22 16:41:28
 * @Description: 
-->
<template>
  <Layout :class="$style.groupsPage">
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
      <van-pull-refresh
        v-model="refreshing"
        :pulling-text="$t('common.pullingText')"
        :loosing-text="$t('common.loosingText')"
        @refresh="onRefresh"
      >
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
        <van-list
          v-model:loading="loading"
          :loading-text="$t('common.loadingText')"
          v-model:finished="finished"
          :finished-text="$t('common.finishedText')"
          v-model:error="error"
          :error-text="$t('common.listRrrorText')"
          :immediate-check="false"
          @load="onLoad"
        >
          <div
            :class="$style.listItem"
            v-for="item in list"
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
            <div :class="$style.groupLink">{{ group.groupLink }}</div>
            <van-button plain type="primary" size="mini" @click="handleCopy(group.groupLink)">copy</van-button>
            <van-button type="primary" size="mini" @click="handleOpen(group.groupLink)">open</van-button>
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
import { copyToClipboard } from '@/utils/copyToClipboard'

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

// 列表数据
const page = ref(1)
const pageSize = ref(10)
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const error = ref(false);

// 下拉刷新
const onRefresh = async () => {
  page.value = 1
  list.value = []
  finished.value = false
  loading.value = true
  await loadGroups()
  if (isGroupOwner.value) {
    loadGroupStats()
    onLoad()
  }
}

const onLoad = async () => {
  try {
    const res = await get('groups.commissionTasks', {
      page: page.value,
      pageSize: pageSize.value,
    })
    const newItems = res.data.list || [];
    for (let i = 0; i < newItems.length; i++) {
      list.value.push(newItems[i]);
    }
    loading.value = false;
    refreshing.value = false;
    page.value++;
    if (list.value.length >= res.data.total) {
      finished.value = true
    }
  } catch (error) {
    error.value = true;
    loading.value = false;
  }
}

const handleCopy = (groupLink) => {
  copyToClipboard(groupLink)
}

const handleOpen = (groupLink) => {
  window.location.href = groupLink
}

onMounted(async () => {
  await loadGroups()
  if (isGroupOwner.value) {
    loadGroupStats()
    onLoad()
  }
})
</script>

<style lang="less" module>
.groupsPage {
  height: 99vh;
  box-sizing: border-box;
  overflow-y: scroll;
}
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
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }
  }
  .groupLink{
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 10px;
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