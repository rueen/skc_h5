<!--
 * @Author: diaochan
 * @Date: 2025-02-25 10:15:45
 * @LastEditors: diaochan
 * @LastEditTime: 2025-02-25 11:00:33
 * @Description: 首页
 -->
<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { showToast } from 'vant'

const { t } = useI18n()

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
    title: '测评新款化妆品',
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
    <van-tabs
      v-model:active="activePlatform"
      :class="$style.platformTabs"
      scrollspy
      sticky
      swipeable
      @change="onPlatformChange"
    >
      <van-tab 
        v-for="platform in platforms" 
        :key="platform.id"
        :title="platform.name"
      >
        <!-- 下拉刷新 -->
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <!-- 列表 -->
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
            >
              <div :class="$style.content">
                <div :class="$style.header">
                  <van-icon name="fire-o" :class="$style.icon" />
                  <h3>{{ item.title }}</h3>
                </div>
                
                <div :class="$style.info">
                  <div :class="$style.price">{{ formatPrice(item.price) }}</div>
                  <div :class="$style.slots">
                    剩余名额：<span>{{ item.remainingSlots }}</span>
                  </div>
                </div>

                <div :class="$style.category">
                  <span>{{ item.category }}</span>
                  <span :class="$style.deadline">{{ formatDate(item.deadline) }}</span>
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

              <div :class="$style.image">
                <van-image
                  width="100"
                  height="100"
                  fit="cover"
                  :src="item.image"
                />
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<style lang="less" module>
.homePage {
  min-height: 100vh;
  background: #f7f8fa;
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

.listItem {
  margin: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: space-between;
}

.content {
  flex: 1;
  margin-right: 12px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  .icon {
    color: var(--van-primary-color);
    font-size: 18px;
    margin-right: 6px;
  }

  h3 {
    margin: 0;
    font-size: 16px;
    color: #333;
    font-weight: bold;
  }
}

.info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  .price {
    color: #ff4d4f;
    font-size: 18px;
    font-weight: bold;
    margin-right: 12px;
  }

  .slots {
    color: #666;
    font-size: 14px;

    span {
      color: #ff4d4f;
      font-weight: bold;
    }
  }
}

.category {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .deadline {
    color: #999;
  }
}

.tags {
  display: flex;
  gap: 8px;

  .taskType {
    // 使用 :global 来覆盖 Vant 组件的默认样式
    :global {
      .van-tag {
        padding: 0 8px;
      }
    }
  }

  .followers {
    // 使用 :global 来覆盖 Vant 组件的默认样式
    :global {
      .van-tag {
        padding: 0 8px;
      }
    }
  }
}

.image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
}
</style> 