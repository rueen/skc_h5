<template>
  <div :class="$style.applyPage">
    <van-nav-bar
      title="任务提交"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />

    <div :class="$style.content">
      <!-- 任务信息 -->
      <div :class="$style.taskInfo">
        <van-image
          :src="task.banner"
          width="80"
          height="80"
          radius="4"
          :class="$style.taskImage"
        />
        <div :class="$style.taskDetail">
          <div :class="$style.taskTitle">
            <img 
              src="@/assets/icon/Facebook.png" 
              :class="$style.platformIcon"
              alt="platform"
            />
            <div :class="$style.taskName">{{ task.title }}</div>
          </div>
          <div :class="$style.taskPrice">${{ task.price }}</div>
          <div :class="$style.taskBottom">
            <div :class="$style.tags">
              <van-tag type="primary" :class="$style.taskType">
                {{ task.taskType }}
              </van-tag>
              <van-tag type="warning" :class="$style.followers">
                {{ task.followers }}
              </van-tag>
            </div>
            <div :class="$style.taskDeadline">截止日期：{{ task.deadline }}</div>
          </div>
        </div>
      </div>

      <!-- 温馨提示 -->
      <div :class="$style.tips">
        <h3 :class="$style.tipsTitle">温馨提示</h3>
        <div :class="$style.tipsList">
          <div :class="$style.tipItem">1.请尽快完成发布，填写发布链接。</div>
          <div :class="$style.tipItem">2.任务结束后无法填写，不能结算。</div>
          <div :class="$style.tipItem">3.发布内容不符合要求，将无法审核通过。</div>
          <div :class="$style.tipItem">4.填写链接无法访问或其他无关链接，视为放弃结算。</div>
        </div>
      </div>

      <!-- 表单内容 -->
      <div :class="$style.formGroup">
        <div :class="$style.formItem">
          <div :class="$style.label">帖子链接</div>
          <van-field
            v-model="form.postLink"
            placeholder="请输入帖子链接"
            :class="$style.input"
          />
        </div>
        <div :class="$style.formItem">
          <div :class="$style.label">分享链接</div>
          <van-field
            v-model="form.shareLink"
            placeholder="请输入分享链接"
            :class="$style.input"
          />
        </div>
        <div :class="$style.formItem">
          <div :class="$style.label">数据截图</div>
          <van-uploader
            v-model="form.screenshots"
            multiple
            :max-count="3"
            :class="$style.uploader"
          />
        </div>
      </div>

      <!-- 提交按钮 -->
      <van-button 
        block 
        type="primary"
        :class="$style.submitBtn"
        @click="onSubmit"
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
        <h3 :class="$style.successTitle">报名成功</h3>
        <p :class="$style.successTip">请在心等待，留意审核结果</p>
        <p :class="$style.successDesc">管理员将在5小时以内完成审核</p>
        <van-button 
          type="primary" 
          block 
          :class="$style.checkTaskBtn"
          @click="onCheckTask"
        >
          查看任务
        </van-button>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()

// 任务数据
const task = ref({
  price: 50,
  title: '美国-雅诗兰黛口红种草',
  taskType: '图文',
  followers: '10w+',
  deadline: '2025-02-20',
  banner: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
})

// 表单数据
const form = ref({
  postLink: '',
  shareLink: '',
  screenshots: []
})

// 控制成功弹窗显示
const showSuccessDialog = ref(false)

// 事件处理
const onClickLeft = () => {
  router.back()
}

const onSubmit = () => {
  if (!form.value.postLink) {
    showToast('请输入帖子链接')
    return
  }
  if (!form.value.shareLink) {
    showToast('请输入分享链接')
    return
  }
  // if (form.value.screenshots.length === 0) {
  //   showToast('请上传数据截图')
  //   return
  // }

  showSuccessDialog.value = true
}

// 查看任务
const onCheckTask = () => {
  showSuccessDialog.value = false
  router.push('/tasks')
}
</script>

<style lang="less" module>
.applyPage {
  min-height: 100vh;
  background: #f7f8fa;
  padding-top: 46px;
}

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