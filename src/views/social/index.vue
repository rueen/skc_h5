<template>
  <div :class="$style.socialPage">
    <!-- 顶部导航 -->
    <van-nav-bar
      title="我的账号"
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
        >
          <div 
            :class="$style.userInfo"
            @click="onItemClick(item)"
          >
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
          <van-icon 
            name="delete-o" 
            :class="$style.deleteBtn"
            @click.stop="onDeleteClick(item)"
          />
          <van-icon name="arrow" :class="$style.arrow" />
        </div>
      </van-list>
    </div>

    <!-- 底部按钮 -->
    <div :class="$style.footer">
      <van-button 
        type="primary" 
        block
        @click="router.push('/social/detail/new')"
      >
        添加账号
      </van-button>
    </div>

    <!-- 删除确认弹窗 -->
    <van-dialog
      v-model:show="showDeleteDialog"
      title="确认删除"
      :message="`确定要删除账号「${selectedCard?.name}」吗？`"
      show-cancel-button
      @confirm="onDeleteConfirm"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

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
    friends: 500
  },
  {
    id: 2,
    name: 'Chantal Lyric',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    platform: 'Instagram',
    platformIcon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    followers: 0,
    posts: 0
  }
])

// 删除相关
const showDeleteDialog = ref(false)
const selectedCard = ref(null)

const onClickLeft = () => {
  router.back()
}

const onLoad = () => {
  loading.value = false
  finished.value = true
}

const onItemClick = (item) => {
  router.push(`/social/detail/${item.id}`)
}

const onDeleteClick = (item) => {
  selectedCard.value = item
  showDeleteDialog.value = true
}

const onDeleteConfirm = () => {
  list.value = list.value.filter(item => item.id !== selectedCard.value.id)
  showToast('删除成功')
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

    .van-icon {
      color: #323233 !important;
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

.deleteBtn {
  font-size: 18px;
  color: #969799;
  padding: 8px;
  margin-right: -4px;
  cursor: pointer;
}
</style> 