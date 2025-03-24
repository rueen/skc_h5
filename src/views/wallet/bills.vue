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
        >
          <div :class="$style.billList">
            <div 
              v-for="bill in list" 
              :key="bill.id"
              :class="$style.billItem"
            >
              <div :class="$style.billInfo">
                <div :class="$style.billTitle">{{ enumStore.getEnumText('BillType', bill.billType) }}</div>
                <div :class="$style.billTime">{{ bill.createTime }}</div>
              </div>
              <div :class="$style.billAmount">
                {{ bill.amount }}
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
}
</style> 