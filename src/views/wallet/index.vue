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
          <span :class="$style.label">账户余额</span>
          <span :class="$style.value">${{ balance }}</span>
        </div>
        <van-button 
          type="primary" 
          block 
          :class="$style.withdrawBtn"
          @click="onWithdrawClick"
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
          @click="router.push('/wallet/accounts')"
        >
          <div :class="$style.menuTitle">
            <van-icon name="card" />
            <span>提现账户</span>
          </div>
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const balance = ref(1234.56)

const onClickLeft = () => {
  router.back()
}

const onWithdrawClick = () => {
  showToast('提现功能开发中')
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
</style> 