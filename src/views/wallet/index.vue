<template>
  <Layout>
    <van-nav-bar
      title="我的钱包"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />

    <div :class="$style.content">
      <!-- 账户余额 -->
      <div :class="$style.balance">
        <div :class="$style.amount">
          <div :class="$style.label">可提现余额</div>
          <div :class="$style.value">{{ balance }}</div>
        </div>
        <van-button 
          type="primary" 
          block
          :class="$style.withdrawBtn"
          @click="onWithdraw"
        >
          提现
        </van-button>
      </div>

      <!-- 功能列表 -->
      <div :class="$style.menuList">
        <div 
          :class="$style.menuItem"
          @click="router.push('/wallet/bills')"
        >
          <div :class="$style.menuTitle">
            <van-icon name="balance-list-o" />
            <span>结算账单</span>
          </div>
          <van-icon name="arrow" />
        </div>

        <div 
          :class="$style.menuItem"
          @click="router.push('/wallet/records')"
        >
          <div :class="$style.menuTitle">
            <van-icon name="records" />
            <span>提现记录</span>
          </div>
          <van-icon name="arrow" />
        </div>

        <div 
          :class="$style.menuItem"
          @click="onCheckAccount"
        >
          <div :class="$style.menuTitle">
            <van-icon name="credit-pay" />
            <span>提现账户</span>
          </div>
          <div :class="$style.menuValue">
            <template v-if="hasAccount">
              <span :class="$style.text">{{ enumStore.getEnumText('WithdrawalAccountType', withdrawalAccount.accountType) }}</span>
              <span :class="$style.accountDetail">{{ withdrawalAccount.account }}</span>
            </template>
            <template v-else>
              <span :class="$style.text">未设置</span>
            </template>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import Layout from '@/components/layout.vue'
import { get } from '@/utils/request'
import { useEnumStore } from '@/stores'

const enumStore = useEnumStore()
const router = useRouter()

// 余额
const balance = ref(0)
// 提现账户
const withdrawalAccount = ref(null)
const hasAccount = computed(() => !!withdrawalAccount.value)

// 事件处理
const onClickLeft = () => {
  router.back()
}

const onWithdraw = () => {
  if (!hasAccount.value) {
    showToast('请先设置提现账户')
    return
  }
  router.push('/wallet/withdraw')
}

const onCheckAccount = () => {
  if (hasAccount.value) {
    // 如果已有账户，跳转到预览页面
    router.push({
      path: '/wallet/accounts',
      query: { mode: 'preview' }
    })
  } else {
    // 如果没有账户，跳转到添加页面
    router.push({
      path: '/wallet/accounts',
      query: { mode: 'add' }
    })
  }
}

const getBalance = async () => {
  const res = await get('member.balance')
  if(res.code === 0){
    balance.value = res.data.balance
  }
}

// 获取提现账户
const getWithdrawalAccount = async () => {
  const res = await get('withdrawals.accounts')
  if(res.code === 0 && res.data.length > 0){
    withdrawalAccount.value = res.data[0]
  }
}

// 初始化
onMounted(async () => {
  getBalance()
  getWithdrawalAccount()
})
</script>

<style lang="less" module>
.content {
  padding: 12px;
}

.balance {
  background: #fff;
  border-radius: 8px;
  padding: 20px 16px;
  margin-bottom: 12px;
}

.amount {
  text-align: center;
  margin-bottom: 24px;

  .label {
    font-size: 14px;
    color: #969799;
    display: block;
    margin-bottom: 8px;
  }

  .value {
    font-size: 32px;
    font-weight: 500;
    color: #323233;
  }
}

.withdrawBtn {
  --van-button-primary-background: var(--van-primary-color);
}

.menuList {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.menuItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid #f5f6f7;

  &:last-child {
    border-bottom: none;
  }

  .menuTitle {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #323233;

    .van-icon {
      font-size: 18px;
      color: var(--van-primary-color);
    }
  }

  .van-icon {
    font-size: 16px;
    color: #969799;
  }
}

.menuValue {
  display: flex;
  align-items: center;
  gap: 4px;

  .text {
    font-size: 14px;
    color: #323233;
  }

  .accountDetail {
    font-size: 14px;
    color: #969799;
    margin-left: 8px;
  }

  .van-icon {
    color: #969799;
    font-size: 16px;
  }
}
</style> 