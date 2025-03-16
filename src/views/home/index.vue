<!--
 * @Author: diaochan
 * @Date: 2025-02-25 10:15:45
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-16 20:50:21
 * @Description: 首页
 -->
<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { get } from '@/utils/request'
import { useEnumStore } from '@/stores'

const { t } = useI18n()
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

// 加载数据
const onLoad = async () => {
  if (refreshing.value) {
    list.value = []
    refreshing.value = false
  }
  try {
    const res = await get('task.list', {
      page: page.value,
      pageSize: pageSize.value,
      channelId: activeChannelId.value,
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

// 下拉刷新
const onRefresh = () => {
  finished.value = false
  loading.value = true
  onLoad()
}

// 切换平台
const onChannelChange = (index) => {
  activeChannelId.value = channelList.value[index].id
  list.value = []
  finished.value = false
  loading.value = true
  onLoad()
}

// 格式化价格
const formatPrice = (price) => {
  return `¥${price}`
}

const getChannelList = async () => {
  try {
    const res = await get('channel.list', {
      page: 1,
      pageSize: 100,
    })
    channelList.value = res.data || []
    activeChannelId.value = channelList.value[0].id
  } catch (error) {
    console.log(error)
  }
}

// 初始化
onMounted(() => {
  getChannelList()
})
</script>

<template>
  <div :class="$style.homePage">
    <!-- 平台选择标签 -->
    <div :class="$style.tabsWrapper">
      <van-tabs
        v-model:active="activeChannelId"
        :class="$style.platformTabs"
        swipeable
        @change="onChannelChange"
      >
        <van-tab 
          v-for="channel in channelList" 
          :key="channel.id"
          :title="channel.name"
        />
      </van-tabs>
    </div>

    <!-- 列表内容区域 -->
    <div :class="$style.content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          v-model:finished="finished"
          :finished-text="t('home.finishedText')"
        >
          <div 
            v-for="item in list"
            :key="item.id"
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
                      {{ enumStore.enumJson.TaskType[item.taskType] }}
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
                    <span :class="$style.label">剩余名额：</span>
                    <span :class="$style.value">{{ item.remainingSlots }}</span>
                  </div>
                  <div :class="$style.infoItem">
                    <span :class="$style.label">达人领域：</span>
                    <span :class="$style.value">{{ item.category }}</span>
                  </div>
                  <div :class="$style.infoItem">
                    <span :class="$style.label">截止日期：</span>
                    <span :class="$style.value">{{ item.endTime }}</span>
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

<style lang="less" module>
.homePage {
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

.content {
  flex: 1;
  margin-top: 44px; // 与 van-tabs 的默认高度保持一致
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
  height: 90px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  width: 100%;

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
</style> 