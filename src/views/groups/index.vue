<!--
 * @Author: diaochan
 * @Date: 2025-03-21 11:10:52
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-26 11:15:00
 * @Description: 
-->
<template>
  <Layout>
    <!-- 顶部导航 -->
    <van-nav-bar
      title="我的群组"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />

    <!-- 收益信息 -->
    <div :class="$style.earnings" v-if="isGroupOwner">
      <div :class="$style.earningItem">
        <div :class="$style.label">群数量</div>
        <div :class="$style.amount">{{ groupStats.groupCount }}</div>
      </div>
      <div :class="$style.earningItem">
        <div :class="$style.label">群收益</div>
        <div :class="$style.amount">{{ groupStats.totalEarnings }}</div>
      </div>
    </div>

    <!-- 群组列表 群主 -->
    <div :class="$style.groups" v-if="isGroupOwner">
      <div :class="$style.groupItem" v-for="group in groups" :key="group.id">
        <div :class="$style.formItem" @click="router.push(`/groups/members/${group.id}`)">
          <div :class="$style.label">{{ group.groupName }}</div>
          <div :class="$style.value">
            <span :class="$style.text">{{ group.memberCount }}</span>
            <span :class="$style.text">{{ group.totalEarnings }}</span>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
    </div>

    <!-- 群组列表 非群主 -->
    <div :class="$style.groups" v-else>
      <div :class="$style.groupItem" v-for="group in groups" :key="group.id">
        <div :class="$style.formItem">
          <div :class="$style.label">群组名称</div>
          <div :class="$style.value">
            <span :class="$style.text">{{ group.groupName }}</span>
          </div>
        </div>
        <div :class="$style.formItem">
          <div :class="$style.label">群组链接</div>
          <div :class="$style.value">
            <span :class="$style.text">{{ group.groupLink }}</span>
            <van-icon name="copy" />
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { get } from '@/utils/request'
import Layout from '@/components/layout.vue'

const router = useRouter()

const groups = ref([])
const isGroupOwner = computed(() => {
  return groups.value.some(group => group.isGroupOwner)
})
const groupStats = ref({
  groupCount: 0,
  totalEarnings: 0
})
// 事件处理
const onClickLeft = () => {
  router.back()
}

const loadGroups = async () => {
  const res = await get('groups.groups')
  if (res.code === 0 && res.data) {
    groups.value = res.data
  }
}

const loadGroupStats = async () => {
  const res = await get('groups.stats')
  if (res.code === 0) {
    groupStats.value = res.data
  }
}

onMounted(async () => {
  await loadGroups()
  if (isGroupOwner.value) {
    loadGroupStats()
  }
})
</script>

<style lang="less" module>
.earnings {
  margin: 12px 12px 0;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-around;

  .earningItem {
    text-align: center;

    .label {
      font-size: 14px;
      color: #969799;
      margin-bottom: 8px;
    }

    .amount {
      font-size: 20px;
      color: #323233;
      font-weight: 500;
    }
  }
}

.groups{
  margin: 12px;

  .groupItem {
    background: #fff;
    border-radius: 8px;
    margin-bottom: 12px;
    overflow: hidden;
    
    .formItem {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #f5f6f7;

      &:last-child {
        border-bottom: none;
      }

      .label {
        width: 80px;
        font-size: 14px;
        color: #323233;
      }

      .value {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        cursor: pointer;
        gap: 4px;

        .text {
          font-size: 14px;
          color: #323233;
        }
      }
    }
  }
}

</style> 