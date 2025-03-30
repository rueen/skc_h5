<template>
  <Layout>
    <nav-bar
      title="提现"
      left-arrow
      fixed
    />

    <div :class="$style.content">
      <!-- 提现金额 -->
      <div :class="$style.amountSection">
        <div :class="$style.label">提现金额</div>
        <div :class="$style.input">
          <span :class="$style.currency">$</span>
          <van-field
            v-model="form.amount"
            type="digit"
            placeholder="请输入提现金额"
            :class="$style.amountInput"
          />
        </div>
        <div :class="$style.balance">
          可提现余额：$ {{ balance }}
          <span :class="$style.all" @click="onWithdrawAll">全部提现</span>
        </div>
      </div>

      <!-- 提现账户 -->
      <div :class="$style.formGroup">
        <div 
          :class="$style.formItem"
          @click="onAccountClick"
        >
          <span :class="$style.label">提现账户</span>
          <div :class="$style.value">
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

      <!-- 提现按钮 -->
      <van-button 
        block 
        type="primary"
        :class="$style.withdrawBtn"
        @click="onSubmit"
      >
        确认提现
      </van-button>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import Layout from '@/components/layout.vue'
import { get, post } from '@/utils/request'
import { useEnumStore } from '@/stores'
import NavBar from '@/components/NavBar.vue'

const enumStore = useEnumStore()
const router = useRouter()

const balance = ref(0)
// 表单数据
const form = ref({
  amount: '',
})

// 账户信息
const withdrawalAccount = ref(null)
const hasAccount = computed(() => !!withdrawalAccount.value)

const onWithdrawAll = () => {
  form.value.amount = balance.value
}

const onAccountClick = () => {
  if (hasAccount.value) {
    router.push({
      path: '/wallet/accounts',
      query: { mode: 'preview' }
    })
  } else {
    router.push({
      path: '/wallet/accounts',
      query: { mode: 'add' }
    })
  }
}

const onSubmit = async () => {
  if (!form.value.amount) {
    showToast('请输入提现金额')
    return
  }
  if (!hasAccount.value) {
    showToast('请先设置提现账户')
    return
  }
  const res = await post('withdrawals.apply', {
    withdrawalAccountId: withdrawalAccount.value.id,
    amount: form.value.amount
  })
  if(res.code === 0){
    showToast('提现申请已提交')
    router.back()
  } else {
    showToast(res.message)
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

.amountSection {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.label {
  font-size: 14px;
  color: #323233;
  margin-bottom: 16px;
}

.input {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.currency {
  font-size: 24px;
  color: #323233;
  margin-right: 8px;
}

.amountInput {
  flex: 1;
  padding: 0;
  background: transparent;

  :global {
    .van-field__control {
      font-size: 24px;
      color: #323233;
    }
  }
}

.balance {
  font-size: 12px;
  color: #969799;
}

.all {
  color: var(--van-primary-color);
  margin-left: 8px;
  cursor: pointer;
}

.formGroup {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}

.formItem {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;

  .label {
    width: 80px;
    font-size: 14px;
    color: #323233;
    margin-bottom: 0;
  }

  .value {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
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
}

.withdrawBtn {
  margin-top: 24px;
  --van-button-primary-background: var(--van-primary-color);
}
</style> 