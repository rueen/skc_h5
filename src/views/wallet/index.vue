<template>
  <div :class="$style.walletPage">
    <van-nav-bar
      title="我的钱包"
      left-arrow
      @click-left="onClickLeft"
      :class="$style.navbar"
      fixed
    />

    <div :class="$style.content">
      <!-- 账户余额 -->
      <div :class="$style.balance">
        <div :class="$style.amount">
          <div :class="$style.label">可提现余额</div>
          <div :class="$style.value">${{ balance }}</div>
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
            <span :class="$style.accountText">
              {{ hasAccount ? accountInfo.label : '未设置' }}
            </span>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
    </div>

    <!-- 账户详情弹窗 -->
    <van-dialog
      v-model:show="showAccountDetail"
      title="提现账户"
      :show-cancel-button="false"
      confirm-button-text="修改账户"
      @confirm="onModifyAccount"
      :class="$style.accountDialog"
    >
      <div :class="$style.accountInfo">
        <div :class="$style.accountItem">
          <span :class="$style.label">账户类型</span>
          <span :class="$style.text">{{ accountInfo.label }}</span>
        </div>
        <div :class="$style.accountItem">
          <span :class="$style.label">账号</span>
          <span :class="$style.text">{{ accountInfo.account }}</span>
        </div>
        <div :class="$style.accountItem">
          <span :class="$style.label">姓名</span>
          <span :class="$style.text">{{ accountInfo.name }}</span>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 余额
const balance = ref('1,234.56')

// 账户信息
const accountInfo = ref({
  type: 'gcash',
  label: 'GCASH',
  account: '0912345678',
  name: '张三'
})

const hasAccount = computed(() => !!accountInfo.value)
const showAccountDetail = ref(false)

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

const onModifyAccount = () => {
  router.push('/wallet/accounts-add')
}
</script>

<style lang="less" module>
.walletPage {
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

  .accountText {
    font-size: 14px;
    color: #969799;
  }

  .van-icon {
    color: #969799;
    font-size: 16px;
  }
}

.accountDialog {
  :global {
    .van-dialog__header {
      padding: 16px;
      font-weight: 500;
    }
  }
}

.accountInfo {
  padding: 0 16px 16px;
}

.accountItem {
  display: flex;
  align-items: center;
  padding: 8px 0;

  .label {
    width: 70px;
    font-size: 14px;
    color: #969799;
  }

  .text {
    flex: 1;
    font-size: 14px;
    color: #323233;
  }
}
</style> 