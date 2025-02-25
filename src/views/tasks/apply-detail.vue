<template>
  <div :class="$style.detailPage">
    <van-nav-bar
      title="报名详情"
      left-arrow
      @click-left="onClickLeft"
      :class="$style.navbar"
      fixed
    />

    <div :class="$style.content">
      <!-- 审核状态 -->
      <div 
        :class="[$style.statusBar, $style[`status${applyInfo.status}`]]"
      >
        <div :class="$style.statusIcon">
          <van-icon 
            :name="getStatusIcon(applyInfo.status)"
            :class="$style.icon"
          />
        </div>
        <div :class="$style.statusContent">
          <div :class="$style.statusText">{{ getStatusText(applyInfo.status) }}</div>
          <div :class="$style.statusDesc">{{ getStatusDesc(applyInfo.status) }}</div>
        </div>
      </div>

      <!-- 任务信息 -->
      <div :class="$style.taskInfo">
        <van-image
          :src="applyInfo.task.banner"
          width="80"
          height="80"
          radius="4"
          :class="$style.taskImage"
        />
        <div :class="$style.taskDetail">
          <div :class="$style.taskName">{{ applyInfo.task.title }}</div>
          <div :class="$style.taskPrice">${{ applyInfo.task.price }}</div>
          <div :class="$style.taskBottom">
            <div :class="$style.tags">
              <van-tag type="primary" :class="$style.taskType">
                {{ applyInfo.task.taskType }}
              </van-tag>
              <van-tag type="warning" :class="$style.followers">
                {{ applyInfo.task.followers }}
              </van-tag>
            </div>
            <div :class="$style.taskDeadline">截止日期：{{ applyInfo.task.deadline }}</div>
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
            v-model="applyInfo.postLink"
            readonly
            :class="$style.input"
          />
        </div>
        <div :class="$style.formItem">
          <div :class="$style.label">分享链接</div>
          <van-field
            v-model="applyInfo.shareLink"
            readonly
            :class="$style.input"
          />
        </div>
        <div :class="$style.formItem">
          <div :class="$style.label">数据截图</div>
          <div :class="$style.screenshots">
            <van-image
              v-for="(img, index) in applyInfo.screenshots"
              :key="index"
              :src="img"
              width="80"
              height="80"
              radius="4"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 报名信息数据
const applyInfo = ref({
  status: 'pending', // pending-审核中 approved-已通过 rejected-已拒绝
  postLink: 'https://example.com/post/123',
  shareLink: 'https://example.com/share/456',
  screenshots: [
    'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  ],
  task: {
    price: 50,
    title: '美国-雅诗兰黛口红种草',
    taskType: '图文',
    followers: '10w+',
    deadline: '2025-02-20',
    banner: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  }
})

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 获取状态类型
const getStatusType = (status) => {
  const types = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return types[status]
}

// 获取状态文本
const getStatusText = (status) => {
  const texts = {
    pending: '审核中',
    approved: '已通过',
    rejected: '已拒绝'
  }
  return texts[status]
}

// 获取状态描述
const getStatusDesc = (status) => {
  const descs = {
    pending: '您的报名正在审核中，请耐心等待',
    approved: '恭喜您，报名已通过审核',
    rejected: '很抱歉，您的报名未通过审核'
  }
  return descs[status]
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
  }
}

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

.statusContent {
  flex: 1;
}

.statusText {
  font-size: 16px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 4px;
}

.statusDesc {
  font-size: 14px;
  color: #969799;
}

// 复用任务报名页面的其他样式
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

.taskName {
  font-size: 14px;
  color: #323233;
  margin-bottom: 8px;
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

.screenshots {
  display: flex;
  gap: 8px;
}
</style> 