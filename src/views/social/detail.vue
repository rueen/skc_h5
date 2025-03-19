<template>
  <div :class="$style.detailPage">
    <!-- 顶部导航 -->
    <van-nav-bar
      :title="isNew ? '添加账号' : '账号详情'"
      left-arrow
      :right-text="!isNew ? (isEditing ? '保存' : '编辑') : ''"
      @click-left="onClickLeft"
      @click-right="onClickRight"
      fixed
    />

    <!-- 详情内容 -->
    <div :class="$style.content">
      <div :class="$style.formGroup">
        <!-- 表单项 -->
        <div :class="$style.formItem">
          <span :class="$style.label">平台</span>
          <div 
            :class="$style.value" 
            @click="showPlatformPicker = true"
          >
            <span :class="[$style.text, !form.platform && $style.placeholder]">
              {{ form.platform ? form.platform : '请选择平台' }}
            </span>
            <van-icon name="arrow" />
          </div>
        </div>

        <div :class="$style.formItem">
          <span :class="$style.label">账号名称</span>
          <van-field
            v-model="form.name"
            placeholder="请输入账号名称"
            :class="$style.input"
            :border="false"
          />
        </div>

        <div :class="$style.formItem">
          <span :class="$style.label">主页链接</span>
          <van-field
            v-model="form.homepage"
            placeholder="请输入主页链接"
            :class="$style.input"
            :border="false"
          />
        </div>

        <div :class="$style.formItem">
          <span :class="$style.label">粉丝</span>
          <van-field
            v-model="form.followers"
            type="digit"
            placeholder="请输入粉丝数"
            :class="$style.input"
            :border="false"
          />
        </div>

        <div :class="$style.formItem">
          <span :class="$style.label">好友</span>
          <van-field
            v-model="form.friends"
            type="digit"
            placeholder="请输入好友数"
            :class="$style.input"
            :border="false"
          />
        </div>

        <div :class="$style.formItem">
          <span :class="$style.label">发帖数</span>
          <van-field
            v-model="form.posts"
            type="digit"
            placeholder="请输入发帖数"
            :class="$style.input"
            :border="false"
          />
        </div>
      </div>

      <!-- 添加账号时显示保存按钮 -->
      <van-button 
        v-if="isNew"
        block 
        type="primary"
        :class="$style.submitBtn"
        @click="onSubmit"
      >
        保存
      </van-button>
    </div>

    <!-- 平台选择器 -->
    <van-popup
      v-model:show="showPlatformPicker"
      position="bottom"
      round
    >
      <van-picker
        :columns="channelColumns"
        @confirm="onPlatformConfirm"
        @cancel="showPlatformPicker = false"
        show-toolbar
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { get, post } from '@/utils/request'

const route = useRoute()
const router = useRouter()
// 是否是新建账号
const isNew = computed(() => route.params.id === 'new')

// 编辑状态
const isEditing = ref(false)

// 表单数据
const form = ref({
  platform: '',
  name: '',
  avatar: '',
  followers: '',
  friends: '',
  posts: '',
  homepage: ''
})

// 详情数据（仅在编辑时使用）
const detail = ref({
  id: 1,
  accountName: 'Chantal Lyric',
  platform: 'Facebook',
  followers: 800,
  friends: 500,
  posts: 120,
  homepage: 'https://facebook.com/chantal'
})

// 如果不是新建，则初始化表单数据
if (!isNew.value) {
  form.value = {
    platform: detail.value.platform,
    name: detail.value.accountName,
    avatar: '',
    followers: detail.value.followers,
    friends: detail.value.friends,
    posts: detail.value.posts,
    homepage: detail.value.homepage
  }
}

// 平台选择器
const showPlatformPicker = ref(false)
// 平台列表
const channelColumns = ref([])
// 选择平台
const onPlatformConfirm = ({ selectedOptions }) => {
  form.value.platform = selectedOptions[0].value
  showPlatformPicker.value = false
}

// 提交表单
const onSubmit = () => {
  if (!form.value.platform) {
    showToast('请选择平台')
    return
  }
  // ... 其他验证逻辑
  showToast('保存成功')
  router.back()
}

// 切换编辑状态
const onClickRight = () => {
  if (isEditing.value) {
    onSubmit()
  } else {
    isEditing.value = true
  }
}

const onClickLeft = () => {
  if (isNew.value || isEditing.value) {
    // 显示确认弹窗
    showDialog({
      title: '确认离开',
      message: '当前内容未保存，确定要离开吗？',
      showCancelButton: true
    }).then((action) => {
      if (action === 'confirm') {
        router.back()
      }
    })
  } else {
    router.back()
  }
}

const loadChannelList = async () => {
  try {
    const res = await get('channel.list')
    const list = res.data || []
    channelColumns.value = list.map(item => ({
      text: item.name,
      value: item.id
    }))
  } catch (error) {
    console.log(error)
  }
}

// 初始化
onMounted(() => {
  loadChannelList()
})
</script>

<style lang="less" module>
.detailPage {
  min-height: 100vh;
  background: #f7f8fa;
  padding-top: 46px;
}

.content {
  padding: 12px;
}

.formGroup {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.formItem {
  display: flex;
  align-items: center;
  padding: 0 16px;
  min-height: 44px;
  border-bottom: 1px solid #f5f6f7;

  &:last-child {
    border-bottom: none;
  }
}

.label {
  width: 70px;
  font-size: 14px;
  color: #323233;
  flex-shrink: 0;
}

.value {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  cursor: pointer;
}

.input {
  flex: 1;
  padding: 0;
  background: transparent;

  :global {
    .van-field__control {
      color: #323233;
      font-size: 14px;

      &::placeholder {
        color: #969799;
      }
    }
  }
}

.text {
  font-size: 14px;
  color: #323233;

  &.placeholder {
    color: #969799;
  }
}

.submitBtn {
  margin-top: 24px;
  --van-button-primary-background: var(--van-primary-color);
}
</style> 