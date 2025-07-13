<!--
 * @Author: diaochan
 * @Date: 2025-02-25 14:25:45
 * @LastEditors: rueen
 * @LastEditTime: 2025-07-13 11:00:57
 * @Description: 任务详情页
 -->
<template>
  <Layout>
    <nav-bar
      :title="$t('task.detail.title')"
      left-arrow
      fixed
    />

    <!-- 主要内容区域 -->
    <div :class="$style.content">
      <!-- 基本信息 -->
      <div :class="$style.basicInfo">
        <div :class="$style.platform">
          <img 
            :src="taskInfo.channelIcon" 
            :class="$style.platformIcon"
            alt="platform"
          />
          <div class="taskName">{{ taskInfo.taskName }}</div>
        </div>
        <div :class="$style.priceRow">
          <div :class="$style.price">{{ taskInfo.reward }}</div>
        </div>
        <div :class="$style.extraInfo">
          <div :class="$style.extraInfoItem">
            <span :class="$style.label">{{ $t('task.remainingQuota') }}</span>
            <span :class="$style.value">
              <span v-if="taskInfo.unlimitedQuota">{{ $t('task.unlimitedQuota') }}</span>
              <span v-else>{{ taskInfo.remainingQuota }}</span>
            </span>
          </div>
          <div :class="$style.extraInfoItem">
            <span :class="$style.label">{{ $t('task.category') }}</span>
            <span :class="$style.value">{{ taskInfo.category }}</span>
          </div>
          <div :class="$style.extraInfoItem" v-if="!isStart">
            <span :class="$style.label">{{ $t('task.startTime') }}</span>
            <span :class="$style.value">{{ taskInfo.startTime }}</span>
          </div>
          <div :class="$style.extraInfoItem" v-else>
            <span :class="$style.label">{{ $t('task.endTime') }}</span>
            <span :class="$style.value">{{ taskInfo.endTime }}</span>
          </div>
        </div>
      </div>

      <!-- 任务流程 -->
      <div :class="$style.section">
        <h3 :class="$style.sectionTitle">{{ $t('task.detail.processTitle') }}</h3>
        <div :class="$style.processSteps">
          <div 
            v-for="(step, index) in processSteps" 
            :key="index"
            :class="$style.step"
          >
            <div :class="$style.stepNum">{{ index + 1 }}</div>
            <div :class="$style.stepLine" v-if="index < processSteps.length - 1" />
            <div :class="$style.stepName">{{ step }}</div>
          </div>
        </div>
        <div :class="$style.processNote">
          * {{ $t('task.detail.processNote') }}
        </div>
      </div>

      <!-- 任务要求 -->
      <div :class="$style.section">
        <h3 :class="$style.sectionTitle">{{ $t('task.detail.requirementsTitle') }}</h3>
        <div :class="$style.requirements">
          <div :class="$style.reqItem">
            <span :class="$style.label">{{ $t('task.detail.publishForm') }}</span>
            <span :class="$style.value">{{ enumStore.getEnumText('TaskType', taskInfo.taskType) }}</span>
          </div>
          <div :class="$style.reqItem">
            <span :class="$style.label">{{ $t('task.detail.fansRequired') }}</span>
            <span :class="$style.value">{{ taskInfo.fansRequired }}</span>
          </div>
          <div :class="$style.reqItem">
            <span :class="$style.label">{{ $t('task.detail.workRequirements') }}</span>
            <div :class="$style.workRequirements" v-html="taskInfo.contentRequirement" />
          </div>
        </div>
      </div>

      <!-- 任务信息 -->
      <div :class="$style.section">
        <h3 :class="$style.sectionTitle">{{ $t('task.detail.taskInfoTitle') }}</h3>
        <div :class="$style.taskInfo">
          {{ taskInfo.taskInfo }}
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div :class="$style.footer">
      <div :class="$style.actions">
        <div :class="$style.actionItem" @click="onShare">
          <van-icon name="share" size="20" />
          <span>{{ $t('common.inviteFriend') }}</span>
        </div>
      </div>
      <van-button 
        type="primary" 
        block 
        :class="$style.submitBtn"
        v-if="!currentChannelAccount"
        @click="onAddAccount"
      >
        {{ $t('task.addAccount') }}
      </van-button>
      <van-button 
        type="warning" 
        block 
        :class="$style.submitBtn"
        v-else-if="!isStart"
      >
        {{ $t('task.taskNotStart') }}
      </van-button>
      <van-button 
        type="warning" 
        block 
        :class="$style.submitBtn"
        v-else-if="currentChannelAccount.accountAuditStatus === 'pending'"
      >
        {{ $t('task.accountAuditPending') }}
      </van-button>
      <van-button 
        type="warning" 
        block 
        :class="$style.submitBtn"
        v-else-if="currentChannelAccount.accountAuditStatus === 'rejected'"
      >
        {{ $t('task.accountAuditRejected') }}
      </van-button>
      <van-button 
        type="warning" 
        block 
        :class="$style.submitBtn"
        v-else-if="taskInfo.taskStatus === 'ended'"
      >
        {{ $t('task.taskEnded') }}
      </van-button>
      <van-button 
        type="warning" 
        block 
        :class="$style.submitBtn"
        v-else-if="(currentChannelAccount.fansCount - taskInfo.fansRequired < 0) && (currentChannelAccount.friendsCount - taskInfo.fansRequired < 0)"
      >
        {{ $t('task.fansNotQualified') }}
      </van-button>
      <van-button 
        type="warning" 
        block 
        :class="$style.submitBtn"
        v-else-if="taskInfo.remainingQuota === 0"
      >
        {{ $t('task.quotaFull') }}
      </van-button>
      <van-button 
        type="warning" 
        block 
        :class="$style.submitBtn"
        v-else-if="!taskInfo.eligibleToEnroll"
      >
        {{ $t('task.notEligibleToEnroll') }}
      </van-button>
      <van-button 
        type="primary" 
        block 
        :class="$style.submitBtn"
        @click="router.push(`/tasks/submit/${taskInfo.submittedId}?taskId=${taskInfo.id}`)"
        v-else-if="!!taskInfo.isSubmitted"
      >
        {{ $t('task.detail.viewSubmitDetails') }}
      </van-button>
      <van-button 
        type="primary" 
        block 
        :class="$style.submitBtn"
        @click="handleSubmitTask"
        v-else-if="!!taskInfo.isEnrolled"
      >
        {{ $t('task.detail.submitTask') }}
      </van-button>
      <van-button 
        type="primary" 
        block 
        :class="$style.submitBtn"
        @click="handleApply"
        v-else
      >
        {{ $t('task.detail.applyNow') }}
      </van-button>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { get, post } from '@/utils/request'
