<template>
  <Layout>
    <nav-bar
      :title="$t('task.submit.title')"
      left-arrow
      fixed
    />

    <div :class="$style.content">
      <!-- 审核状态 -->
      <div 
        :class="[$style.statusBar, $style[`status${auditStatus}`]]"
        v-if="!isNew"
      >
        <div :class="$style.statusIcon">
          <van-icon 
            :name="getStatusIcon(auditStatus)"
            :class="$style.icon"
          />
        </div>
        <div :class="$style.statusContent">
          <div :class="$style.statusText">{{ enumStore.getEnumText('TaskAuditStatus', auditStatus) }}</div>
          <div :class="$style.statusDesc" v-if="auditStatus === 'rejected'">{{ submittedInfo.rejectReason }}</div>
        </div>
      </div>
      <!-- 任务信息 -->
      <div :class="$style.taskInfo">
        <div :class="$style.taskDetail">
          <div :class="$style.taskTitle">
            <img 
              :src="taskInfo.channelIcon"
              :class="$style.platformIcon"
              alt="platform"
            />
            <div :class="$style.taskName">{{ taskInfo.taskName }}</div>
          </div>
          <div :class="$style.taskPrice">{{ taskInfo.reward }}</div>
          <div :class="$style.taskBottom">
            <div :class="$style.tags">
              <van-tag type="primary" :class="$style.taskType">
                {{ enumStore.getEnumText('TaskType', taskInfo.taskType) }}
              </van-tag>
              <van-tag type="warning" :class="$style.followers">
                {{ taskInfo.fansRequired }}
              </van-tag>
            </div>
            <div :class="$style.taskDeadline">{{ $t('task.endTime') }}：{{ taskInfo.endTime }}</div>
          </div>
        </div>
      </div>

      <!-- 温馨提示 -->
      <div :class="$style.tips">
        <h3 :class="$style.tipsTitle">{{ $t('task.submit.tipsTitle') }}</h3>
        <div :class="$style.tipsList">
          <div :class="$style.tipItem" v-html="taskInfo.notice"></div>
        </div>
      </div>

      <!-- 表单内容 -->
      <div :class="$style.formGroup">
        <div :class="$style.formItem" v-for="(item, index) in taskInfo.customFields" :key="index">
          <div :class="$style.label">{{item.title}}</div>
          <van-field
            v-model="customFields[index].value"
            :placeholder="`${item.title}`"
            :class="$style.input"
            :readonly="isView"
            clearable
            @clear="onInputClear(index)"
            v-if="['input', 'post', 'group'].includes(item.type)"
          />
          <template v-if="item.type === 'image'">
            <van-image
              v-for="(img, index) in customFields[index].value"
              :key="index"
              :src="img.url"
              width="80"
              height="80"
              radius="4"
              v-if="isView"
            />
            <van-uploader
              v-model="customFields[index].value"
              multiple
              :max-count="3"
              :class="$style.uploader"
              :name="index"
              v-else
              :after-read="afterRead"
            />
          </template>
        </div>
      </div>

      <!-- 提交按钮 -->
      <van-button 
        block 
        type="primary"
        :class="$style.submitBtn"
        @click="onSubmit"
        :loading="loading"
        v-if="!isView"
      >
        {{ isEdit ? $t('task.submit.reSubmit') : $t('task.submit.submit') }}
      </van-button>
    </div>

    <!-- 报名成功弹窗 -->
    <van-dialog
      v-model:show="showSuccessDialog"
      :show-confirm-button="false"
      :close-on-click-overlay="false"
      class="success-dialog"
    >
      <div :class="$style.successContent">
        <van-icon name="cross" :class="$style.closeBtn" @click="handleCloseDialog" />
        <van-icon name="checked" :class="$style.successIcon" />
        <h3 :class="$style.successTitle">{{ $t('task.submit.success') }}</h3>
        <p :class="$style.successTip">{{ $t('task.submit.successTip') }}</p>
      </div>
    </van-dialog>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, closeToast } from 'vant'
import Layout from '@/components/layout.vue'
import { get, post } from '@/utils/request'
import { useEnumStore } from '@/stores'
import { uploadImage } from '@/utils/upload'
import NavBar from '@/components/NavBar.vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
const enumStore = useEnumStore()
const { t } = useI18n()

