<template>
  <Layout>
    <van-nav-bar
      title="已提交详情"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />

    <div :class="$style.content">
      <!-- 审核状态 -->
      <div 
        :class="[$style.statusBar, $style[`status${submittedInfo.taskAuditStatus}`]]"
      >
        <div :class="$style.statusIcon">
          <van-icon 
            :name="getStatusIcon(submittedInfo.taskAuditStatus)"
            :class="$style.icon"
          />
        </div>
        <div :class="$style.statusContent">
          <div :class="$style.statusText">{{ enumStore.getEnumText('TaskAuditStatus', submittedInfo.taskAuditStatus) }}</div>
          <div :class="$style.statusDesc">{{ getStatusDesc(submittedInfo.taskAuditStatus) }}</div>
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
          <div :class="$style.taskPrice">${{ taskInfo.reward }}</div>
          <div :class="$style.taskBottom">
            <div :class="$style.tags">
              <van-tag type="primary" :class="$style.taskType">
                {{ enumStore.getEnumText('TaskType', taskInfo.taskType) }}
              </van-tag>
              <van-tag type="warning" :class="$style.followers">
                {{ taskInfo.followers }}
              </van-tag>
            </div>
            <div :class="$style.taskDeadline">截止日期：{{ taskInfo.deadline }}</div>
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
        <div :class="$style.formItem" v-for="(item, index) in submittedInfo?.submitContent?.customFields" :key="index">
          <div :class="$style.label">{{item.title}}</div>
          <van-field
            v-model="item.value"
            readonly
            :class="$style.input"
            v-if="item.type === 'input'"
          />
          <div :class="$style.screenshots" v-if="item.type === 'image'">
            <van-image
              v-for="(img, index) in item.value"
              :key="index"
              :src="img.url"
              width="80"
              height="80"
              radius="4"
            />
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Layout from '@/components/layout.vue'
import { get } from '@/utils/request'
import { useEnumStore } from '@/stores/enum'

const router = useRouter()
const route = useRoute()
const enumStore = useEnumStore()

// 已提交数据
const submittedInfo = ref({})
const taskId = ref(null)
// 任务数据
const taskInfo = ref({})

// 返回上一页
const onClickLeft = () => {
  router.back()
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

const getTaskDetail = async () => {
  const res = await get('task.detail', {}, {
    urlParams: {
      id: taskId.value
    }
  })
  taskInfo.value = {
    ...res.data,
    notice: res.data.notice.replace(/\n/g, '<br>')
  }
}

onMounted(async () => {
  await loadSubmittedDetail()
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