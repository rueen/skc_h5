<template>
  <Layout>
    <!-- 顶部导航 -->
    <nav-bar
      :title="isNew ? $t('social.edit.addTitle') : $t('social.edit.editTitle')"
      left-arrow
      :right-text="isNew ? '' : isRejected ? '' : (isEditing ? $t('social.edit.cancel') : $t('social.edit.edit'))"
      @click-left="onClickLeft"
      @click-right="onClickRight"
      fixed
    />

    <!-- 详情内容 -->
    <div :class="$style.content">
      <div v-if="!isNew">
        <div :class="$style.status">
          <span :class="$style.statusText">{{ $t('social.edit.accountStatus') }}:</span>
          <tag :process="detail.accountAuditStatus">{{ enumStore.getEnumText('AccountAuditStatus', detail.accountAuditStatus) }}</tag>
        </div>
        <div :class="$style.status" v-if="isRejected">
          <span :class="$style.statusText">{{ $t('social.edit.rejectReason') }}:</span>
          <span :class="$style.statusText">{{ detail.rejectReason }}</span>
        </div>
      </div>
      <div :class="$style.formGroup">
        <!-- 表单项 -->
        <div :class="$style.formItem">
          <span :class="$style.label">{{ $t('social.edit.platform') }}</span>
          <div 
            :class="$style.value" 
            @click="handlePlatformClick"
          >
            <span :class="[$style.text, !selectedChannel.id && $style.placeholder]">
              {{ selectedChannel.id ? selectedChannel.name : $t('common.pleaseSelect') }}
            </span>
            <van-icon name="arrow" v-if="!isView && !isApproved" />
          </div>
        </div>
        <template v-if="selectedChannel.id">
          <div :class="$style.formItem">
            <span :class="$style.label">{{ $t('social.edit.homeUrl') }}</span>
            <van-field
              v-model="form.homeUrl"
              :placeholder="$t('common.inputPlaceholder')"
              :class="$style.input"
              :border="false"
              :readonly="isView || isApproved"
              @change="onHomeUrlChange"
              clearable
              @clear="onInputClear('homeUrl')"
            />
          </div>

          <div :class="$style.formItem">
            <span :class="$style.label">
              <span v-if="selectedChannel.name === 'Facebook'">{{ selectedChannel.name }}ID</span>
              <span v-else>{{ $t('social.edit.userName') }}</span>
            </span>
            <van-field
              v-model="form.uid"
              :placeholder="$t('common.inputPlaceholder')"
              :class="$style.input"
              :border="false"
              :disabled="!form.homeUrl"
              :readonly="isView || isApproved"
              clearable
              @clear="onInputClear('uid')"
            />
            <van-button type="primary" size="mini" @click="findFacebookId" v-if="isShowFindIdBtn">Find Facebook ID</van-button>
          </div>
          
          <div :class="$style.formItem">
            <span :class="$style.label">{{ $t('social.edit.name') }}</span>
            <van-field
              v-model="form.account"
              :placeholder="$t('common.inputPlaceholder')"
              :class="$style.input"
              :border="false"
              :readonly="isView"
              clearable
              @clear="onInputClear('account')"
            />
          </div>

          <div :class="$style.formItem" v-if="selectedChannel.customFields.includes('fansCount')">
            <span :class="$style.label">{{ $t('social.edit.fansCount') }}</span>
            <van-field
              v-model="form.fansCount"
              type="digit"
              :placeholder="$t('common.inputPlaceholder')"
              :class="$style.input"
              :border="false"
              :readonly="isView || isApproved"
              clearable
              @clear="onInputClear('fansCount')"
            />
          </div>

          <div :class="$style.formItem" v-if="selectedChannel.customFields.includes('friendsCount')">
            <span :class="$style.label">{{ $t('social.edit.friendsCount') }}</span>
            <van-field
              v-model="form.friendsCount"
              type="digit"
              :placeholder="$t('common.inputPlaceholder')"
              :class="$style.input"
              :border="false"
              :readonly="isView || isApproved"
              clearable
              @clear="onInputClear('friendsCount')"
            />
          </div>

          <div :class="$style.formItem" v-if="selectedChannel.customFields.includes('postsCount')">
            <span :class="$style.label">{{ $t('social.edit.postsCount') }}</span>
            <van-field
              v-model="form.postsCount"
              type="digit"
              :placeholder="$t('common.inputPlaceholder')"
              :class="$style.input"
              :border="false"
              :readonly="isView || isApproved"
              clearable
              @clear="onInputClear('postsCount')"
            />
          </div>
        </template>
      </div>
      <!-- <div :class="$style.tips" v-if="isEditing">
        <van-icon name="warning-o" :class="$style.warningIcon" />
        <span :class="$style.warningText">{{ $t('social.edit.warningText') }}</span>
      </div> -->
      <!-- 添加账号时显示保存按钮 -->
      <van-button 
        v-if="isNew || isEditing || isRejected"
        block 
        type="primary"
        :class="$style.submitBtn"
        @click="onSubmit"
      >
        {{isRejected ? $t('social.edit.resubmit') : $t('social.edit.save')}}
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
        :confirm-button-text="$t('common.confirm')"
        :cancel-button-text="$t('common.cancel')"
      />
    </van-popup>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showDialog, closeToast } from 'vant'
