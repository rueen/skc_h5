<!--
 * @Author: diaochan
 * @Date: 2025-02-25 10:15:45
 * @LastEditors: rueen
 * @LastEditTime: 2025-02-25 21:29:21
 * @Description: 首页
 -->
<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { showToast } from 'vant'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

// 当前选中的平台
const activePlatform = ref(0)

// 平台列表
const platforms = [
  { name: t('home.all'), id: 'all' },
  { name: 'Facebook', id: 'facebook' },
  { name: 'Instagram', id: 'instagram' },
  { name: 'Tiktok', id: 'tiktok' },
  { name: 'YouTube', id: 'youtube' },
  { name: 'Twitter', id: 'twitter' },
  { name: 'Pinterest', id: 'pinterest' }
]

// 列表数据
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

// 模拟数据
const mockData = [
  {
    id: 1,
    title: '测评新款化妆品测评新款化妆品',
    price: 1500,
    remainingSlots: 3,
    category: '美妆/护肤',
    deadline: '2025-03-10',
    taskType: '图文',
    followers: '10w+',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  },
  {
    id: 2,
    title: '亲子互动玩具测评',
    price: 2000,
    remainingSlots: 5,
    category: '母婴/亲子',
    deadline: '2025-03-15',
    taskType: '视频',
    followers: '100w+',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  },
  {
    id: 3,
    title: '新品零食开箱试吃',
    price: 1000,
    remainingSlots: 2,
    category: '美食/饮品',
    deadline: '2025-03-08',
    taskType: '图文',
    followers: '50w+',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  }
]

// 加载数据
const onLoad = () => {
  // 模拟异步加载
  setTimeout(() => {
    if (refreshing.value) {
      list.value = []
      refreshing.value = false
    }

    for (let i = 0; i < 10; i++) {
      const item = mockData[Math.floor(Math.random() * mockData.length)]
      list.value.push({
        ...item,
        id: list.value.length + 1
      })
    }

    loading.value = false

    // 模拟数据加载完毕
    if (list.value.length >= 40) {
      finished.value = true
    }
  }, 1000)
}

// 下拉刷新
const onRefresh = () => {
  finished.value = false
  loading.value = true
  onLoad()
}

// 切换平台
const onPlatformChange = (index) => {
  list.value = []
  finished.value = false
  loading.value = true
  onLoad()
}

// 格式化价格
const formatPrice = (price) => {
  return `¥${price}`
}

// 格式化日期
const formatDate = (date) => {
  return `截止：${date}`
}
</script>

<template>
  <div :class="$style.homePage">
    <!-- 平台选择标签 -->
    <div :class="$style.tabsWrapper">
      <van-tabs
        v-model:active="activePlatform"
        :class="$style.platformTabs"
        swipeable
        @change="onPlatformChange"
      >
        <van-tab 
          v-for="platform in platforms" 
          :key="platform.id"
          :title="platform.name"
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
          @load="onLoad"
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
                  src="@/assets/icon/Facebook.png" 
                  :class="$style.platformIcon"
                  alt="platform"
                />
                <h3>{{ item.title }}</h3>
              </div>
              
              <div :class="$style.contentRow">
                <div :class="$style.leftContent">
                  <div :class="$style.price">
                    {{ formatPrice(item.price) }}
                  </div>
                  <div :class="$style.tags">
                    <van-tag
                      type="primary" 
                      :class="$style.taskType"
                    >
                      {{ item.taskType }}
                    </van-tag>
                    <van-tag
                      type="warning"
                      :class="$style.followers"
                    >
                      {{ item.followers }}
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
                    <span :class="$style.value">{{ item.deadline }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div :class="$style.image">
              <van-image
                width="90"
                height="90"
                fit="cover"
                :src="item.image"
                radius="4"
              />
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

.image {
  width: 90px;
  height: 90px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
}
</style> 