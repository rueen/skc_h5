<!--
 * @Author: diaochan
 * @Date: 2025-02-25 11:50:45
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-11 15:40:59
 * @Description: 任务页
 -->
<template>
  <div :class="$style.tasksPage">
    <!-- 任务状态标签 -->
    <div :class="$style.tabsWrapper">
      <van-tabs
        v-model:active="activeTab"
        :class="$style.statusTabs"
        swipeable
        @click-tab="onTabChange"
      >
        <van-tab :title="$t('task.applications.applied')" :name="'applied'" />
        <van-tab :title="$t('task.applications.submitted')" :name="'submitted'" />
        <van-tab :title="$t('task.applications.completed')" :name="'completed'" />
      </van-tabs>
    </div>

    <!-- 列表内容区域 -->
    <div :class="$style.content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          v-model:finished="finished"
          :finished-text="$t('common.finishedText')"
        >
          <div 
            v-for="item in list"
            :key="item.id"
            :class="$style.listItem"
            @click="handleClickItem(item)"
          >
            <div :class="$style.mainContent">
              <div :class="$style.header">
                <div :class="$style.titleWrapper">
                  <img 
                    :src="item.channelIcon"
                    :class="$style.platformIcon"
                    alt="platform"
                  />
                  <h3>{{ item.taskName }}</h3>
                </div>
                <span :class="$style.status" v-if="activeTab === 'applied'">{{ $t('task.enrolled') }}</span>
                <span :class="$style.status" v-else>
                  <span v-if="item.taskPreAuditStatus === 'approved'">
                    {{ enumStore.getEnumText('TaskAuditStatus', item.taskAuditStatus) }}
                  </span>
                  <span v-else>
                    {{ enumStore.getEnumText('TaskPreAuditStatus', item.taskPreAuditStatus) }}
                  </span>
                </span>
              </div>
              
              <div :class="$style.contentWrapper">
                <div :class="$style.contentRow">
                  <div :class="$style.price">
                    {{ formatPrice(item.reward) }}
                  </div>
                  <div :class="$style.bottomInfo">
                    <div :class="$style.tags">
                      <van-tag type="primary" :class="$style.taskType">
                        {{ enumStore.getEnumText('TaskType', item.taskType) }}
                      </van-tag>
                      <van-tag type="warning" :class="$style.followers">
                        {{ item.fansRequired }}
                      </van-tag>
                    </div>
                    <div :class="$style.deadline" v-if="activeTab === 'applied'">
                      <span :class="$style.label">{{ $t('task.enrolledTime') }}</span>
                      <span :class="$style.value">{{ item.enrollTime }}</span>
                    </div>
                    <div :class="$style.deadline" v-else>
                      <span :class="$style.label">{{ $t('task.submittedTime') }}</span>
                      <span :class="$style.value">{{ item.submitTime }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { get } from '@/utils/request'
import { useEnumStore } from '@/stores'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const enumStore = useEnumStore()
// 当前选中的任务状态
const activeTab = ref(route.query.activeTab || 'applied') // applied | submitted | completed

// 列表数据
const page = ref(1)
const pageSize = ref(10)
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

const getEnrolledList = async () => {
  if (refreshing.value) {
    list.value = []
    refreshing.value = false
  }
  try {
    const res = await get('task.enrolled', {
      page: page.value,
      pageSize: pageSize.value,
    })
    list.value = res.data.list
    loading.value = false
    finished.value = res.data.total <= list.value.length
    refreshing.value = false
    if (list.value.length >= res.data.total) {
      finished.value = true
    }
  } catch (error) {
    console.log(error)
  }
}
const getSubmittedList = async (taskAuditStatus) => {
  if (refreshing.value) {
    list.value = []
    refreshing.value = false
  }
  try {
    const res = await get('task.submitted', {
      page: page.value,
      pageSize: pageSize.value,
      taskAuditStatus
    })
    list.value = res.data.list
    loading.value = false
    finished.value = res.data.total <= list.value.length
    refreshing.value = false
    if (list.value.length >= res.data.total) {
      finished.value = true
    }
  } catch (error) {
    console.log(error)
  }
}
// 加载数据
const onLoad = async () => {
  switch (activeTab.value) {
    case 'applied':
      await getEnrolledList()
      break
    case 'submitted':
      await getSubmittedList('pending | rejected')
      break
    case 'completed':
      await getSubmittedList('approved')
      break
  }
}

// 下拉刷新
const onRefresh = () => {
  finished.value = false
  loading.value = true
  onLoad()
}

// 切换任务状态
const onTabChange = ({name}) => {
  activeTab.value = name
  list.value = []
  finished.value = false
  loading.value = true
  onLoad()
}

// 格式化价格
const formatPrice = (price) => {
  return `¥${price}`
}

// 点击任务项
const handleClickItem = (item) => {
  if(activeTab.value === 'applied') {
    // 已报名
    router.push(`/tasks/submit/new?taskId=${item.taskId}`)
  } else {
    // 已提交 | 已完成
    router.push(`/tasks/submit/${item.id}?taskId=${item.taskId}`)
  }
}

onMounted(async () => {
  onLoad()
})
</script>

<style lang="less" module>
.tasksPage {
  min-height: 100vh;
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
}

.tabsWrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background: #fff;
  max-width: 750px;
  margin: 0 auto;
}

.statusTabs {
  :global {
    .van-tabs__wrap {
      padding-right: 12px;
      padding-left: 12px;
      background: #fff;
    }

    .van-tabs__line {
      background-color: var(--van-primary-color);
    }

    .van-tab--active {
      color: var(--van-primary-color);
    }
  }
}

.content {
  flex: 1;
  margin-top: 44px;
  overflow-y: auto;
}

.listItem {
  margin: 8px 12px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.mainContent {
  flex: 1;
  min-width: 0;
  width: 0;
  display: flex;
  flex-direction: column;
}

.status {
  font-size: 13px;
  color: #1989fa;
  margin-left: 12px;
  flex-shrink: 0;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  width: 100%;
}

.titleWrapper {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;

  .platformIcon {
    width: 16px;
    height: 16px;
    margin-right: 6px;
    flex-shrink: 0;
  }

  h3 {
    margin: 0;
    font-size: 15px;
    color: #323233;
    font-weight: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.status {
  font-size: 13px;
  color: #1989fa;
  margin-left: 12px;
  flex-shrink: 0;
}

.contentWrapper {
  display: flex;
  gap: 10px;
}

.contentRow {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.price {
  font-size: 18px;
  color: #ff4d4f;
  font-weight: bold;
  line-height: 1.2;
}

.bottomInfo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tags {
  display: flex;
  gap: 4px;
  align-items: center;
}

.deadline {
  font-size: 12px;
  color: #969799;
  display: flex;
  align-items: center;

  .label {
    margin-right: 3px;
  }

  .value {
    color: #323233;
  }
}

.image {
  width: 70px;
  height: 70px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
}
</style> 