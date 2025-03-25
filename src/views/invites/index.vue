<!--
 * @Author: diaochan
 * @Date: 2025-02-25 15:00:45
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-25 11:10:05
 * @Description: 我的邀请人列表页
 -->
<template>
  <Layout :class="$style.invitesPage">
    <!-- 顶部导航 -->
    <van-nav-bar
      title="邀请好友"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />

    <!-- 邀请统计 -->
    <div :class="$style.statsCard">
      <div :class="$style.statsItem">
        <div :class="$style.label">累计邀请</div>
        <div :class="$style.value">{{ stats.inviteCount }}人</div>
      </div>
      <div :class="$style.statsItem">
        <div :class="$style.label">邀请奖励</div>
        <div :class="$style.value">{{ stats.totalReward }}</div>
      </div>
    </div>

    <!-- 邀请列表 -->
    <div :class="$style.content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
        >
          <div :class="$style.inviteList">
            <div 
              v-for="invite in list" 
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
                  <div :class="$style.userName">{{ invite.nickname }}</div>
                  <div :class="$style.inviteTime">{{ invite.inviteTime }}</div>
                </div>
              </div>
              <div :class="$style.reward">+{{ invite.inviteReward }}</div>
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
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { shareInviteLink } from '@/utils/share'
import Layout from '@/components/layout.vue'
import { get } from '@/utils/request'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 统计数据
const stats = ref({
  inviteCount: 0,       // 累计邀请人数
  totalReward: 0.00     // 累计邀请奖励（单位：元）
})

// 列表数据
const page = ref(1)
const pageSize = ref(10)
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

// 事件处理
const onClickLeft = () => {
  router.back()
}

// 下拉刷新
const onRefresh = () => {
  finished.value = false
  loading.value = true
  loadStats()
  loadList()
}

const loadStats = async () => {
  const res = await get('invite.stats')
  stats.value = res.data
}

const loadList = async () => {
  if (refreshing.value) {
    list.value = []
    refreshing.value = false
  }
  const res = await get('invite.list', {
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
}

const onInvite = () => {
  // 获取当前用户的邀请码
  const inviteCode = userStore.inviteCode
  // 使用分享工具方法生成并复制邀请链接
  shareInviteLink(`/login`, inviteCode)
}

// 初始化
onMounted(async () => {
  loadStats()
  loadList()
})
</script>

<style lang="less" module>
.invitesPage {
  padding-bottom: 80px;
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