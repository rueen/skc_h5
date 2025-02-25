<template>
  <div :class="$style.detailPage">
    <!-- 顶部导航 -->
    <van-nav-bar
      title="名片详情"
      left-arrow
      :right-text="isEditing ? '保存' : '编辑'"
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
        <div :class="$style.userName">{{ detail.name }}</div>
        <div :class="$style.platform">
          <van-image
            width="16"
            height="16"
            :src="detail.platformIcon"
          />
          <span>{{ detail.platform }}</span>
        </div>
        <div :class="[$style.status, detail.verified && $style.verified]">
          {{ detail.verified ? '已认证' : '认证中' }}
        </div>
      </div>

      <div :class="$style.stats">
        <div :class="$style.statItem">
          <span :class="$style.label">粉丝</span>
          <template v-if="isEditing">
            <van-field
              v-model="editForm.followers"
              type="digit"
              placeholder="请输入粉丝数量"
              :class="$style.input"
            />
          </template>
          <template v-else>
            <span :class="$style.value">{{ detail.followers }}</span>
          </template>
        </div>
        <div :class="$style.statItem">
          <span :class="$style.label">{{ detail.platform === 'Instagram' ? '帖子' : '好友' }}</span>
          <template v-if="isEditing">
            <van-field
              v-model="editForm.friends"
              type="digit"
              :placeholder="`请输入${detail.platform === 'Instagram' ? '帖子' : '好友'}数量`"
              :class="$style.input"
            />
          </template>
          <template v-else>
            <span :class="$style.value">{{ detail.platform === 'Instagram' ? detail.posts : detail.friends }}</span>
          </template>
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
const isEditing = ref(false)

const detail = ref({
  name: 'Chantal Lyric',
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  platform: 'Facebook',
  platformIcon: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  followers: 800,
  friends: 500,
  verified: true
})

const editForm = ref({
  followers: '',
  friends: ''
})

const onClickLeft = () => {
  if (isEditing.value) {
    isEditing.value = false
    return
  }
  router.back()
}

const onClickRight = () => {
  if (isEditing.value) {
    // 保存逻辑
    showToast('保存成功')
    isEditing.value = false
  } else {
    isEditing.value = true
    // 初始化编辑表单
    editForm.value = {
      followers: detail.value.followers,
      friends: detail.value.friends
    }
  }
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
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  text-align: center;
}

.userName {
  font-size: 16px;
  color: #323233;
  font-weight: 500;
  margin-top: 12px;
  margin-bottom: 8px;
}

.platform {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #969799;
  margin-bottom: 8px;
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
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  gap: 16px;
}

.statItem {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .label {
    font-size: 14px;
    color: #323233;
  }

  .value {
    font-size: 14px;
    color: #323233;
  }
}

.input {
  :global {
    .van-field__body {
      text-align: right;
    }
    .van-field__control {
      text-align: right;
    }
  }
}
</style> 