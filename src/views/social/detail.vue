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
      <!-- 编辑提示 -->
      <div v-if="isEditing" :class="$style.editTip">
        <van-icon name="info-o" />
        <span>修改名片信息需要重新认证审核</span>
      </div>

      <div :class="$style.userInfo">
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
          <span :class="$style.label">账号名称</span>
          <div :class="$style.valueWrapper">
            <template v-if="isEditing">
              <div :class="$style.inputWrapper">
                <van-field
                  v-model="editForm.accountName"
                  type="text"
                  placeholder="请输入账号名称"
                  :class="$style.input"
                />
              </div>
            </template>
            <template v-else>
              <span :class="$style.value">{{ detail.accountName }}</span>
            </template>
          </div>
        </div>
        <div :class="$style.statItem">
          <span :class="$style.label">粉丝</span>
          <div :class="$style.valueWrapper">
            <template v-if="isEditing">
              <div :class="$style.inputWrapper">
                <van-field
                  v-model="editForm.followers"
                  type="digit"
                  placeholder="请输入粉丝数量"
                  :class="$style.input"
                />
              </div>
            </template>
            <template v-else>
              <span :class="$style.value">{{ detail.followers }}</span>
            </template>
          </div>
        </div>
        <div :class="$style.statItem">
          <span :class="$style.label">{{ detail.platform === 'Instagram' ? '帖子' : '好友' }}</span>
          <div :class="$style.valueWrapper">
            <template v-if="isEditing">
              <div :class="$style.inputWrapper">
                <van-field
                  v-model="editForm.friends"
                  type="digit"
                  :placeholder="`请输入${detail.platform === 'Instagram' ? '帖子' : '好友'}数量`"
                  :class="$style.input"
                />
              </div>
            </template>
            <template v-else>
              <span :class="$style.value">{{ detail.platform === 'Instagram' ? detail.posts : detail.friends }}</span>
            </template>
          </div>
        </div>
        <div :class="$style.statItem">
          <span :class="$style.label">发帖数</span>
          <div :class="$style.valueWrapper">
            <template v-if="isEditing">
              <div :class="$style.inputWrapper">
                <van-field
                  v-model="editForm.posts"
                  type="digit"
                  placeholder="请输入发帖数量"
                  :class="$style.input"
                />
              </div>
            </template>
            <template v-else>
              <span :class="$style.value">{{ detail.posts }}</span>
            </template>
          </div>
        </div>
        <div :class="$style.statItem">
          <span :class="$style.label">主页链接</span>
          <div :class="$style.valueWrapper">
            <template v-if="isEditing">
              <div :class="$style.inputWrapper">
                <van-field
                  v-model="editForm.homepage"
                  type="text"
                  placeholder="请输入主页链接"
                  :class="$style.input"
                />
              </div>
            </template>
            <template v-else>
              <span :class="$style.value">{{ detail.homepage || '-' }}</span>
            </template>
          </div>
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
  accountName: '@chantal_lyric',
  followers: 800,
  friends: 500,
  posts: 120,
  homepage: 'https://facebook.com/chantal',
  verified: true
})

const editForm = ref({
  accountName: '',
  followers: '',
  friends: '',
  posts: '',
  homepage: ''
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
      accountName: detail.value.accountName,
      followers: detail.value.followers,
      friends: detail.value.friends,
      posts: detail.value.posts,
      homepage: detail.value.homepage || ''
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
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
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
  padding: 4px 0;

  .label {
    font-size: 14px;
    color: #323233;
  }
}

.valueWrapper {
  flex: 1;
  max-width: 300px;
  margin-left: 16px;
  display: flex;
  justify-content: flex-end;
  height: 28px;
  align-items: center;
}

.value {
  font-size: 14px;
  color: #323233;
  padding: 4px 12px;
  border-radius: 4px;
  line-height: 20px;
}

.inputWrapper {
  background: #f7f8fa;
  border-radius: 4px;
  padding: 4px 12px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.input {
  flex: 1;
  background: #f7f8fa;
  height: 100%;
  padding: 0;
  height: 100%;
  
  :global {
    .van-field__body {
      text-align: right;
      height: 100%;
    }

    .van-field__control {
      text-align: right;
      height: 20px;
      min-height: 20px;
      padding: 0;
      font-size: 14px;
      color: #323233;
      line-height: 20px;
    }

    .van-cell {
      padding: 0;
      background: transparent;
      line-height: normal;
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
}

.editTip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #fff7e6;
  border-radius: 4px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #ed6a0c;

  .van-icon {
    font-size: 14px;
  }
}
</style> 