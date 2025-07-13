<!--
 * @Author: diaochan
 * @Date: 2025-07-13 10:03:05
 * @LastEditors: rueen
 * @LastEditTime: 2025-07-13 15:23:49
 * @Description: 
-->
<template>
  <Layout>
    <nav-bar
      :title="$t('task.groupDetail.title')"
      left-arrow
      fixed
    />

    <!-- 主要内容区域 -->
    <div :class="$style.content">
      <!-- 基本信息 -->
      <div :class="$style.basicInfo">
        <div :class="$style.taskGroupName">{{ taskGroupInfo.taskGroupName }}</div>
        <div :class="$style.taskGroupReward">{{ taskGroupInfo.taskGroupReward }}</div>
      </div>

      <!-- 关联任务列表 -->
      <div class="list">
        <div 
          v-for="item in relatedTasks"
          :key="item.id"
          :class="$style.listItem"
          @click="router.push(`/tasks/detail/${item.id}`)"
        >
          <div :class="$style.mainContent">
            <div :class="$style.header">
              <img 
                :src="item.channelIcon" 
                :class="$style.platformIcon"
                alt="platform"
              />
              <h3>{{ item.taskName }}</h3>
              <span :class="$style.status" v-if="item.isEnrolled">{{ $t('task.enrolled') }}</span>
            </div>
            
            <div :class="$style.contentRow">
              <div :class="$style.leftContent">
                <div :class="$style.price">
                  {{ formatPrice(item.reward) }}
                </div>
                <div :class="$style.tags">
                  <van-tag
                    type="primary" 
                    :class="$style.taskType"
                  >
                    {{ enumStore.getEnumText('TaskType', item.taskType) }}
                  </van-tag>
                  <van-tag
                    type="warning"
                    :class="$style.followers"
                  >
                    {{ item.fansRequired }}
                  </van-tag>
                </div>
              </div>

              <div :class="$style.info">
                <div :class="$style.infoItem">
                  <span :class="$style.label">{{ $t('task.remainingQuota') }}</span>
                  <span :class="$style.value">
                    <span v-if="item.unlimitedQuota">{{ $t('task.unlimitedQuota') }}</span>
                    <span v-else>{{ item.remainingQuota }}</span>
                  </span>
                </div>
                <div :class="$style.infoItem">
                  <span :class="$style.label">{{ $t('task.category') }}</span>
                  <span :class="$style.value">{{ item.category }}</span>
                </div>
                <div :class="$style.infoItem" v-if="new Date(item.startTime) > new Date()">
                  <span :class="$style.label">{{ $t('task.startTime') }}</span>
                  <span :class="$style.value">{{ item.startTime }}</span>
                </div>
                <div :class="$style.infoItem" v-else>
                  <span :class="$style.label">{{ $t('task.endTime') }}</span>
                  <span :class="$style.value">{{ item.endTime }}</span>
                </div>
              </div>
            </div>
          </div>
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
      >
        {{ $t('task.groupDetail.apply') }}
      </van-button>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Layout from '@/components/layout.vue'
import NavBar from '@/components/NavBar.vue'
import { get, post } from '@/utils/request'
import { useI18n } from 'vue-i18n'
import { shareInviteLink } from '@/utils/share'
import { useUserStore } from '@/stores'
import { showToast } from 'vant'
import { useEnumStore } from '@/stores'

const userStore = useUserStore()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const enumStore = useEnumStore()

const taskGroupInfo = ref({})
const relatedTasksIds = ref([])
const relatedTasks = ref([])
const getDetail = async () => {
  const res = await get('taskGroup.detail', {}, {
    urlParams: {
      id: route.params.id
    }
  })
  if(res.code === 0) {
    taskGroupInfo.value = {
      ...res.data,
    }
    relatedTasksIds.value = res.data.relatedTasks || [];
  }
}

const getRelatedTasks = async () => {
  const res = await get('task.listAll', {
    taskIds: relatedTasksIds.value
  })
  if(res.code === 0){
    relatedTasks.value = res.data.list || [];
  }
}

// 格式化价格
const formatPrice = (price) => {
  return `${price}`
}

// 分享/邀请功能
const onShare = () => {
  if (!userStore.userInfo) {
    showToast(t('login.loginRequired'))
    return
  }
  
  // 获取当前用户的邀请码
  const inviteCode = userStore.inviteCode
  
  // 使用分享工具方法生成并复制邀请链接
  shareInviteLink(`/taskGroups/detail/${route.params.id}`, inviteCode)
}

onMounted(async () => {
  await getDetail()
  await getRelatedTasks()
})
</script>

<style lang="less" module>
.content {
  flex: 1;
  margin-bottom: 60px;
  padding: 0 0 12px;
}
.basicInfo{
  background: #fff;
  padding: 16px;
  margin-bottom: 12px;

  .taskGroupName{
    font-size: 16px;
    margin-bottom: 16px;
  }
  
  .taskGroupReward{
    font-size: 28px;
    color: #ff4d4f;
    font-weight: bold;
  }
}

.listItem {
  margin: 8px 12px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;

  .mainContent {
    flex: 1;
    min-width: 0;
    width: 0;
    display: flex;
    flex-direction: column;
    height: 90px;

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      width: 100%;

      .platformIcon {
        width: 16px;
        height: 16px;
        margin-right: 6px;
        flex-shrink: 0;
      }

      h3 {
        margin: 0;
        font-size: 15px;
        color: #323233;
        font-weight: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
      }
    }

    .status {
      font-size: 13px;
      color: #1989fa;
      margin-left: 12px;
      flex-shrink: 0;
    }

    .contentRow {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex: 1;
      padding-top: 2px;
    }

    .leftContent {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    .price {
      font-size: 18px;
      color: #ff4d4f;
      font-weight: bold;
      line-height: 1.2;
    }

    .tags {
      display: flex;
      gap: 4px;

      :global {
        .van-tag {
          padding: 0 4px;
          font-size: 11px;
          height: 18px;
          line-height: 16px;
          border-radius: 2px;
        }
      }

      .taskType {
        :global {
          .van-tag {
            color: #1989fa;
            border-color: #1989fa;
            background: rgba(25, 137, 250, 0.1);
          }
        }
      }

      .followers {
        :global {
          .van-tag {
            color: #ff976a;
            border-color: #ff976a;
            background: rgba(255, 151, 106, 0.1);
          }
        }
      }
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      flex: 1;
      margin-left: 12px;
      padding: 0;
    }

    .infoItem {
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