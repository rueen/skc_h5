<!--
 * @Author: diaochan
 * @Date: 2025-02-25 14:25:45
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-17 22:00:31
 * @Description: 任务详情页
 -->
<template>
  <div :class="$style.detailPage">
    <van-nav-bar
      title="任务详情"
      left-arrow
      @click-left="onClickLeft"
      :class="$style.navbar"
      fixed
    />

    <!-- 主要内容区域 -->
    <div :class="$style.content">
      <!-- 基本信息 -->
      <div :class="$style.basicInfo">
        <div :class="$style.priceRow">
          <div :class="$style.price">$ {{ task.price }}</div>
          <div :class="$style.deadline">
            截止时间：{{ task.deadline }}
          </div>
        </div>
        <div :class="$style.platform">
          <img 
            src="@/assets/icon/Facebook.png" 
            :class="$style.platformIcon"
            alt="platform"
          />
          {{ task.platform }}
        </div>
        <div :class="$style.extraInfo">
          <div :class="$style.description">
            {{ task.description }}
          </div>
          <div :class="$style.slots">
            剩余名额：<span :class="$style.highlight">{{ task.slots }}</span>
          </div>
        </div>
      </div>

      <!-- 任务流程 -->
      <div :class="$style.section">
        <h3 :class="$style.sectionTitle">任务流程</h3>
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
          *新人第一次发布帖子需经过合作审核，审核结果会通过短信通知，请及时关注。已经通过审核的账号，可以直接发布帖子。
        </div>
      </div>

      <!-- 任务要求 -->
      <div :class="$style.section">
        <h3 :class="$style.sectionTitle">任务要求</h3>
        <div :class="$style.requirements">
          <div :class="$style.reqItem">
            <span :class="$style.label">发布时间</span>
            <span :class="$style.value">{{ task.publishTime }}</span>
          </div>
          <div :class="$style.reqItem">
            <span :class="$style.label">发布形式</span>
            <span :class="$style.value">{{ task.publishType }}</span>
          </div>
          <div :class="$style.reqItem">
            <span :class="$style.label">粉丝要求</span>
            <span :class="$style.value">{{ task.fansRequirement }}</span>
          </div>
          <div :class="$style.reqItem">
            <span :class="$style.label">作品要求</span>
            <div :class="$style.workRequirements">
              <div v-for="(req, index) in task.workRequirements" :key="index">
                {{ index + 1 }}. {{ req }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 任务信息 -->
      <div :class="$style.section">
        <h3 :class="$style.sectionTitle">任务信息</h3>
        <div :class="$style.taskInfo">
          {{ task.description }}
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div :class="$style.footer">
      <div :class="$style.actions">
        <div :class="$style.actionItem" @click="onContact">
          <van-icon name="service" size="20" />
          <span>联系管理员</span>
        </div>
        <div :class="$style.actionItem" @click="onShare">
          <van-icon name="share" size="20" />
          <span>邀请好友</span>
        </div>
      </div>
      <van-button 
        type="primary" 
        block 
        :class="$style.submitBtn"
        @click="onSubmit"
      >
        立即报名
      </van-button>
    </div>
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
  platform: '美国-雅诗兰黛口红种草',
  deadline: '2025-2-20 23:59:59',
  slots: 125,
  publishTime: 'Feb.25 8:00 ~ Feb.25 20:00',
  publishType: '图文',
  fansRequirement: '1k+',
  workRequirements: [
    '作品发布后在平台保留30天',
    '发布置顶评论@所有粉丝',
    '分享至200人以上公开社群1~2个'
  ],
  description: '护肤 爱生活 喜欢护肤品的素人'
})

// 任务流程步骤
const processSteps = ['报名', '审核', '发帖', '完成']

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 联系管理员
const onContact = () => {
  showToast('联系管理员功能开发中')
}

// 分享
const onShare = () => {
  showToast('分享功能开发中')
}

// 提交报名
const onSubmit = () => {
  router.push(`/tasks/apply/${route.params.id}`)
}

</script>

<style lang="less" module>
.detailPage {
  min-height: 100vh;
  background: #f7f8fa;
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

  .deadline {
    font-size: 14px;
    color: #969799;
  }

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

  .extraInfo {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .description {
    font-size: 14px;
    color: #969799;
    line-height: 1.3;
  }

  .slots {
    font-size: 14px;
    color: #969799;

    .highlight {
      color: #ff4d4f;
      font-weight: 500;
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