import { useEnumStore, useUserStore } from '@/stores'
import { shareInviteLink } from '@/utils/share'
import Layout from '@/components/layout.vue'
import NavBar from '@/components/NavBar.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const enumStore = useEnumStore()
const userStore = useUserStore()
const currentChannelAccount = ref(null)

// 任务数据
const taskInfo = ref({})
const isStart = computed(() => {
  return new Date() > new Date(taskInfo.value.startTime)
})

// 任务流程步骤
const processSteps = [t('task.detail.processStep1'), t('task.detail.processStep2'), t('task.detail.processStep3'), t('task.detail.processStep4')]

// 分享/邀请功能
const onShare = () => {
  if (!userStore.userInfo) {
    showToast(t('login.loginRequired'))
    return
  }
  
  // 获取当前用户的邀请码
  const inviteCode = userStore.inviteCode
  
  // 使用分享工具方法生成并复制邀请链接
  shareInviteLink(`/tasks/detail/${route.params.id}`, inviteCode)
}

// 添加账号
const onAddAccount = () => {
  router.push(`/social/detail/new?channelId=${taskInfo.value.channelId}`)
}

const handleSubmitTask = async () => {
  router.push(`/tasks/submit/new?taskId=${route.params.id}`)
}

// 提交报名
const handleApply = async () => {
  const res = await post('task.enroll', {}, {
    urlParams: {
      taskId: route.params.id
    }
  })
  if(res.code === 0) {
    showToast(t('task.message.enrollSuccess'))
    getDetail()
  } else {
    showToast(res.message)
  }
}

const getDetail = async () => {
  const res = await get('task.detail', {}, {
    urlParams: {
      id: route.params.id
    }
  })
  taskInfo.value = {
    ...res.data,
    contentRequirement: res.data.contentRequirement.replace(/\n/g, '<br>'),
    notice: res.data.notice.replace(/\n/g, '<br>')
  }
}

const getAccountList = async () => {
  try {
    const res = await get('account.list')
    if(res.code === 0 && res.data && res.data.length > 0) {
      currentChannelAccount.value = res.data.find(item => item.channelId === taskInfo.value.channelId)
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  await getDetail()
  await getAccountList()
})

</script>

<style lang="less" module>
.detailPage {
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  margin-bottom: 60px;
  padding: 0 0 12px;
}

.basicInfo {
  background: #fff;
  padding: 16px;
  margin-bottom: 12px;

  .platform {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #323233;
    margin-bottom: 16px;

    .platformIcon {
      width: 16px;
      height: 16px;
      margin-right: 6px;
    }
  }
  .taskName{
    font-size: 16px;
  }

  .priceRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .price {
    font-size: 28px;
    color: #ff4d4f;
    font-weight: bold;
  }

  .extraInfo {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .extraInfoItem {
      font-size: 12px;
      line-height: 1.3;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      white-space: nowrap;

      .label {
        color: #969799;
        margin-right: 3px;
        min-width: 60px;
      }

      .value {
        color: #323233;
      }
    }
  }
}

.section {
  background: #fff;
  padding: 16px;
  margin-bottom: 12px;
}

.sectionTitle {
  font-size: 15px;
  font-weight: 500;
  color: #323233;
  margin: 0 0 16px;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    width: 2px;
    height: 14px;
    background: var(--van-primary-color);
    margin-right: 6px;
  }
}

.processSteps {
  display: flex;
  justify-content: space-between;
  padding: 0 20px 30px;
  position: relative;

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    flex: 1;
    
    .stepNum {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--van-primary-color);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      margin-bottom: 8px;
      position: relative;
      z-index: 1;
    }

    .stepLine {
      position: absolute;
      top: 12px;
      left: 50%;
      width: 100%;
      height: 1px;
      background: #dcdee0;
    }

    .stepName {
      font-size: 14px;
      color: #323233;
    }
  }
}

.processNote {
  font-size: 12px;
  color: #969799;
  line-height: 1.6;
  padding: 12px;
  background: #f7f8fa;
  border-radius: 4px;
}

.requirements {
  .reqItem {
    margin-bottom: 16px;

    .label {
      display: block;
      font-size: 14px;
      color: #969799;
      margin-bottom: 8px;
    }

    .value {
      font-size: 14px;
      color: #323233;
    }
  }

  .workRequirements {
    font-size: 14px;
    color: #323233;
    line-height: 1.6;
  }
}

.taskInfo {
  font-size: 14px;
  color: #323233;
  line-height: 1.6;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 750px;
  margin: 0 auto;
  background: #fff;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
}

.actions {
  display: flex;
  gap: 16px;
}

.actionItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 8px;
  color: #969799;
  font-size: 12px;

  .van-icon {
    font-size: 24px;
    margin-bottom: 2px;
  }
}

.submitBtn {
  flex: 1;
}
</style>