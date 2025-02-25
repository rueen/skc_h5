<!--
 * @Author: diaochan
 * @Date: 2025-02-25 15:00:45
 * @LastEditors: rueen
 * @LastEditTime: 2025-02-25 15:40:23
 * @Description: 我的邀请人列表页
 -->
<template>
  <div :class="$style.invitesPage">
    <!-- 顶部导航 -->
    <van-nav-bar
      title="我的邀请人"
      left-arrow
      @click-left="onClickLeft"
      :class="$style.navbar"
      fixed
    />

    <!-- 表头 -->
    <div :class="$style.tableHeader">
      <span>用户列表</span>
      <span>邀请奖励</span>
    </div>

    <!-- 列表内容 -->
    <div :class="$style.content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
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
            <div :class="$style.userInfo">
              <van-image
                round
                width="40"
                height="40"
                :src="item.avatar"
              />
              <div :class="$style.userMeta">
                <div :class="$style.userName">{{ item.name }}</div>
                <div :class="$style.date">{{ item.date }}</div>
              </div>
            </div>
            <div :class="$style.reward">${{ item.reward }}</div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 底部按钮 -->
    <div :class="$style.footer">
      <van-button 
        type="primary" 
        block
        @click="onInvite"
      >
        去邀请好友
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const list = ref([
  {
    id: 1,
    name: '爱可可的故事',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    date: '2022-03-25',
    reward: '15.00'
  },
  {
    id: 2,
    name: '迷谷讲历史',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    date: '2025-04-25',
    reward: '15.00'
  },
  {
    id: 3,
    name: '新鲜事',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    date: '2025-02-25',
    reward: '15.00'
  },
  {
    id: 4,
    name: '新鲜事体育',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    date: '2025-04-25',
    reward: '00.00'
  }
])

const onClickLeft = () => {
  router.back()
}

const onLoad = () => {
  // 模拟加载更多
  setTimeout(() => {
    if (refreshing.value) {
      list.value = []
      refreshing.value = false
    }

    for (let i = 0; i < 4; i++) {
      list.value.push({
        id: list.value.length + 1,
        name: '新邀请用户' + (list.value.length + 1),
        avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        date: '2025-02-25',
        reward: '15.00'
      })
    }
    loading.value = false

    if (list.value.length >= 20) {
      finished.value = true
    }
  }, 1000)
}

const onRefresh = () => {
  finished.value = false
  loading.value = true
  onLoad()
}

const onInvite = () => {
  showToast('邀请功能开发中')
}
</script>

<style lang="less" module>
.invitesPage {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 80px;
  padding-top: 46px;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  max-width: 750px;
  margin: 0 auto;

  :global {
    .van-nav-bar {
      background: #fff;
    }

    .van-nav-bar__title {
      color: #323233;
      font-size: 16px;
    }

    .van-nav-bar__arrow {
      color: #323233;
      font-size: 18px;
    }
  }
}

.tableHeader {
  position: fixed;
  top: 46px;
  left: 0;
  right: 0;
  z-index: 99;
  background: #fff;
  display: flex;
  justify-content: space-between;
  padding: 12px 24px;
  font-size: 14px;
  color: #323232;
  border-bottom: 1px solid #f5f6f7;
  max-width: 750px;
  margin: 0 auto;
}

.content {
  padding: 0 12px;
  margin-top: 55px;
}

.listItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
}

.userInfo {
  display: flex;
  align-items: center;
}

.userMeta {
  margin-left: 12px;
}

.userName {
  font-size: 14px;
  color: #323233;
  margin-bottom: 4px;
}

.date {
  font-size: 12px;
  color: #969799;
}

.reward {
  font-size: 15px;
  color: #ff4d4f;
  font-weight: 500;
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
}
</style> 