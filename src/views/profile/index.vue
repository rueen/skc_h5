<template>
  <div :class="$style.profilePage">
    <!-- 用户信息 -->
    <div :class="$style.userInfo" @click="router.push('/profile/edit')">
      <div :class="$style.userHeader">
        <avatar :avatar="userInfo?.avatar" width="50px" height="50px" round />
        <div :class="$style.userMeta">
          <div :class="$style.userName">{{ userInfo?.nickname || $t('profile.index.notLogin') }}</div>
          <div :class="$style.userId">{{ $t('profile.index.account') }}: {{ userInfo.account || '---' }}</div>
        </div>
      </div>
      <van-icon name="arrow" :class="$style.arrow" />
    </div>

    <!-- 收益信息 -->
    <div :class="$style.earnings">
      <div :class="$style.earningItem">
        <div :class="$style.label">{{ $t('profile.index.withdrawn') }}</div>
        <div :class="$style.amount">{{ balanceInfo.withdrawalAmount }}</div>
      </div>
      <div :class="$style.earningItem" @click="router.push('/wallet')">
        <div :class="$style.label">{{ $t('profile.index.withdrawable') }}</div>
        <div :class="$style.amount">{{ balanceInfo.balance }}</div>
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
          <span>{{ $t('profile.index.wallet') }}</span>
        </div>
        <van-icon name="arrow" />
      </div>

      <div 
        :class="$style.menuItem"
        @click="router.push('/social')"
      >
        <div :class="$style.menuTitle">
          <van-icon name="user-circle-o" />
          <span>{{ $t('profile.index.myAccount') }}</span>
        </div>
        <van-icon name="arrow" />
      </div>

      <div 
        :class="$style.menuItem"
        @click="router.push('/invites')"
      >
        <div :class="$style.menuTitle">
          <van-icon name="friends-o" />
          <span>{{ $t('profile.index.myInvites') }}</span>
        </div>
        <van-icon name="arrow" />
      </div>

      <div 
        :class="$style.menuItem"
        @click="router.push('/groups')"
      >
        <div :class="$style.menuTitle">
          <van-icon name="friends-o" />
          <span>{{ $t('profile.index.myGroups') }}</span>
        </div>
        <van-icon name="arrow" />
      </div>

      <div 
        :class="$style.menuItem"
        @click="router.push('/settings')"
      >
        <div :class="$style.menuTitle">
          <van-icon name="setting-o" />
          <span>{{ $t('profile.index.settings') }}</span>
        </div>
        <van-icon name="arrow" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import avatar from '@/components/avatar.vue'
import { get } from '@/utils/request'

const router = useRouter()
const userStore = useUserStore()
// 余额
const balanceInfo = ref({
  balance: 0,
})

// 用户信息
const userInfo = computed(() => userStore.userInfo || {})

const getBalance = async () => {
  const res = await get('member.balance')
  if(res.code === 0){
    balanceInfo.value = res.data
  }
}

// 页面加载时获取用户信息
onMounted(async () => {
  getBalance()
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