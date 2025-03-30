<template>
  <Layout>
    <nav-bar
      title="结算账单"
      left-arrow
      fixed
    />

    <div :class="$style.content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
        >
          <div :class="$style.recordList">
            <div
              v-for="bill in list" 
              :key="bill.id"
              :class="$style.recordItem"
            >
              <div :class="$style.recordItemWrapper">
                <div :class="$style.recordInfo">
                  <div :class="$style.title">{{ enumStore.getEnumText('BillType', bill.billType) }}</div>
                  <div :class="$style.time">{{ bill.createTime }}</div>
                </div>
                <div :class="$style.rightWrapper">
                  <div :class="$style.amount">{{ bill.amount }}</div>
                  <div :class="[$style.status, $style[bill.withdrawalStatus]]" v-if="bill.billType === 'withdrawal'">
                    {{ enumStore.getEnumText('WithdrawalStatus', bill.withdrawalStatus) }}
                  </div>
                  <div :class="[$style.status, $style[bill.settlementStatus]]" v-else>
                    {{ enumStore.getEnumText('SettlementStatus', bill.settlementStatus) }}
                  </div>
                </div>
              </div>
              <div :class="$style.reason" v-if="bill.settlementStatus === 'failed' || bill.withdrawalStatus === 'failed'">
                失败原因：{{ bill.failureReason }}
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Layout from '@/components/layout.vue'
import { get } from '@/utils/request'
import { useEnumStore } from '@/stores'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const enumStore = useEnumStore()

// 列表数据
const page = ref(1)
const pageSize = ref(10)
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

const onLoad = async () => {
  if (refreshing.value) {
    list.value = []
    refreshing.value = false
  }
  const res = await get('member.bills', {
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

const onRefresh = () => {
  // 刷新数据
  refreshing.value = false
}

// 初始化
onMounted(async () => {
  await onLoad()
})
</script>

<style lang="less" module>
.content {
  padding: 12px;
}

.recordList {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.recordItem {
  border-bottom: 1px solid #f5f6f7;
  padding: 16px;

  &:last-child {
    border-bottom: none;
  }

  .recordItemWrapper{
    display: flex;
    align-items: center;
    justify-content: space-between;

    .recordInfo {
      flex: 1;
      margin-right: 12px;
    }

    .title {
      font-size: 14px;
      color: #323233;
      margin-bottom: 4px;
    }

    .time {
      font-size: 12px;
      color: #969799;
    }
    .rightWrapper {
      text-align: right;

      .amount {
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
    }
  }

  .reason {
    font-size: 12px;
    color: #ff4d4f;
    text-align: right;
  }
}
</style> 