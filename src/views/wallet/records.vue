<template>
  <Layout>
    <nav-bar
      :title="$t('wallet.records.title')"
      left-arrow
      fixed
    />

    <div :class="$style.content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-empty image="search" v-if="list.length === 0" :description="$t('common.emptyText')" />
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="$t('common.finishedText')"
          v-else
        >
          <div :class="$style.recordList">
            <div 
              v-for="record in list" 
              :key="record.id"
              :class="$style.recordItem"
            >
              <div :class="$style.recordItemWrapper">
                <div :class="$style.recordInfo">
                  <div :class="$style.title">{{ $t('wallet.records.withdrawTo') }} {{ record.account }}</div>
                  <div :class="$style.time">{{ record.createTime }}</div>
                </div>
                <div :class="$style.rightWrapper">
                  <div :class="$style.amount">{{ record.amount }}</div>
                  <div :class="[$style.status, $style[record.withdrawalStatus]]">{{ enumStore.getEnumText('WithdrawalStatus', record.withdrawalStatus) }}</div>
                </div>
              </div>
              <div :class="$style.reason" v-if="record.withdrawalStatus === 'failed'">
                {{ record.rejectReason }}
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
import Layout from '@/components/layout.vue'
import { get } from '@/utils/request'
import { useEnumStore } from '@/stores'
import NavBar from '@/components/NavBar.vue'

const enumStore = useEnumStore()

// 列表数据
const page = ref(1)
const pageSize = ref(10)
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

// 下拉刷新
const onRefresh = () => {
  finished.value = false
  loading.value = true
  getWithdrawalRecords()
}

// 获取提现记录
const getWithdrawalRecords = async () => {
  const res = await get('withdrawals.records', {
    page: page.value,
    pageSize: pageSize.value,
  })
  if(res.code === 0){
    list.value = res.data.list
    loading.value = false
    finished.value = res.data.total <= list.value.length
    refreshing.value = false
    if (list.value.length >= res.data.total) {
      finished.value = true
    }
  }
}

onMounted(async () => {
  getWithdrawalRecords()
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