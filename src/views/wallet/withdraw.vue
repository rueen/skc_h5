<template>
  <Layout>
    <nav-bar
      :title="$t('wallet.withdraw.title')"
      left-arrow
      fixed
    />

    <div :class="$style.content">
      <!-- 提现金额 -->
      <div :class="$style.amountSection">
        <div :class="$style.label">{{ $t('wallet.withdraw.amount') }}</div>
        <div :class="$style.input">
          <van-field
            v-model="form.amount"
            type="digit"
            :placeholder="$t('wallet.withdraw.amountPlaceholder')"
            :class="$style.amountInput"
          />
        </div>
        <div :class="$style.balance">
          <span>{{ $t('wallet.withdraw.withdrawThreshold') }}：{{ withdrawThreshold }}</span>
          <span>{{ $t('wallet.withdraw.withdrawableBalance') }}：{{ balance }}</span>
          <span :class="$style.all" @click="onWithdrawAll">{{ $t('wallet.withdraw.withdrawAll') }}</span>
        </div>
      </div>

      <!-- 提现账户 -->
      <div :class="$style.formGroup">
        <div 
          :class="$style.formItem"
          @click="onAccountClick"
        >
          <span :class="$style.label">{{ $t('wallet.withdraw.withdrawAccount') }}</span>
          <div :class="$style.value">
            <template v-if="hasAccount">
              <span :class="$style.text">{{ withdrawalAccount.paymentChannelName }}</span>
              <span :class="$style.accountDetail">{{ withdrawalAccount.account }}</span>
            </template>
            <template v-else>
              <span :class="$style.text">{{ $t('wallet.withdraw.notSet') }}</span>
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
        {{ $t('wallet.withdraw.confirmWithdraw') }}
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
import NavBar from '@/components/NavBar.vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

// 提现门槛
const withdrawThreshold = ref(0)
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
  if (!hasAccount.value) {
    showToast(t('wallet.withdraw.pleaseSetWithdrawalAccount'))
    return
  }
  if (!form.value.amount) {
    showToast(t('wallet.withdraw.pleaseEnterWithdrawalAmount'))
    return
  }
  // 余额不足
  if (balance.value - form.value.amount < 0) {
    showToast(t('wallet.withdraw.insufficientBalance'))
    return
  }
  // 提现金额不能小于提现门槛 
  if (form.value.amount - withdrawThreshold.value < 0) {
    showToast(`${t('wallet.withdraw.withdrawalAmountLessThanThreshold')} ${withdrawThreshold.value}`)
    return
  }
  const res = await post('withdrawals.apply', {
    withdrawalAccountId: withdrawalAccount.value.id,
    amount: form.value.amount
  })
  if(res.code === 0){
    showToast(t('wallet.withdraw.withdrawalApplicationSubmitted'))
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

// 获取系统配置
const getSystemConfigs = async () => {
  const res = await get('systemConfig.list')
  if(res.code === 0){
    withdrawThreshold.value = res.data.find(item => item.config_key === 'withdrawal_threshold').config_value
  }
}

// 初始化
onMounted(async () => {
  await getSystemConfigs()
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