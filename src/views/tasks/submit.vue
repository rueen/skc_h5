<template>
  <Layout>
    <van-nav-bar
      title="任务提交"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />

    <div :class="$style.content">
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
          <div :class="$style.taskPrice">${{ taskInfo.reward }}</div>
          <div :class="$style.taskBottom">
            <div :class="$style.tags">
              <van-tag type="primary" :class="$style.taskType">
                {{ enumStore.getEnumText('TaskType', taskInfo.taskType) }}
              </van-tag>
              <van-tag type="warning" :class="$style.followers">
                {{ taskInfo.fansRequired }}
              </van-tag>
            </div>
            <div :class="$style.taskDeadline">截止日期：{{ taskInfo.endTime }}</div>
          </div>
        </div>
      </div>

      <!-- 温馨提示 -->
      <div :class="$style.tips">
        <h3 :class="$style.tipsTitle">温馨提示</h3>
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
            :placeholder="`请输入${item.title}`"
            :class="$style.input"
            v-if="item.type === 'input'"
          />
          <van-uploader
            v-model="customFields[index].value"
            multiple
            :max-count="3"
            :class="$style.uploader"
            :name="index"
            v-if="item.type === 'image'"
            :after-read="afterRead"
          />
        </div>
      </div>

      <!-- 提交按钮 -->
      <van-button 
        block 
        type="primary"
        :class="$style.submitBtn"
        @click="onSubmit"
        :loading="loading"
      >
        提交
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
        <van-icon name="cross" :class="$style.closeBtn" @click="showSuccessDialog = false" />
        <van-icon name="checked" :class="$style.successIcon" />
        <h3 :class="$style.successTitle">提交成功</h3>
        <p :class="$style.successTip">请在心等待，留意审核结果</p>
        <!-- <p :class="$style.successDesc">管理员将在5小时以内完成审核</p> -->
        <van-button 
          type="primary" 
          block 
          :class="$style.checkTaskBtn"
          @click="onCheckTask"
        >
          查看详情
        </van-button>
      </div>
    </van-dialog>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, closeToast } from 'vant'
import Layout from '@/components/layout.vue'
import { get, post } from '@/utils/request'
import { useEnumStore } from '@/stores/enum'
import { uploadImage } from '@/utils/upload'

const router = useRouter()
const route = useRoute()
const enumStore = useEnumStore()
// 任务数据
const taskInfo = ref({})
const customFields = ref([])
const loading = ref(false)
// 控制成功弹窗显示
const showSuccessDialog = ref(false)

// 事件处理
const onClickLeft = () => {
  router.back()
}

const afterRead = async (file, {name, index}) => {
  const _index = parseInt(name)
  // 检查文件对象
  if (!file || !file.file) {
    showToast('文件无效')
    return
  }
  // 显示上传中提示
  showToast({
    type: 'loading',
    message: '上传中...',
    forbidClick: true,
    duration: 0
  })
  
  // 调用上传图片接口
  const result = await uploadImage(file.file)
  
  // 关闭上传中提示
  closeToast()
  
  // 更新头像地址
  if (result && result.url) {
    customFields.value[_index].value[index] = {
      url: result.url,
    }
    showToast('上传成功')
  } else {
    console.error('头像上传返回数据异常:', result)
    showToast('上传失败，返回数据异常')
  }
}

const onSubmit = async () => {
  loading.value = true
  const res = await post('task.submit', {
    id: route.params.taskId,
    submitContent: {
      customFields: customFields.value
    }
  }, {
    urlParams: {
      id: route.params.taskId
    }
  })
  loading.value = false
  if(res.code === 0) {
    showSuccessDialog.value = true
  } else {
    showToast(res.message)
  }
}

// 查看任务
const onCheckTask = () => {
  showSuccessDialog.value = false
  router.push(`/tasks/submit/detail/${route.params.taskId}`)
}

const getDetail = async () => {
  try {
    const res = await get('task.detail', {}, {
      urlParams: {
        id: route.params.taskId
      }
    })
    taskInfo.value = {
      ...res.data,
      notice: res.data.notice.replace(/\n/g, '<br>')
    }
    customFields.value = res.data.customFields.map(item => ({
      ...item,
      value: item.type === 'image' ? [] : ''
    }))
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  await getDetail()
})
</script>

<style lang="less" module>
.content {
  padding: 12px;
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