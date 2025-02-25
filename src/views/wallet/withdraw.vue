<template>
  <div :class="$style.withdrawPage">
    <van-nav-bar
      title="提现"
      left-arrow
      @click-left="onClickLeft"
      :class="$style.navbar"
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
          可提现余额：$1234.56
          <span :class="$style.all" @click="onWithdrawAll">全部提现</span>
        </div>
      </div>

      <!-- 提现账户 -->
      <div :class="$style.formGroup">
        <div :class="$style.formItem" @click="showAccountPicker = true">
          <span :class="$style.label">提现账户</span>
          <div :class="$style.value">
            <span :class="$style.text">{{ selectedAccount ? `${selectedAccount.name} (${selectedAccount.number})` : '请选择' }}</span>
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

    <!-- 账户选择器 -->
    <van-popup
      v-model:show="showAccountPicker"
      position="bottom"
      round
    >
      <van-picker
        :columns="accountColumns"
        @confirm="onAccountConfirm"
        @cancel="showAccountPicker = false"
        :default-index="defaultAccountIndex"
        show-toolbar
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 表单数据
const form = ref({
  amount: '',
  accountId: ''
})

// 账户数据
const accounts = ref([
  {
    id: 1,
    name: '工商银行',
    number: '****1234'
  },
  {
    id: 2,
    name: '建设银行',
    number: '****5678'
  }
])

// 账户选择器
const showAccountPicker = ref(false)
const selectedAccount = ref(accounts.value[0])
form.value.accountId = selectedAccount.value?.id

// 账户选择器数据
const accountColumns = computed(() => {
  return accounts.value.map(account => ({
    text: `${account.name} (${account.number})`,
    value: account
  }))
})

const defaultAccountIndex = ref(0)

// 事件处理
const onClickLeft = () => {
  router.back()
}

const onWithdrawAll = () => {
  form.value.amount = '1234.56'
}

const onAccountConfirm = (value) => {
  selectedAccount.value = value.selectedOptions[0].value
  form.value.accountId = selectedAccount.value.id
  showAccountPicker.value = false
}

const onSubmit = () => {
  if (!form.value.amount) {
    showToast('请输入提现金额')
    return
  }
  if (!form.value.accountId) {
    showToast('请选择提现账户')
    return
  }

  showToast('提现申请已提交')
  router.back()
}
</script>

<style lang="less" module>
.withdrawPage {
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