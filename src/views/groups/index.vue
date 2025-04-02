<!--
 * @Author: diaochan
 * @Date: 2025-03-21 11:10:52
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-02 16:36:18
 * @Description: 
-->
<template>
  <Layout>
    <!-- 顶部导航 -->
    <nav-bar
      title="我的群组"
      left-arrow
      fixed
    />
    <!-- 未加入任何群组 -->
    <div :class="$style.noData" v-if="groups.length === 0">您还没有加入任何群组</div>
    <!-- 群组列表 群主 -->
    <div :class="$style.groups" v-if="isGroupOwner">
      <div :class="$style.header">
        <div :class="[$style.headerItem, $style.headerItemLeft]">群名称</div>
        <div :class="[$style.headerItem, $style.headerItemCenter]">成员数</div>
        <div :class="[$style.headerItem, $style.headerItemRight]">
          贡献
          <span :class="$style.earnings">({{ groupStats.totalEarnings }})</span>
        </div>
      </div>
      <div
        :class="$style.listItem"
        @click="router.push(`/groups/members/${group.id}`)"
        v-for="group in groups"
        :key="group.id"
      >
        <div :class="$style.listItemLeft">
          <span :class="$style.text">{{ group.groupName }}</span>
        </div>
        <div :class="$style.listItemCenter">
          <span :class="$style.text">{{ group.memberCount }}</span>
        </div>
        <div :class="$style.listItemRight">
          <div :class="[$style.text, $style.earnings]">{{ group.totalEarnings }}</div>
        </div>
        <van-icon name="arrow" />
      </div>
    </div>

    <!-- 群组列表 非群主 -->
    <div :class="$style.groups" v-else>
      <div :class="$style.groupItem" v-for="group in groups" :key="group.id">
        <div :class="$style.formItem">
          <div :class="$style.label">群组名称</div>
          <div :class="$style.value">{{ group.groupName }}</div>
        </div>
        <div :class="$style.formItem">
          <div :class="$style.label">群组链接</div>
          <div :class="$style.value">
            <span>{{ group.groupLink }}</span>
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
import NavBar from '@/components/NavBar.vue'

const router = useRouter()

const groups = ref([])
const isGroupOwner = computed(() => {
  return groups.value.some(group => group.isGroupOwner)
})
const groupStats = ref({
  groupCount: 0,
  totalEarnings: 0
})

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
.noData{
  font-size: 14px;
  color: #999;
  text-align: center;
  padding: 12px;
}
.groups{
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;

    .headerItem {
      text-align: center;
      font-size: 14px;
      color: #323233;
    }

    .headerItemLeft {
      flex: 1;
      text-align: left;
    }

    .headerItemCenter {
      width: 70px;
      text-align: center;
    } 

    .headerItemRight {
      width: 136px;
      text-align: center;
    }
  }
  .listItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #fff;
    border-bottom: 1px solid #f5f6f7;
    &:last-child {
      border-bottom: none;
    }

    .listItemLeft{
      flex: 1;
    }

    .listItemCenter{
      width: 70px;
      text-align: center;
    }

    .listItemRight{
      width: 120px;
      text-align: center;
    }
  }
  .groupItem {
    background: #fff;
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
        font-size: 14px;
        color: #323233;
      }
    }
  }
  .text {
    font-size: 14px;
    color: #323233;
  }
  .earnings {
    color: #FF951C;
  }
}

</style> 