<template>
  <Layout>
    <!-- 顶部导航 -->
    <nav-bar
      :title="isNew ? '添加账号' : '账号详情'"
      left-arrow
      :right-text="isNew ? '' : isRejected ? '' : (isEditing ? '取消' : '编辑')"
      @click-left="onClickLeft"
      @click-right="onClickRight"
      fixed
    />

    <!-- 详情内容 -->
    <div :class="$style.content">
      <div v-if="!isNew">
        <div :class="$style.status">
          <span :class="$style.statusText">账号状态:</span>
          <tag :process="detail.accountAuditStatus">{{ enumStore.getEnumText('AccountAuditStatus', detail.accountAuditStatus) }}</tag>
        </div>
        <div :class="$style.status" v-if="isRejected">
          <span :class="$style.statusText">拒绝原因:</span>
          <span :class="$style.statusText">{{ detail.rejectReason }}</span>
        </div>
      </div>
      <div :class="$style.formGroup">
        <!-- 表单项 -->
        <div :class="$style.formItem">
          <span :class="$style.label">平台</span>
          <div 
            :class="$style.value" 
            @click="showPlatformPicker = true"
          >
            <span :class="[$style.text, !selectedChannel.id && $style.placeholder]">
              {{ selectedChannel.id ? selectedChannel.name : '请选择平台' }}
            </span>
            <van-icon name="arrow" v-if="!isView" />
          </div>
        </div>
        <template v-if="selectedChannel.id">
          <div :class="$style.formItem">
            <span :class="$style.label">主页链接</span>
            <van-field
              v-model="form.homeUrl"
              placeholder="请输入主页链接"
              :class="$style.input"
              :border="false"
              :readonly="isView"
              @change="onHomeUrlChange"
            />
          </div>

          <div :class="$style.formItem">
            <span :class="$style.label">{{ selectedChannel.name }}ID</span>
            <van-field
              v-model="form.uid"
              :placeholder="`请输入${selectedChannel.name}ID`"
              :class="$style.input"
              :border="false"
              :disabled="!form.homeUrl"
              :readonly="isView"
            />
          </div>
          
          <div :class="$style.formItem">
            <span :class="$style.label">账号名称</span>
            <van-field
              v-model="form.account"
              placeholder="请输入账号名称"
              :class="$style.input"
              :border="false"
              :readonly="isView"
            />
          </div>

          <div :class="$style.formItem" v-if="selectedChannel.customFields.includes('fansCount')">
            <span :class="$style.label">粉丝数</span>
            <van-field
              v-model="form.fansCount"
              type="digit"
              placeholder="请输入粉丝数"
              :class="$style.input"
              :border="false"
              :readonly="isView"
            />
          </div>

          <div :class="$style.formItem" v-if="selectedChannel.customFields.includes('friendsCount')">
            <span :class="$style.label">好友数</span>
            <van-field
              v-model="form.friendsCount"
              type="digit"
              placeholder="请输入好友数"
              :class="$style.input"
              :border="false"
              :readonly="isView"
            />
          </div>

          <div :class="$style.formItem" v-if="selectedChannel.customFields.includes('postsCount')">
            <span :class="$style.label">发帖数</span>
            <van-field
              v-model="form.postsCount"
              type="digit"
              placeholder="请输入发帖数"
              :class="$style.input"
              :border="false"
              :readonly="isView"
            />
          </div>
        </template>
      </div>
      <div :class="$style.tips" v-if="isEditing">
        <van-icon name="warning-o" :class="$style.warningIcon" />
        <span :class="$style.warningText">修改账号信息需要重新审核</span>
      </div>
      <!-- 添加账号时显示保存按钮 -->
      <van-button 
        v-if="isNew || isEditing || isRejected"
        block 
        type="primary"
        :class="$style.submitBtn"
        @click="onSubmit"
      >
        {{isRejected ? '重新提交' : '保存'}}
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
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { get, post, put } from '@/utils/request'
import { useEnumStore } from '@/stores'
import tag from '@/components/tag.vue'
import Layout from '@/components/layout.vue'
import NavBar from '@/components/NavBar.vue'