const taskId = ref(route.query.taskId)
const taskInfo = ref({})
const customFields = ref([])
const loading = ref(false)
// 已提交数据
const submittedInfo = ref({})
const auditStatus = computed(() => {
  if(submittedInfo.value.taskPreAuditStatus === 'approved') {
    return submittedInfo.value.taskAuditStatus
  } else {
    return submittedInfo.value.taskPreAuditStatus
  }
})
// 控制成功弹窗显示
const showSuccessDialog = ref(false)
const submittedId = ref(null)
const isNew = ref(route.params.id === 'new')
const isEdit = computed(() => {
  return route.params.id !== 'new' && auditStatus.value === 'rejected'
})
const isView = computed(() => {
  return route.params.id !== 'new' && auditStatus.value !== 'rejected'
})

// 清空输入框
const onInputClear = (index) => {
  customFields.value[index].value = ''
}

// 获取状态图标
const getStatusIcon = (status) => {
  const icons = {
    pending: 'clock-o',
    approved: 'passed',
    rejected: 'close'
  }
  return icons[status]
}

const afterRead = async (file, {name, index}) => {
  const _index = parseInt(name)
  // 检查文件对象
  if (!file || !file.file) {
    showToast(t('task.submit.fileInvalid'))
    return
  }
  // 显示上传中提示
  showToast({
    type: 'loading',
    message: t('task.submit.uploading'),
    forbidClick: true,
    duration: 0
  })
  
  // 调用上传图片接口
  const result = await uploadImage(file.file, {
    params: {
      directory: `post/${taskId.value}`
    }
  }, {
    imageRequired: t('common.upload.imageRequired'),
    imageSize: t('common.upload.imageSize'),
    uploadFailed: t('common.upload.uploadFailed')
  })
  
  // 关闭上传中提示
  closeToast()
  
  // 更新头像地址
  if (result && result.url) {
    customFields.value[_index].value[index] = {
      url: result.url,
    }
    showToast(t('task.submit.uploadSuccess'))
  } else {
    showToast(t('task.submit.uploadFailed'))
  }
}

const checkForm = () => {
  return customFields.value.every(item => item.value)
}

/**
 * 检查是否为 Facebook 链接
 * @param {string} url - 要检查的URL
 * @returns {boolean} 是否是 Facebook 链接
 */
const isFacebookLink = (url) => {
  if (!url || typeof url !== 'string') return false
  
  try {
    const urlObj = new URL(url)
    const facebookDomains = [
      'facebook.com',
      'www.facebook.com',
      'web.facebook.com',
      'm.facebook.com'
    ]
    
    return facebookDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
    )
  } catch (e) {
    return false
  }
}

/**
 * 优化的Facebook抓取处理函数
 * 通过串行请求和随机延迟来避免被识别为爬虫
 */
const handleScrape = async () => {
  const postItem = customFields.value.find(item => item.type === 'post')
  if(postItem && postItem.value && isFacebookLink(postItem.value)) {
    const res = await post('scrape.facebook', {
      type: postItem.type,
      url: postItem.value
    })
    if(res.code === 0 && res.data && res.data.uid && res.data.uid.length > 2) {
      postItem.uid = res.data.uid
    }
  }
}

