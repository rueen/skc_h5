<!--
 * @Author: diaochan
 * @Date: 2025-02-25 15:00:45
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-03 11:29:01
 * @Description: 我的邀请人列表页
 -->
<template>
  <div :class="$style.invitesPage">
    <!-- 顶部导航 -->
    <van-nav-bar
      title="邀请好友"
      left-arrow
      @click-left="onClickLeft"
      :class="$style.navbar"
      fixed
    />

    <!-- 邀请统计 -->
    <div :class="$style.statsCard">
      <div :class="$style.statsItem">
        <div :class="$style.label">累计邀请</div>
        <div :class="$style.value">{{ stats.totalInvites }}人</div>
      </div>
      <div :class="$style.statsItem">
        <div :class="$style.label">邀请奖励</div>
        <div :class="$style.value">${{ stats.totalRewards }}</div>
      </div>
    </div>

    <!-- 邀请列表 -->
    <div :class="$style.content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div :class="$style.inviteList">
            <div 
              v-for="invite in invites" 
              :key="invite.id"
              :class="$style.inviteItem"
            >
              <div :class="$style.userInfo">
                <van-image
                  round
                  width="40"
                  height="40"
                  :src="invite.avatar"
                />
                <div :class="$style.userMeta">
                  <div :class="$style.userName">{{ invite.name }}</div>
                  <div :class="$style.inviteTime">{{ invite.time }}</div>
                </div>
              </div>
              <div :class="$style.reward">+${{ invite.reward }}</div>
            </div>
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

// 统计数据
const stats = ref({
  totalInvites: 128,
  totalRewards: '1,280.00'
})

// 列表数据
const invites = ref([
  {
    id: 1,
    name: '李四',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    time: '2025-02-25 15:30',
    reward: '10.00'
  },
  {
    id: 2,
    name: '王五',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    time: '2025-02-24 14:20',
    reward: '10.00'
  }
])

// 列表状态
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

// 事件处理
const onClickLeft = () => {
  router.back()
}

const onLoad = () => {
  loading.value = false
}

const onRefresh = () => {
  refreshing.value = false
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

.statsCard {
  margin: 12px;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-around;
}

.statsItem {
  text-align: center;

  .label {
    font-size: 14px;
    color: #969799;
    margin-bottom: 8px;
  }

  .value {
    font-size: 20px;
    color: #323233;
    font-weight: 500;
  }
}

.content {
  padding: 0 12px;
}

.inviteList {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.inviteItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f5f6f7;

  &:last-child {
    border-bottom: none;
  }
}

.userInfo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.userMeta {
  .userName {
    font-size: 14px;
    color: #323233;
    margin-bottom: 4px;
  }

  .inviteTime {
    font-size: 12px;
    color: #969799;
  }
}

.reward {
  font-size: 16px;
  color: #ee0a24;
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