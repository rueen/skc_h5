<template>
  <Layout>
    <van-nav-bar
      title="提现记录"
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
        >
          <div :class="$style.recordList">
            <div 
              v-for="record in list" 
              :key="record.id"
              :class="$style.recordItem"
            >
              <div :class="$style.recordInfo">
                <div :class="$style.recordTitle">提现到{{ record.account }}</div>
                <div :class="$style.recordTime">{{ record.createTime }}</div>
              </div>
              <div :class="$style.recordStatus">
                <div :class="$style.recordAmount">{{ record.amount }}</div>
                <div :class="[$style.status, $style[record.withdrawalStatus]]">{{ enumStore.getEnumText('WithdrawalStatus', record.withdrawalStatus) }}</div>
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

const router = useRouter()
const enumStore = useEnumStore()

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