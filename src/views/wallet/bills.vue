<template>
  <Layout>
    <van-nav-bar
      title="结算账单"
      left-arrow
      @click-left="onClickLeft"
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
          <div :class="$style.billList">
            <div 
              v-for="bill in bills" 
              :key="bill.id"
              :class="$style.billItem"
            >
              <div :class="$style.billInfo">
                <div :class="$style.billTitle">{{ bill.title }}</div>
                <div :class="$style.billTime">{{ bill.time }}</div>
              </div>
              <div :class="[$style.billAmount, bill.type === 'income' ? $style.income : $style.expense]">
                {{ bill.type === 'income' ? '+' : '-' }}${{ bill.amount }}
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </Layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Layout from '@/components/layout.vue'

const router = useRouter()

// 列表数据
const bills = ref([
  {
    id: 1,
    title: '任务收益',
    time: '2025-02-25 15:30',
    amount: '100.00',
    type: 'income'
  },
  {
    id: 2,
    title: '提现',
    time: '2025-02-24 14:20',
    amount: '50.00',
    type: 'expense'
  }
])

// 列表状态
const loading = ref(false)
const finished = ref(true)
const refreshing = ref(false)

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
.content {
  padding: 12px;
}

.billList {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.billItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f5f6f7;

  &:last-child {
    border-bottom: none;
  }
}

.billInfo {
  flex: 1;
  margin-right: 12px;
}

.billTitle {
  font-size: 14px;
  color: #323233;
  margin-bottom: 4px;
}

.billTime {
  font-size: 12px;
  color: #969799;
}

.billAmount {
  font-size: 16px;
  font-weight: 500;

  &.income {
    color: #07c160;
  }

  &.expense {
    color: #ff4d4f;
  }
}
</style> 