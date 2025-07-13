<!--
 * @Author: diaochan
 * @Date: 2025-07-13 10:03:05
 * @LastEditors: rueen
 * @LastEditTime: 2025-07-13 10:47:23
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
    </div>

    <!-- 关联任务列表 -->

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

const userStore = useUserStore()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const taskGroupInfo = ref({})
const getDetail = async () => {
  const res = await get('taskGroup.detail', {}, {
    urlParams: {
      id: route.params.id
    }
  })
  taskGroupInfo.value = {
    ...res.data,
  }
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