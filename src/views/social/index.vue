<template>
  <div :class="$style.socialPage">
    <!-- 顶部导航 -->
    <van-nav-bar
      title="我的名片"
      left-arrow
      @click-left="onClickLeft"
      :class="$style.navbar"
      fixed
    />

    <!-- 列表内容 -->
    <div :class="$style.content">
      <van-list
        v-model:loading="loading"
        v-model:finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div 
          v-for="item in list" 
          :key="item.id"
          :class="$style.listItem"
          @click="onItemClick(item)"
        >
          <div :class="$style.userInfo">
            <div :class="$style.userMeta">
              <div :class="$style.userName">{{ item.name }}</div>
              <div :class="$style.platform">
                <img 
                  src="@/assets/icon/Facebook.png" 
                  :class="$style.platformIcon"
                  alt="platform"
                />
                <span>{{ item.platform }}</span>
              </div>
            </div>
          </div>
          <div :class="[$style.status, item.verified && $style.verified]">
            {{ item.verified ? '已认证' : '认证中' }}
          </div>
          <van-icon name="arrow" :class="$style.arrow" />
        </div>
      </van-list>
    </div>

    <!-- 底部按钮 -->
    <div :class="$style.footer">
      <van-button 
        type="primary" 
        block
        @click="onAddClick"
      >
        添加名片
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from 'vant'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const finished = ref(false)

// 列表数据
const list = ref([
  {
    id: 1,
    name: 'Chantal Lyric',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    platform: 'Facebook',
    platformIcon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    followers: 800,
    friends: 500,
    verified: true
  },
  {
    id: 2,
    name: 'Chantal Lyric',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    platform: 'Instagram',
    platformIcon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    followers: 0,
    posts: 0,
    verified: false
  }
])

const onClickLeft = () => {
  router.back()
}

const onLoad = () => {
  loading.value = false
  finished.value = true
}

const onAddClick = () => {
  showToast('添加名片功能开发中')
}

const onItemClick = (item) => {
  router.push(`/social/detail/${item.id}`)
}
</script>

<style lang="less" module>
.socialPage {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 80px;
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

.tableHeader {
  position: fixed;
  top: 46px;
  left: 0;
  right: 0;
  z-index: 99;
  background: #fff;
  display: flex;
  justify-content: space-between;
  padding: 12px 24px;
  font-size: 14px;
  color: #323233;
  border-bottom: 1px solid #f5f6f7;
  max-width: 750px;
  margin: 0 auto;
}

.content {
  padding: 12px;
}

.listItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
}

.userInfo {
  display: flex;
  align-items: center;
  flex: 1;
}

.userMeta {
  flex: 1;
}

.userName {
  font-size: 14px;
  color: #323233;
  margin-bottom: 6px;
}

.platform {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #969799;
}

.platformIcon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  flex-shrink: 0;
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

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  max-width: 750px;
  margin: 0 auto;
}

.arrow {
  margin-left: 8px;
  font-size: 16px;
  color: #969799;
}
</style> 