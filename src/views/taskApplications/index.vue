<!--
 * @Author: diaochan
 * @Date: 2025-02-25 11:50:45
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-21 18:50:34
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
        @change="onTabChange"
      >
        <van-tab :title="t('tasks.applied')" :name="'applied'" />
        <van-tab :title="t('tasks.submitted')" :name="'submitted'" />
        <van-tab :title="t('tasks.completed')" :name="'completed'" />
      </van-tabs>
    </div>

    <!-- 列表内容区域 -->
    <div :class="$style.content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          v-model:finished="finished"
          :finished-text="t('tasks.finishedText')"
          @load="onLoad"
        >
          <div 
            v-for="item in list"
            :key="item.id"
            :class="$style.listItem"
            @click="router.push(`/tasks/apply/detail/${item.id}`)"
          >
            <div :class="$style.mainContent">
              <div :class="$style.header">
                <div :class="$style.titleWrapper">
                  <img 
                    src="@/assets/icon/Facebook.png" 
                    :class="$style.platformIcon"
                    alt="platform"
                  />
                  <h3>{{ item.title }}</h3>
                </div>
                <span :class="$style.status">{{ item.status }}</span>
              </div>
              
              <div :class="$style.contentWrapper">
                <div :class="$style.image">
                  <van-image
                    width="70"
                    height="70"
                    fit="cover"
                    :src="item.image"
                    radius="4"
                  />
                </div>

                <div :class="$style.contentRow">
                  <div :class="$style.price">
                    {{ formatPrice(item.price) }}
                  </div>
                  <div :class="$style.bottomInfo">
                    <div :class="$style.tags">
                      <van-tag type="primary" :class="$style.taskType">
                        {{ item.taskType }}
                      </van-tag>
                      <van-tag type="warning" :class="$style.followers">
                        {{ item.followers }}
                      </van-tag>
                    </div>
                    <div :class="$style.deadline">
                      <span :class="$style.label">截止日期：</span>
                      <span :class="$style.value">{{ item.deadline }}</span>
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
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { get } from '@/utils/request'

const { t } = useI18n()
const router = useRouter()

// 当前选中的任务状态
const activeTab = ref('applied')

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
    const res = await get('task.applications', {
      page: page.value,
      pageSize: pageSize.value,
      status: activeTab.value,
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

// 切换任务状态
const onTabChange = (index) => {
  console.log(index)
  list.value = []
  finished.value = false
  loading.value = true
  onLoad()
}

// 格式化价格
const formatPrice = (price) => {
  return `¥${price}`
}
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