import { get, post, put } from '@/utils/request'
import { useEnumStore } from '@/stores'
import tag from '@/components/tag.vue'
import Layout from '@/components/layout.vue'
import NavBar from '@/components/NavBar.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
const isApproved = computed(() => detail.value.accountAuditStatus === 'approved')
const isShowFindIdBtn = ref(false)

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

// 处理平台点击
const handlePlatformClick = () => {
  if(isApproved.value || isView.value) {
    return
  }
  showPlatformPicker.value = true
}
// 清空输入框
const onInputClear = (field) => {
  form.value[field] = '';
  if(field === 'homeUrl') {
    form.value.uid = ''
  }
}

// 选择渠道
const onPlatformConfirm = ({ selectedOptions }) => {
  selectedChannel.value = selectedOptions[0]
  showPlatformPicker.value = false
  form.value.channelId = selectedChannel.value.id
}

const extractFacebookId = async (url) => {
  form.value.uid = ''
  // 方法1: 从URL中直接提取ID (如果URL包含ID参数)
  const idFromUrlMatch = url.match(/(?:\?|&)id=(\d+)/i);
  if (idFromUrlMatch && idFromUrlMatch[1]) {
    form.value.uid = idFromUrlMatch[1]
  } else {
    // 方法2: 去老数据表里查找
    showToast({
      message: t('social.edit.gettingFacebookId'),
      duration: 0,
      forbidClick: true,
    })
    try {
      const res = await post('account.findUidByHomeUrl', {
        homeUrl: form.value.homeUrl
      })
      closeToast()
      if(res.code === 0 && res.data && res.data.uid) {
        form.value.uid = res.data.uid
      } else {
        // 方法3: 使用第三方工具
        isShowFindIdBtn.value = true
      }
    } catch (error) {
      console.log(error)
      isShowFindIdBtn.value = true
    }
  }
}

const findFacebookId = () => {
  // window.open('https://essential-tools.com/find-facebook-id', '_blank')
  window.open('https://findidfb.com', '_blank')
}

const onHomeUrlChange = () => {
  isShowFindIdBtn.value = false;
  const url = form.value.homeUrl;
  if(url.includes('facebook.com')) {
    extractFacebookId(url)
  }
}

const checkForm = () => {
  if (form.value.channelId == null) {
    showToast(t('social.edit.platformRequired'))
    return
  }
  if(!form.value.homeUrl) {
    showToast(t('social.edit.homeUrlRequired'))
    return
  }
  if(!form.value.uid) {
    showToast(`${t('social.edit.input')} ${selectedChannel.value.name}ID`)
    return
  }
  if(!form.value.account) {
    showToast(t('social.edit.accountRequired'))
    return
  }

  // 验证粉丝数必须是非负整数
  if(selectedChannel.value.customFields.includes('fansCount')) {
    if(!form.value.fansCount) {
      showToast(t('social.edit.fansCountRequired'))
      return
    }
    if(!/^\d+$/.test(form.value.fansCount) || Number(form.value.fansCount) < 0) {
      showToast(t('social.edit.fansCountInvalid'))
      return
    }
  }

  // 验证好友数必须是非负整数
  if(selectedChannel.value.customFields.includes('friendsCount')) {
    if(!form.value.friendsCount) {
      showToast(t('social.edit.friendsCountRequired'))
      return
    }
    if(!/^\d+$/.test(form.value.friendsCount) || Number(form.value.friendsCount) < 0) {
      showToast(t('social.edit.friendsCountInvalid'))
      return
    }
  }

  // 验证帖子数必须是非负整数
  if(selectedChannel.value.customFields.includes('postsCount')) {
    if(!form.value.postsCount) {
      showToast(t('social.edit.postsCountRequired'))
      return
    }
    if(!/^\d+$/.test(form.value.postsCount) || Number(form.value.postsCount) < 0) {
      showToast(t('social.edit.postsCountInvalid'))
      return
    }
  }
  return true
}

const addAccount = async () => {
  try {
    let params = {}
    Object.keys(form.value).forEach(key => {
      if(['account', 'homeUrl', 'uid'].includes(key)) {
        params[key] = form.value[key].trim()
      } else {
        params[key] = form.value[key]
      }
    })
    const res = await post('account.create', params)
    if(res.code === 0) {
      showToast(t('social.edit.saveSuccess'))
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
    let params = {}
    Object.keys(form.value).forEach(key => {
      if(['account', 'homeUrl', 'uid'].includes(key)) {
        params[key] = form.value[key].trim()
      } else {
        params[key] = form.value[key]
      }
    })
    const res = await put('account.update', params, {
      urlParams: {
        id: route.params.id
      }
    })
    if(res.code === 0) {
      showToast(t('social.edit.saveSuccess'))
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
      title: t('social.edit.confirmLeaveTitle'),
      message: t('social.edit.confirmLeaveMessage'),
      showCancelButton: true,
      cancelButtonText: t('common.cancel'),
      confirmButtonText: t('common.confirm'),
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