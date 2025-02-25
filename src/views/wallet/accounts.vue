<template>
  <div :class="$style.accountsPage">
    <van-nav-bar
      title="提现账户"
      left-arrow
      @click-left="onClickLeft"
      :class="$style.navbar"
      fixed
    />

    <div :class="$style.content">
      <div :class="$style.accountList">
        <div 
          v-for="account in accounts" 
          :key="account.id"
          :class="$style.accountItem"
        >
          <div :class="$style.accountInfo">
            <van-icon :name="getAccountIcon(account.type)" :class="$style.icon" />
            <div :class="$style.detail">
              <div :class="$style.name">{{ account.name }}</div>
              <div :class="$style.number">{{ account.number }}</div>
            </div>
          </div>
          <div :class="$style.actions">
            <van-button 
              size="small" 
              :class="$style.deleteBtn"
              @click="onDeleteClick(account)"
            >
              删除
            </van-button>
          </div>
        </div>
      </div>

      <van-button 
        block 
        type="primary"
        :class="$style.addBtn"
        @click="onAddClick"
      >
        添加提现账户
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showDialog, showToast } from 'vant'

const router = useRouter()

// 账户数据
const accounts = ref([
  {
    id: 1,
    type: 'bank',
    name: '工商银行',
    number: '****1234'
  },
  {
    id: 2,
    type: 'alipay',
    name: '支付宝',
    number: '****5678'
  },
  {
    id: 3,
    type: 'wechat',
    name: '微信',
    number: '****9012'
  }
])

// 获取账户图标
const getAccountIcon = (type) => {
  const iconMap = {
    bank: 'balance-o',
    alipay: 'alipay',
    wechat: 'wechat'
  }
  return iconMap[type]
}

// 事件处理
const onClickLeft = () => {
  router.back()
}

const onAddClick = () => {
  showToast('添加账户功能开发中')
}

const onDeleteClick = (account) => {
  showDialog({
    title: '确认删除',
    message: `确定要删除${account.name}账户吗？`,
    showCancelButton: true
  }).then(() => {
    accounts.value = accounts.value.filter(item => item.id !== account.id)
    showToast('删除成功')
  })
}
</script>

<style lang="less" module>
.accountsPage {
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

.accountList {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
}

.accountItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f5f6f7;

  &:last-child {
    border-bottom: none;
  }
}

.accountInfo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  font-size: 24px;
  color: var(--van-primary-color);
}

.detail {
  .name {
    font-size: 14px;
    color: #323233;
    margin-bottom: 4px;
  }

  .number {
    font-size: 12px;
    color: #969799;
  }
}

.deleteBtn {
  --van-button-default-background: #fff;
  --van-button-default-border-color: #ff4d4f;
  --van-button-default-color: #ff4d4f;
}

.addBtn {
  --van-button-primary-background: var(--van-primary-color);
}
</style> 