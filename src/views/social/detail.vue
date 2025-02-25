<template>
  <div :class="$style.detailPage">
    <!-- 顶部导航 -->
    <van-nav-bar
      title="名片详情"
      left-arrow
      right-text="编辑"
      @click-left="onClickLeft"
      @click-right="onClickRight"
      :class="$style.navbar"
      fixed
    />

    <!-- 详情内容 -->
    <div :class="$style.content">
      <div :class="$style.userInfo">
        <van-image
          round
          width="60"
          height="60"
          :src="detail.avatar"
        />
        <div :class="$style.userMeta">
          <div :class="$style.userName">{{ detail.name }}</div>
          <div :class="$style.platform">
            <van-image
              width="16"
              height="16"
              :src="detail.platformIcon"
            />
            <span>{{ detail.platform }}</span>
          </div>
        </div>
        <div :class="[$style.status, detail.verified && $style.verified]">
          {{ detail.verified ? '已认证' : '认证中' }}
        </div>
      </div>

      <div :class="$style.stats">
        <div :class="$style.statItem">
          <span :class="$style.label">粉丝</span>
          <span :class="$style.value">{{ detail.followers }}</span>
        </div>
        <div :class="$style.statItem">
          <span :class="$style.label">{{ detail.platform === 'Instagram' ? '帖子' : '好友' }}</span>
          <span :class="$style.value">{{ detail.platform === 'Instagram' ? detail.posts : detail.friends }}</span>
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

const detail = ref({
  name: 'Chantal Lyric',
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  platform: 'Facebook',
  platformIcon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  followers: 800,
  friends: 500,
  verified: true
})

const onClickLeft = () => {
  router.back()
}

const onClickRight = () => {
  showToast('编辑功能开发中')
}
</script>

<style lang="less" module>
.detailPage {
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

    .van-nav-bar__text {
      color: var(--van-primary-color);
      font-size: 14px;
    }
  }
}

.content {
  padding: 16px;
}

.userInfo {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}

.userMeta {
  margin-left: 16px;
  flex: 1;
}

.userName {
  font-size: 16px;
  color: #323233;
  font-weight: 500;
  margin-bottom: 8px;
}

.platform {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #969799;
}

.status {
  font-size: 12px;
  color: #ff4d4f;

  &.verified {
    color: #07c160;
  }
}

.stats {
  margin-top: 12px;
  display: flex;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
}

.statItem {
  flex: 1;
  text-align: center;

  .label {
    font-size: 13px;
    color: #969799;
    margin-bottom: 4px;
    display: block;
  }

  .value {
    font-size: 16px;
    color: #323233;
    font-weight: 500;
  }
}
</style> 