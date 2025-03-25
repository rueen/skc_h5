<template>
  <div :class="$style.groupsPage">
    <!-- 表头 -->
    <div :class="$style.tableHeader">
      <span :class="$style.tableHeaderItem1">用户列表</span>
      <span :class="$style.tableHeaderItem2">任务次数</span>
      <span :class="$style.tableHeaderItem3">奖励</span>
    </div>

    <!-- 列表内容 -->
    <div :class="$style.content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          v-model:finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div 
            v-for="item in list" 
            :key="item.id"
            :class="$style.listItem"
          >
            <div :class="$style.userInfo">
              <van-image
                round
                width="40"
                height="40"
                :src="item.avatar"
              />
              <div :class="$style.userMeta">
                <div :class="$style.userName">{{ item.nickname }}</div>
                <div :class="$style.date">{{ item.joinTime }}</div>
              </div>
            </div>
            <div :class="$style.taskCount">{{ item.taskCount }}</div>
            <div :class="$style.reward">${{ item.reward }}</div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 底部标签栏 -->
    <div :class="$style.footer">
      <div :class="$style.tabsWrapper">
        <div :class="$style.tabs">
          <div 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="[$style.tab, activeTab === tab.id && $style.active]"
            @click="activeTab = tab.id"
          >
            {{ tab.groupName }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useGroupsStore } from '@/stores'
import { get } from '@/utils/request'

const groupsStore = useGroupsStore()
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

// 底部标签数据
const tabs = computed(() => groupsStore.groups)
const activeTab = computed(() => groupsStore.groups[0].id)

// 监听标签切换
watch(activeTab, (newVal) => {
  // 重置列表状态
  list.value = []
  finished.value = false
  loading.value = false
  // 加载新数据
  loadData()
})

// 列表数据
const list = ref([])

// 加载数据的方法
const loadData = async () => {
  loading.value = true
  const res = await get('groups.members', {
    groupId: activeTab.value
  })
  if(res.code === 0){
    list.value = [...list.value, ...res.data]
    loading.value = false
    finished.value = true
  }
}

const onLoad = () => {
  loadData()
}

const onRefresh = () => {
  finished.value = false
  loading.value = false
  refreshing.value = false
  loadData()
}

onMounted(async () => {
  loadData()
})
</script>

<style lang="less" module>
.groupsPage {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 140px;
  padding-top: 0;
}

.tableHeader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background: #fff;
  display: flex;
  justify-content: space-between;
  padding: 12px 24px;
  font-size: 14px;
  color: #323232;
  border-bottom: 1px solid #f5f6f7;
  max-width: 750px;
  margin: 0 auto;
  .tableHeaderItem1 {
    flex: 1;
  }
  .tableHeaderItem2 {
    width: 70px;
    text-align: center;
  }
  .tableHeaderItem3 {
    width: 70px;
    text-align: center;
  }
}
.content {
  padding: 52px 12px 0;
}

.listItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
}

.userInfo {
  display: flex;
  align-items: center;
  flex: 1;
}

.userMeta {
  margin-left: 12px;
}

.userName {
  font-size: 14px;
  color: #323233;
  margin-bottom: 4px;
}

.date {
  font-size: 12px;
  color: #969799;
}

.taskCount {
  font-size: 14px;
  color: #323233;
  width: 70px;
  text-align: center;
}

.reward {
  font-size: 15px;
  color: #ff4d4f;
  font-weight: 500;
  min-width: 60px;
  text-align: right;
  width: 70px;
  text-align: center;
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  padding: 8px 0;
  max-width: 750px;
  margin: 0 auto;
}

.tabsWrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.tabs {
  display: flex;
  padding: 0 16px;
  min-width: min-content;
  gap: 32px;
}

.tab {
  font-size: 14px;
  color: #969799;
  position: relative;
  padding: 8px 0;
  cursor: pointer;

  &.active {
    color: var(--van-primary-color);
    font-weight: 500;

    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 16px;
      height: 2px;
      background: var(--van-primary-color);
      border-radius: 1px;
    }
  }
}
</style> 