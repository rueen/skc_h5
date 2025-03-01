<template>
  <div :class="$style.recordsPage">
    <van-nav-bar
      title="提现记录"
      left-arrow
      @click-left="onClickLeft"
      :class="$style.navbar"
      fixed
    />

    <div :class="$style.content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div :class="$style.recordList">
            <div 
              v-for="record in records" 
              :key="record.id"
              :class="$style.recordItem"
            >
              <div :class="$style.recordInfo">
                <div :class="$style.recordTitle">提现到{{ record.account }}</div>
                <div :class="$style.recordTime">{{ record.time }}</div>
              </div>
              <div :class="$style.recordStatus">
                <div :class="$style.recordAmount">-${{ record.amount }}</div>
                <div :class="[$style.status, $style[record.status]]">{{ getStatusText(record.status) }}</div>
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
import { useRouter } from 'vue-router'

const router = useRouter()

// 列表数据
const records = ref([
  {
    id: 1,
    account: '工商银行(1234)',
    time: '2025-02-25 15:30',
    amount: '100.00',
    status: 'success'
  },
  {
    id: 2,
    account: '支付宝(5678)',
    time: '2025-02-24 14:20',
    amount: '50.00',
    status: 'pending'
  },
  {
    id: 3,
    account: '微信(9012)',
    time: '2025-02-23 10:10',
    amount: '200.00',
    status: 'failed'
  }
])

// 列表状态
const loading = ref(false)
const finished = ref(true)
const refreshing = ref(false)

// 状态文案
const getStatusText = (status) => {
  const statusMap = {
    success: '提现成功',
    pending: '处理中',
    failed: '提现失败'
  }
  return statusMap[status]
}

// 事件处理
const onClickLeft = () => {
  router.back()
}

const onLoad = () => {
  // 加载更多数据
  loading.value = false
}

const onRefresh = () => {
  // 刷新数据
  refreshing.value = false
}
</script>

<style lang="less" module>
.recordsPage {
  min-height: 100vh;
  background: #f7f8fa;
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

.content {
  padding: 12px;
}

.recordList {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.recordItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f5f6f7;

  &:last-child {
    border-bottom: none;
  }
}

.recordInfo {
  flex: 1;
  margin-right: 12px;
}

.recordTitle {
  font-size: 14px;
  color: #323233;
  margin-bottom: 4px;
}

.recordTime {
  font-size: 12px;
  color: #969799;
}

.recordStatus {
  text-align: right;
}

.recordAmount {
  font-size: 16px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 4px;
}

.status {
  font-size: 12px;

  &.success {
    color: #07c160;
  }

  &.pending {
    color: #ff976a;
  }

  &.failed {
    color: #ff4d4f;
  }
}
</style> 