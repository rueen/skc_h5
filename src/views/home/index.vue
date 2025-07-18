<!--
 * @Author: diaochan
 * @Date: 2025-02-25 10:15:45
 * @LastEditors: rueen
 * @LastEditTime: 2025-07-18 16:46:45
 * @Description: 首页
 -->

<template>
  <div :class="$style.homePage">
    <!-- 平台选择标签 -->
    <div :class="$style.tabsWrapper">
      <van-tabs
        v-model:active="activeChannelId"
        :class="$style.platformTabs"
        swipeable
        @click-tab="onChannelChange"
      >
        <van-tab 
          v-for="channel in channelList" 
          :key="channel.id"
          :title="channel.name"
          :name="channel.id"
        />
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
        <van-empty image="search" v-if="list.length === 0" :description="$t('common.emptyText')" />
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
          <div v-for="item in list" :key="item.id">
            <div
              v-if="item.taskGroup && item.taskGroup.relatedTasks && item.taskGroup.relatedTasks.indexOf(item.id) === 0"
              :class="$style.taskGroupItem"
              @click="router.push(`/taskGroups/detail/${item.taskGroup.id}`)"
            >
              <div :class="$style.taskGroupHeader">
                <div :class="$style.taskGroupName">
                  <van-icon name="orders-o" :class="$style.taskGroupHeaderIcon" />
                  <span>{{ item.taskGroup.taskGroupName }}</span>
                </div>
                <div :class="$style.deadlineBox">
                  <div :class="$style.price">
                    {{ formatPrice(item.taskGroup.allReward.toFixed(2)) }}
                  </div>
                  <div :class="$style.deadline" v-if="item.taskGroup.relatedTasksList && item.taskGroup.relatedTasksList.length">
                    <span :class="$style.label">{{ $t('task.endTime') }}</span>
                    <span :class="$style.value">{{ item.taskGroup.relatedTasksList[0].endTime }}</span>
                  </div>
                </div>
              </div>
              <div :class="$style.taskGroupTaskList">
                <div :class="$style.taskGroupTaskItem" v-for="task in item.taskGroup.relatedTasksList" :key="task.id">
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
                    <div :class="$style.price">{{ formatPrice(item.taskGroup.taskGroupReward.toFixed(2)) }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else
              :class="$style.listItem"
              @click="router.push(`/tasks/detail/${item.id}`)"
            >
              <div :class="$style.mainContent">
                <div :class="$style.header">
                  <img 
                    :src="item.channelIcon" 
                    :class="$style.platformIcon"
                    alt="platform"
                  />
                  <h3>{{ item.taskName }}</h3>
                  <span :class="$style.status" v-if="item.isEnrolled">{{ $t('task.enrolled') }}</span>
                </div>
                
                <div :class="$style.contentRow">
                  <div :class="$style.leftContent">
                    <div :class="$style.price">
                      {{ formatPrice(item.reward) }}
                    </div>
                    <div :class="$style.tags">
                      <van-tag
                        type="primary" 
                        :class="$style.taskType"
                      >
                        {{ enumStore.getEnumText('TaskType', item.taskType) }}
                      </van-tag>
                      <van-tag
                        type="warning"
                        :class="$style.followers"
                      >
                        {{ item.fansRequired }}
                      </van-tag>
                    </div>
                  </div>

                  <div :class="$style.info">
                    <div :class="$style.infoItem">
                      <span :class="$style.label">{{ $t('task.remainingQuota') }}</span>
                      <span :class="$style.value">
                        <span v-if="item.unlimitedQuota">{{ $t('task.unlimitedQuota') }}</span>
                        <span v-else>{{ item.remainingQuota }}</span>
                      </span>
                    </div>
                    <div :class="$style.infoItem">
                      <span :class="$style.label">{{ $t('task.category') }}</span>
                      <span :class="$style.value">{{ item.category }}</span>
                    </div>
                    <div :class="$style.infoItem" v-if="new Date(item.startTime) > new Date()">
                      <span :class="$style.label">{{ $t('task.startTime') }}</span>
                      <span :class="$style.value">{{ item.startTime }}</span>
                    </div>
                    <div :class="$style.infoItem" v-else>
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
import { useRouter } from 'vue-router'
import { get } from '@/utils/request'
import { useEnumStore } from '@/stores'

const router = useRouter()
const enumStore = useEnumStore()
// 当前选中的平台
const activeChannelId = ref(0)
// 平台列表
const channelList = ref([])

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
  onLoad()
}

// 加载数据
const onLoad = async () => {
  try {
    const res = await get('task.list', {
      page: page.value,
      pageSize: pageSize.value,
      channelId: activeChannelId.value,
    })
    const newItems = res.data.list || [];
    for (let i = 0; i < newItems.length; i++) {
      list.value.push(newItems[i]);
    }
    loading.value = false;
    refreshing.value = false;
    page.value++;
    if (list.value.length >= res.data.total || newItems.length <= 0) {
      finished.value = true
    }
  } catch (error) {
    error.value = true;
    loading.value = false;
  }
}

// 切换平台
const onChannelChange = ({name}) => {
  activeChannelId.value = name
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

const loadChannelList = async () => {
  try {
    const res = await get('channel.list')
    channelList.value = res.data || []
    activeChannelId.value = channelList.value[0].id
  } catch (error) {
    console.log(error)
  }
}

// 初始化
onMounted(async () => {
  await loadChannelList()
  onLoad()
})
</script>

<style lang="less" module>
.homePage {
  min-height: 100vh;
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

.platformTabs {
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

  .mainContent {
    flex: 1;
    min-width: 0;
    width: 0;
    display: flex;
    flex-direction: column;
    height: 90px;

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      width: 100%;
      font-size: 16px;

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
        flex: 1;
      }
    }

    .status {
      font-size: 13px;
      color: #1989fa;
      margin-left: 12px;
      flex-shrink: 0;
    }

    .contentRow {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex: 1;
      padding-top: 2px;
    }

    .leftContent {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    .price {
      font-size: 18px;
      color: #ff4d4f;
      font-weight: bold;
      line-height: 1.2;
    }

    .tags {
      display: flex;
      gap: 4px;

      :global {
        .van-tag {
          padding: 0 4px;
          font-size: 11px;
          height: 18px;
          line-height: 16px;
          border-radius: 2px;
        }
      }

      .taskType {
        :global {
          .van-tag {
            color: #1989fa;
            border-color: #1989fa;
            background: rgba(25, 137, 250, 0.1);
          }
        }
      }

      .followers {
        :global {
          .van-tag {
            color: #ff976a;
            border-color: #ff976a;
            background: rgba(255, 151, 106, 0.1);
          }
        }
      }
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      flex: 1;
      margin-left: 12px;
      padding: 0;
    }

    .infoItem {
      font-size: 12px;
      line-height: 1.3;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      white-space: nowrap;

      .label {
        color: #969799;
        margin-right: 3px;
        min-width: 60px;
      }

      .value {
        color: #323233;
      }
    }
  }
}
</style> 