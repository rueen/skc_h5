<template>
  <div :class="$style.profilePage">
    <!-- 用户信息 -->
    <div :class="$style.userInfo">
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

      <!-- 收益信息 -->
      <div :class="$style.earnings">
        <div :class="$style.earningItem">
          <span :class="$style.amount">${{ userInfo.monthlyEarnings }}</span>
          <span :class="$style.label">本月收益</span>
        </div>
        <div :class="$style.earningItem">
          <span :class="$style.amount">${{ userInfo.accountBalance }}</span>
          <span :class="$style.label">账户余额</span>
        </div>
        <div :class="$style.earningItem">
          <span :class="$style.amount">${{ userInfo.totalEarnings }}</span>
          <span :class="$style.label">累计收益</span>
        </div>
      </div>
    </div>

    <!-- 功能列表 -->
    <div :class="$style.menuList">
      <!-- 我的邀请人 -->
      <div :class="$style.menuItem" @click="onInvitesClick">
        <div :class="$style.menuHeader">
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
      <div :class="$style.menuItem" @click="onSocialClick">
        <div :class="$style.menuHeader">
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
          >
            <van-image
              width="20"
              height="20"
              :src="account.icon"
            />
            <span>{{ account.platform }}</span>
            <van-tag type="success" size="small">已认证</van-tag>
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
            <span>个人信息设置</span>
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
      platform: 'Instagram',
      icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      verified: true
    },
    {
      platform: '小红书',
      icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      verified: true
    },
    {
      platform: 'Tiktok',
      icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      verified: true
    },
    {
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
  showToast('社交账号功能开发中')
}

const onSettingsClick = () => {
  showToast('设置功能开发中')
}
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
  margin-bottom: 12px;
}

.userHeader {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
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
  text-align: center;
}

.earningItem {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .amount {
    font-size: 18px;
    color: #ff4d4f;
    font-weight: 500;
  }

  .label {
    font-size: 12px;
    color: #969799;
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

  span {
    flex: 1;
    font-size: 13px;
    color: #323233;
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
</style> 