const enumStore = useEnumStore()
const route = useRoute()
const router = useRouter()
// 是否是新建账号
const isNew = computed(() => route.params.id === 'new')
// 编辑状态
const isEditing = ref(false)
// 是否是查看状态
const isView = computed(() => route.params.id !== 'new' && !isEditing.value && !isRejected.value)
// 是否是拒绝状态
const isRejected = computed(() => detail.value.accountAuditStatus === 'rejected')

// 账号详情
const detail = ref({})
// 表单数据
const form = ref({
  channelId: '',
  homeUrl: '',
  uid: '',
  account: '',
  fansCount: '',
  friendsCount: '',
  postsCount: ''
})

// 平台选择器
const showPlatformPicker = ref(false)
// 已选择的渠道
const selectedChannel = ref({
  id: '',
  name: '',
  customFields: []
})
// 渠道列表
const channelColumns = ref([])
// 选择渠道
const onPlatformConfirm = ({ selectedOptions }) => {
  selectedChannel.value = selectedOptions[0]
  showPlatformPicker.value = false
  form.value.channelId = selectedChannel.value.id
}

const onHomeUrlChange = () => {
  console.log(form.value.homeUrl)
}

const checkForm = () => {
  if (form.value.channelId == null) {
    showToast('请选择平台')
    return
  }
  if(!form.value.homeUrl) {
    showToast('请输入主页链接')
    return
  }
  if(!form.value.uid) {
    showToast(`请输入${selectedChannel.value.name}ID`)
    return
  }
  if(!form.value.account) {
    showToast('请输入账号名称')
    return
  }
  if(selectedChannel.value.customFields.includes('fansCount') && !form.value.fansCount) {
    showToast('请输入粉丝数')
    return
  }
  if(selectedChannel.value.customFields.includes('friendsCount') && !form.value.friendsCount) {
    showToast('请输入好友数')
    return
  }
  if(selectedChannel.value.customFields.includes('postsCount') && !form.value.postsCount) {
    showToast('请输入发帖数')
    return
  }
  return true
}

const addAccount = async () => {
  try {
    const res = await post('account.create', form.value)
    if(res.code === 0) {
      showToast('保存成功')
    router.back()
    } else {
      showToast(res.message)
    }
  } catch (error) {
    console.log(error)
  }
}

const updateAccount = async () => {
  try { 
    const res = await put('account.update', form.value, {
      urlParams: {
        id: route.params.id
      }
    })
    if(res.code === 0) {
      showToast('保存成功')
      router.back()
    } else {
      showToast(res.message)
    }
  } catch (error) {
    console.log(error)
  }
}

// 提交表单
const onSubmit = async () => {
  if(!checkForm()) {
    return
  }
  if(isNew.value) {
    await addAccount()
  } else {
    await updateAccount()
  }
}

// 切换编辑状态
const onClickRight = () => {
  isEditing.value = !isEditing.value
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
      value: item.id,
      ...item
    }))
  } catch (error) {
    console.log(error)
  }
}

const loadAccountDetail = async () => {
  try {
    const res = await get('account.detail', {}, {
      urlParams: {
        id: route.params.id
      }
    })
    if(res.code === 0) {
      const data = res.data || {}
      detail.value = data
      form.value = {
        channelId: data.channelId,
        homeUrl: data.homeUrl,
        uid: data.uid,
        account: data.account,
        fansCount: data.fansCount,
        friendsCount: data.friendsCount,
        postsCount: data.postsCount
      }
      selectedChannel.value = channelColumns.value.find(item => item.id === data.channelId)
    } else {
      showToast(res.message)
    }
  } catch (error) {
    console.log(error)
  }
}
onMounted(async () => {
  await loadChannelList()
  if(!isNew.value) {
    await loadAccountDetail()
  }
  if(route.query.channelId != null) {
    selectedChannel.value = channelColumns.value.find(item => item.id === (route.query.channelId - 0))
    form.value.channelId = route.query.channelId
  }
})
</script>

<style lang="less" module>
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
  width: 80px;
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

.status {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.statusText {
  font-size: 14px;
  color: #323233;
}

.tips {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.warningIcon {
  color: #faad14;
}

.warningText {
  font-size: 14px;
  color: #faad14;
  margin-left: 4px;
}

</style> 