const onSubmit = async () => {
  const checkResult = checkForm()
  if(!checkResult){
    showToast(t('task.submit.pleaseFillInAllInformation'))
    return 
  }

  try {
    loading.value = true
    // 调用爬取接口
    await handleScrape();
    const res = await post('task.submit', {
      taskId: taskId.value,
      submitContent: {
        customFields: customFields.value
      }
    })
    loading.value = false
    if(res.code === 0) {
      showSuccessDialog.value = true
      submittedId.value = res.data.id
    } else {
      showToast(res.message)
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

const handleCloseDialog = () => {
  showSuccessDialog.value = false
  let activeTab = 'submitted';
  if(taskInfo.value.taskGroup && taskInfo.value.taskGroup.id != null) {
    // 任务组任务
    activeTab = 'applied';
  }
  router.push(`/taskApplications?activeTab=${activeTab}`)
}

const getTaskDetail = async () => {
  try {
    const res = await get('task.detail', {}, {
      urlParams: {
        id: taskId.value
      }
    })
    taskInfo.value = {
      ...res.data,
      notice: res.data.notice.replace(/\n/g, '<br>')
    }
    if(!isNew.value) {
      let submittedCustomFields = [];
      if(submittedInfo.value.submitContent && submittedInfo.value.submitContent.customFields) {
        submittedCustomFields = submittedInfo.value.submitContent.customFields;
      }
      const taskDetailCustomFields = res.data.customFields || [];
      customFields.value = taskDetailCustomFields.map(item => {
        const submittedCustomField = submittedCustomFields.find(customField => customField.title === item.title && customField.type === item.type);
        return {
          ...item,
          value: submittedCustomField ? submittedCustomField.value : (item.type === 'image' ? [] : '')
        }
      })
    } else {
      customFields.value = res.data.customFields.map(item => ({
        ...item,
        value: item.type === 'image' ? [] : ''
      }))
    }
  } catch (error) {
    console.log(error)
  }
}

const loadSubmittedDetail = async () => {
  const res = await get('task.submittedDetail', {}, {
    urlParams: {
      id: route.params.id
    }
  })
  if(res.code === 0) {
    submittedInfo.value = res.data
    taskId.value = res.data.taskId
  }
}

onMounted(async () => {
  if(!isNew.value) {
    await loadSubmittedDetail()
  }
  await getTaskDetail()
})
</script>

<style lang="less" module>
.content {
  padding: 12px;
}

.statusBar {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;

  &.statuspending {
    background: #fffbe8;
    .statusIcon {
      background: #ffd21e;
    }
  }

  &.statusapproved {
    background: #f0fff0;
    .statusIcon {
      background: #07c160;
    }
  }

  &.statusrejected {
    background: #fff2f0;
    .statusIcon {
      background: #ff4d4f;
    }
  }
  .statusIcon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      font-size: 24px;
      color: #fff;
    }
  }
}

.taskInfo {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.taskDetail {
  flex: 1;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.taskTitle {
  display: flex;
  align-items: center;
  gap: 6px;
}

.platformIcon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.taskName {
  font-size: 14px;
  color: #323233;
}

.tag {
  font-size: 12px;
  color: var(--van-primary-color);
  background: rgba(var(--van-primary-color-rgb), 0.1);
  padding: 2px 8px;
  border-radius: 2px;
}

.taskPrice {
  font-size: 16px;
  font-weight: 500;
  color: #ee0a24;
  margin-bottom: 4px;
}

.taskBottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tags {
  display: flex;
  gap: 4px;
  align-items: center;
}

.taskDeadline {
  font-size: 12px;
  color: #969799;
}

.tips {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.tipsTitle {
  font-size: 14px;
  color: #323233;
  margin: 0 0 12px;
  font-weight: normal;
}

.tipsList {
  font-size: 12px;
  color: #969799;
  line-height: 1.6;
}

.formGroup {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
}

.formItem {
  padding: 12px 16px;
  border-bottom: 1px solid #f5f6f7;

  &:last-child {
    border-bottom: none;
  }
}

.label {
  font-size: 14px;
  color: #323233;
  margin-bottom: 8px;
}

.input {
  :global {
    .van-field__control {
      font-size: 14px;
      color: #323233;
    }
  }
}

.uploader {
  :global {
    .van-uploader__upload {
      background: #f7f8fa;
    }
  }
}

.submitBtn {
  --van-button-primary-background: var(--van-primary-color);
}

.successContent {
  padding: 24px 16px;
  text-align: center;
  position: relative;
}

.closeBtn {
  position: absolute;
  right: 16px;
  top: 16px;
  font-size: 18px;
  color: #969799;
  cursor: pointer;
}

.successIcon {
  font-size: 48px;
  color: #07c160;
  margin-bottom: 16px;
}

.successTitle {
  font-size: 18px;
  color: #323233;
  margin: 0 0 8px;
  font-weight: 500;
}

.successTip {
  font-size: 14px;
  color: #323233;
  margin: 0 0 4px;
}

.successDesc {
  font-size: 12px;
  color: #969799;
  margin: 0 0 24px;
}

.checkTaskBtn {
  width: 240px;
  margin: 0 auto;
}
</style> 
<style lang="less">
// 修改弹窗默认样式
.success-dialog {
  .van-dialog {
    width: 320px;
    border-radius: 12px;
    overflow: hidden;
  }
}
</style> 