<!--
 * @Author: diaochan
 * @Date: 2025-02-25 15:00:45
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-25 19:49:56
 * @Description: 我的邀请人列表页
 -->
<template>
  <Layout :class="$style.invitesPage">
    <!-- 顶部导航 -->
    <nav-bar
      :title="$t('invites.title')"
      left-arrow
      fixed
    />
    <!-- 邀请列表 -->
    <div :class="$style.refreshBox">
      <van-pull-refresh
        v-model="refreshing"
        :pulling-text="$t('common.pullingText')"
        :loosing-text="$t('common.loosingText')"
        @refresh="onRefresh"
      >
        <!-- 邀请统计 -->
        <div :class="$style.statsCard">
          <div :class="$style.statsItem">
            <div :class="$style.label">{{ $t('invites.inviteCount') }}</div>
            <div :class="$style.value">{{ stats.inviteCount }}</div>
          </div>
          <div :class="$style.statsItem">
            <div :class="$style.label">{{ $t('invites.totalReward') }}</div>
            <div :class="$style.value">{{ stats.totalReward }}</div>
          </div>
        </div>
        <div :class="$style.tips">
          <van-icon name="info-o" />
          {{ $t('invites.tips') }}
        </div>
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
        {{ $t('invites.buttonText') }}
      </van-button>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { shareInviteLink } from '@/utils/share'
import Layout from '@/components/layout.vue'
import { get } from '@/utils/request'
import { useUserStore } from '@/stores'
import NavBar from '@/components/NavBar.vue'
import { useI18n } from 'vue-i18n'

const userStore = useUserStore()
const { t } = useI18n()

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
const error = ref(false);

// 下拉刷新
const onRefresh = () => {
  page.value = 1
  list.value = []
  finished.value = false
  loading.value = true
  onLoad()
  loadStats()
}

const loadStats = async () => {
  const res = await get('invite.stats')
  stats.value = res.data
}

const onLoad = async () => {
  try {
    const res = await get('invite.list', {
      page: page.value,
      pageSize: pageSize.value,
    })
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

const onInvite = () => {
  // 获取当前用户的邀请码
  const inviteCode = userStore.inviteCode
  // 使用分享工具方法生成并复制邀请链接
  shareInviteLink(``, inviteCode)
}

// 初始化
onMounted(async () => {
  loadStats()
  onLoad()
})
</script>

<style lang="less" module>
.invitesPage {
  padding-bottom: 80px;
}
.refreshBox {
  padding: 12px;
  box-sizing: border-box;
  height: 99vh;
  overflow-y: scroll;
}

.statsCard {
  margin-bottom: 10px;
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

.tips {
  font-size: 12px;
  color: #E82134;
  text-align: center;
  background: #FFF3EE;
  border-radius: 8px 8px 0 0;
  padding: 10px;
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