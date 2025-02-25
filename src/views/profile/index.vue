<template>
  <div :class="$style.profilePage">
    <!-- 用户信息 -->
    <div :class="$style.userInfo" @click="router.push('/profile/edit')">
      <div :class="$style.userHeader">
        <van-image
          round
          width="50"
          height="50"
          :src="userInfo.avatar"
        />
        <div :class="$style.userMeta">
          <div :class="$style.userName">
            {{ userInfo.name }}
          </div>
        </div>
      </div>
      <van-icon name="arrow" :class="$style.arrow" />
    </div>

    <!-- 收益信息 -->
    <div :class="$style.earnings">
      <div :class="$style.earningItem">
        <div :class="$style.amount">${{ userInfo.monthlyEarnings }}</div>
        <div :class="$style.label">本月收益</div>
      </div>
      <div :class="$style.earningItem">
        <div :class="$style.amount">${{ userInfo.accountBalance }}</div>
        <div :class="$style.label">账户余额</div>
      </div>
      <div :class="$style.earningItem">
        <div :class="$style.amount">${{ userInfo.totalEarnings }}</div>
        <div :class="$style.label">累计收益</div>
      </div>
    </div>

    <!-- 功能列表 -->
    <div :class="$style.menuList">
      <!-- 我的邀请人 -->
      <div :class="$style.menuItem">
        <div :class="$style.menuHeader" @click="router.push('/invites')">
          <div :class="$style.menuTitle">
            <van-icon name="friends-o" />
            <span>我的邀请人</span>
          </div>
          <van-icon name="arrow" />
        </div>
        <div :class="$style.menuContent">
          <div :class="$style.inviteStats">
            <span :class="$style.inviteCount">{{ userInfo.invites }}</span>
            <span :class="$style.inviteLabel">邀请人数</span>
          </div>
          <div :class="$style.inviteStats">
            <span :class="$style.inviteEarnings" :style="{ color: '#ff4d4f' }">${{ userInfo.inviteEarnings }}</span>
            <span :class="$style.inviteLabel">奖励收益</span>
          </div>
        </div>
      </div>

      <!-- 我的名片 -->
      <div :class="$style.menuItem">
        <div :class="$style.menuHeader" @click="onSocialClick">
          <div :class="$style.menuTitle">
            <van-icon name="card" />
            <span>我的名片</span>
          </div>
          <van-icon name="arrow" />
        </div>
        <div :class="$style.socialAccounts">
          <div 
            v-for="account in userInfo.socialAccounts" 
            :key="account.platform"
            :class="$style.socialItem"
            @click="onAccountClick(account)"
          >
            <div :class="$style.platform">
              <van-image
                width="16"
                height="16"
                :src="account.icon"
              />
              <span>{{ account.platform }}</span>
            </div>
            <div :class="[$style.status, $style.verified]">已认证</div>
            <van-icon name="arrow" :class="$style.arrow" />
          </div>
        </div>
      </div>

      <!-- 任务数据 -->
      <div :class="$style.menuItem">
        <div :class="$style.menuHeader">
          <div :class="$style.menuTitle">
            <van-icon name="chart-trending-o" />
            <span>任务数据</span>
          </div>
        </div>
        <div :class="$style.taskStats">
          <div :class="$style.statItem">
            <span :class="$style.statValue">{{ userInfo.taskStats.total }}</span>
            <span :class="$style.statLabel">报名任务</span>
          </div>
          <div :class="$style.statItem">
            <span :class="$style.statValue">{{ userInfo.taskStats.completed }}</span>
            <span :class="$style.statLabel">完成任务</span>
          </div>
          <div :class="$style.statItem">
            <span :class="$style.statValue">{{ userInfo.taskStats.completionRate }}%</span>
            <span :class="$style.statLabel">完成率</span>
          </div>
        </div>
      </div>

      <!-- 个人信息设置 -->
      <div :class="$style.menuItem" @click="onSettingsClick">
        <div :class="$style.menuHeader">
          <div :class="$style.menuTitle">
            <van-icon name="setting-o" />
            <span>设置</span>
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

// 用户信息
const userInfo = ref({
  name: 'Hi Han',
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  monthlyEarnings: 150.00,
  accountBalance: 150.00,
  totalEarnings: 1500.00,
  invites: 20,
  inviteEarnings: 50,
  socialAccounts: [
    {
      id: 1,
      platform: 'Instagram',
      icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      verified: true
    },
    {
      id: 2,
      platform: '小红书',
      icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      verified: true
    },
    {
      id: 3,
      platform: 'Tiktok',
      icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      verified: true
    },
    {
      id: 4,
      platform: 'Facebook',
      icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      verified: true
    }
  ],
  taskStats: {
    total: 30,
    completed: 10,
    completionRate: 33
  }
})

// 点击事件处理
const onInvitesClick = () => {
  showToast('邀请功能开发中')
}

const onSocialClick = () => {
  router.push('/social')
}

const onSettingsClick = () => {
  router.push('/settings')
}

const onAccountClick = (account) => {
  router.push(`/social/detail/${account.id}`)
}
</script>

<style lang="less" module>
.profilePage {
  min-height: 100vh;
  background: #f7f8fa;
  padding: 12px;
  padding-bottom: 62px;
}

.userInfo {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.userHeader {
  display: flex;
  align-items: center;
}

.userMeta {
  margin-left: 12px;
  flex: 1;
}

.userName {
  font-size: 16px;
  color: #323233;
  font-weight: 500;
}

.earnings {
  display: flex;
  justify-content: space-between;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.earningItem {
  flex: 1;
  text-align: center;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 24px;
    background: #f5f6f7;
  }

  .amount {
    font-size: 18px;
    color: #ff4d4f;
    font-weight: 500;
    line-height: 1.4;
  }

  .label {
    font-size: 12px;
    color: #969799;
    margin-top: 4px;
  }
}

.menuList {
  background: #fff;
  border-radius: 8px;
}

.menuItem {
  padding: 16px;
  border-bottom: 1px solid #f5f6f7;

  &:last-child {
    border-bottom: none;
  }
}

.menuHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .van-icon[name="arrow"] {
    color: #969799;
    font-size: 16px;
  }
}

.menuTitle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #323233;

  .van-icon {
    font-size: 16px;
    color: var(--van-primary-color);
  }
}

.menuContent {
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
}

.inviteStats {
  text-align: center;
}

.inviteCount, .inviteEarnings {
  font-size: 18px;
  color: #323233;
  font-weight: 500;
  display: block;
}

.inviteLabel {
  font-size: 12px;
  color: #969799;
  margin-top: 4px;
  display: block;
}

.socialAccounts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.socialItem {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 0;
}

.platform {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;

  span {
    font-size: 13px;
    color: #323233;
  }
}

.status {
  font-size: 12px;
  color: #ff4d4f;
  min-width: 48px;
  text-align: right;

  &.verified {
    color: #07c160;
  }
}

.taskStats {
  display: flex;
  justify-content: space-around;
  padding: 4px 0;
}

.statItem {
  text-align: center;

  .statValue {
    font-size: 16px;
    color: #323233;
    font-weight: 500;
    display: block;
  }

  .statLabel {
    font-size: 12px;
    color: #969799;
    margin-top: 4px;
  }
}

.inviteBtn {
  margin-top: 16px;
}

.arrow {
  font-size: 16px;
  color: #969799;
}
</style> 