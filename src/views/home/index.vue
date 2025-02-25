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
  { id: 1, title: '推荐商品1', desc: '这是一个很好的商品' },
  { id: 2, title: '推荐商品2', desc: '这是一个不错的商品' },
  { id: 3, title: '推荐商品3', desc: '这是一个很棒的商品' }
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
            finished-text="没有更多了"
            @load="onLoad"
          >
            <div 
              v-for="item in list"
              :key="item.id"
              :class="$style.listItem"
            >
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
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

  h3 {
    margin: 0;
    font-size: 16px;
    color: #333;
    margin-bottom: 8px;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #666;
    line-height: 1.5;
  }
}
</style> 