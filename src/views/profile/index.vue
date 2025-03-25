<template>
  <div :class="$style.profilePage">
    <!-- 用户信息 -->
    <div :class="$style.userInfo" @click="router.push('/profile/edit')">
      <div :class="$style.userHeader">
        <avatar :avatar="userInfo.avatar" width="50px" height="50px" round />
        <div :class="$style.userMeta">
          <div :class="$style.userName">{{ userInfo.memberNickname || '未登录' }}</div>
          <div :class="$style.userId">账号: {{ userInfo.memberAccount || '---' }}</div>
        </div>
      </div>
      <van-icon name="arrow" :class="$style.arrow" />
    </div>

    <!-- 收益信息 -->
    <div :class="$style.earnings">
      <div :class="$style.earningItem">
        <div :class="$style.label">已提现</div>
        <div :class="$style.amount">${{ userInfo.totalEarnings }}</div>
      </div>
      <div :class="$style.earningItem">
        <div :class="$style.label">可提现</div>
        <div :class="$style.amount">${{ userInfo.availableBalance }}</div>
      </div>
    </div>

    <!-- 功能列表 -->
    <div :class="$style.menuList">
      <div 
        :class="$style.menuItem"
        @click="router.push('/wallet')"
      >
        <div :class="$style.menuTitle">
          <van-icon name="balance-o" />
          <span>我的钱包</span>
        </div>
        <van-icon name="arrow" />
      </div>

      <div 
        :class="$style.menuItem"
        @click="router.push('/social')"
      >
        <div :class="$style.menuTitle">
          <van-icon name="user-circle-o" />
          <span>我的账号</span>
        </div>
        <van-icon name="arrow" />
      </div>

      <div 
        :class="$style.menuItem"
        @click="router.push('/invites')"
      >
        <div :class="$style.menuTitle">
          <van-icon name="friends-o" />
          <span>邀请好友</span>
        </div>
        <van-icon name="arrow" />
      </div>

      <div 
        :class="$style.menuItem"
        @click="router.push('/groups')"
      >
        <div :class="$style.menuTitle">
          <van-icon name="friends-o" />
          <span>我的小组</span>
        </div>
        <van-icon name="arrow" />
      </div>

      <div 
        :class="$style.menuItem"
        @click="router.push('/settings')"
      >
        <div :class="$style.menuTitle">
          <van-icon name="setting-o" />
          <span>设置</span>
        </div>
        <van-icon name="arrow" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import avatar from '@/components/avatar.vue'

const router = useRouter()
const userStore = useUserStore()

// 用户信息
const userInfo = userStore.userInfo

// 页面加载时获取用户信息
onMounted(async () => {

})
</script>

<style lang="less" module>
.profilePage {
  min-height: 100vh;
  background: #f7f8fa;
  padding: 12px;
}

.userInfo {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.userHeader {
  display: flex;
  align-items: center;
  gap: 12px;
}

.userMeta {
  .userName {
    font-size: 16px;
    color: #323233;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .userId {
    font-size: 12px;
    color: #969799;
  }
}

.arrow {
  color: #969799;
  font-size: 16px;
}

.earnings {
  margin-top: 12px;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-around;
}

.earningItem {
  text-align: center;

  .label {
    font-size: 14px;
    color: #969799;
    margin-bottom: 8px;
  }

  .amount {
    font-size: 20px;
    color: #323233;
    font-weight: 500;
  }
}

.menuList {
  margin-top: 12px;
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

  &:not(:last-child) {
    border-bottom: 1px solid #f5f6f7;
  }

  .menuTitle {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #323233;

    .van-icon {
      font-size: 20px;
      color: var(--van-primary-color);
    }
  }

  .van-icon[name="arrow"] {
    color: #969799;
    font-size: 16px;
  }
}
</style> 