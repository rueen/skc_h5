<!--
 * @Author: diaochan
 * @Date: 2025-02-25 11:50:45
 * @LastEditors: rueen
 * @LastEditTime: 2025-09-17 16:00:46
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
    <div :class="$style.refreshBox">
      <van-pull-refresh
        v-model="refreshing"
        :pulling-text="$t('common.pullingText')"
        :loosing-text="$t('common.loosingText')"
        @refresh="onRefresh"
      >
        <van-empty image="search" v-if="list.length === 0 && taskGroups.length === 0" :description="$t('common.emptyText')" />
        <van-list
          v-model:loading="loading"
          :loading-text="$t('common.loadingText')"
          v-model:finished="finished"
          :finished-text="$t('common.finishedText')"
          v-model:error="error"
          :error-text="$t('common.listRrrorText')"
          :immediate-check="false"
          @load="onLoad"
          v-else
        >
          <div
            v-for="item in taskGroups"
            :key="item.id"
            :class="$style.taskGroupItem"
            @click="router.push(`/taskGroups/detail/${item.taskGroupId}`)"
          >
            <div :class="$style.taskGroupHeader">
              <div :class="$style.taskGroupName">
                <van-icon name="orders-o" :class="$style.taskGroupHeaderIcon" />
                <span>{{ item.taskGroupName }}</span>
              </div>
              <div :class="$style.deadlineBox">
                <div :class="$style.price">
                  {{ formatPrice(item.allReward.toFixed(2)) }}
                </div>
                <div :class="$style.deadline" v-if="item.relatedTasksList && item.relatedTasksList.length">
                  <span :class="$style.label">{{ $t('task.endTime') }}</span>
                  <span :class="$style.value">{{ item.relatedTasksList[0].endTime }}</span>
                </div>
              </div>
            </div>
            <div :class="$style.taskGroupTaskList">
              <div :class="$style.taskGroupTaskItem" v-for="task in item.relatedTasksList" :key="task.id">
                <div :class="$style.taskName">
                  <img 
                    :src="task.channelIcon" 
                    :class="$style.platformIcon"
                    alt="platform"
                  />
                  <span>{{ task.taskName }}</span>
                </div>
                <div :class="$style.deadlineBox">
                  <div :class="$style.price">{{ formatPrice(task.reward) }}</div>
                  <div :class="$style.deadline">
                    <span :class="$style.label">{{ $t('task.endTime') }}</span>
                    <span :class="$style.value">{{ task.endTime }}</span>
                  </div>
                </div>
              </div>
              <div :class="[$style.taskGroupTaskItem, $style.taskGroupRewardItem]">
                <div :class="$style.taskName">
                  <van-icon name="balance-o" :class="$style.taskGroupRewardIcon" />
                  <span>{{ $t('task.taskGroupReward') }}</span>
                </div>
                <div :class="$style.taskInfo">
                  <div :class="$style.price">{{ formatPrice(item.taskGroupReward) }}</div>
                </div>
              </div>
            </div>
          </div>
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
                    <div :class="$style.deadline" v-if="activeTab === 'completed'">
                      <span :class="$style.label">{{ $t('task.submittedTime') }}</span>
                      <span :class="$style.value">{{ item.submitTime }}</span>
                    </div>
                    <div :class="$style.deadline" v-else>
                      <span :class="$style.label">{{ $t('task.endTime') }}</span>
                      <span :class="$style.value">{{ item.endTime }}</span>
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
const taskGroups = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const error = ref(false);

// 下拉刷新
const onRefresh = async () => {
  page.value = 1
  list.value = []
  taskGroups.value = []
  finished.value = false
  loading.value = true
  onLoad()
}

const getEnrolledList = async () => {
  try {
    const res = await get('task.enrolled', {
      excludeSubmitted: true,
      page: page.value,
      pageSize: pageSize.value,
    })
    taskGroups.value = res.data.taskGroups || [];
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
const getSubmittedList = async (taskAuditStatus) => {
  try {
    const res = await get('task.submitted', {
      page: page.value,
      pageSize: pageSize.value,
      taskAuditStatus
    })
    taskGroups.value = res.data.taskGroups || [];
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

// 切换任务状态
const onTabChange = ({name}) => {
  activeTab.value = name
  page.value = 1
  list.value = []
  finished.value = false
  loading.value = true
  onLoad()
}

// 格式化价格
const formatPrice = (price) => {
  return `${price}`
}

// 点击任务项
const handleClickItem = (item) => {
  if(activeTab.value === 'applied') {
    // 已报名
    // router.push(`/tasks/submit/new?taskId=${item.taskId}`)
    router.push(`/tasks/detail/${item.taskId}`)
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

.refreshBox {
  padding-top: 44px; // 与 van-tabs 的默认高度保持一致
  padding-bottom: var(--van-tabbar-height);
  box-sizing: border-box;
  height: 99vh;
  overflow-y: scroll;
}

.taskGroupItem{
  margin: 8px 12px;
  background-color: #fff;
  border-radius: 8px;
  
  .taskGroupHeader {
    border-bottom: 1px solid #eee;
    padding: 12px;

    .taskGroupHeaderIcon{
      margin-right: 3px;
      color: #5290FB;
    }
    .taskGroupName {
      margin-bottom: 8px;
    }
    .price {
      font-size: 18px;
      color: #ff4d4f;
      font-weight: bold;
      line-height: 1.2;
    }
  }
  .deadlineBox{
    display: flex;
    justify-content: space-between;
  }
  .deadline {
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    white-space: nowrap;

    .label {
      color: #969799;
      margin-right: 3px;
    }

    .value {
      color: #323233;
    }
  }
  .taskGroupTaskList {
    padding: 0 12px;
    .taskGroupTaskItem {
      border-bottom: 1px solid #f5f6f7;
      padding: 12px 0;

      &.taskGroupRewardItem {
        border-bottom: none;

        .taskGroupRewardIcon{
          margin-right: 2px;
          color: #FF7600;
        }
      }
      .taskName{
        font-size: 14px;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
      }
      .platformIcon{
        width: 14px;
        height: 14px;
        margin-right: 4px;
        flex-shrink: 0;
      }
      .price {
        font-size: 14px;
        color: #ff4d4f;
        font-weight: bold;
        line-height: 1.2;
      }
    }
  }
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