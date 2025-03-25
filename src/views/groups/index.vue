<template>
  <Layout :class="$style.groupsPage">
    <!-- 顶部导航 -->
    <van-nav-bar
      title="我的小组"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />

    <!-- 列表内容 -->
    <div :class="$style.content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          v-model:finished="finished"
          finished-text="没有更多了"
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
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGroupsStore } from '@/stores'
import { get } from '@/utils/request'
import Layout from '@/components/layout.vue'

const router = useRouter()
const groupsStore = useGroupsStore()

// 底部标签数据
const tabs = ref([])
const activeTab = ref(null)

// 列表数据
const page = ref(1)
const pageSize = ref(10)
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

// 事件处理
const onClickLeft = () => {
  router.back()
}

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
  await groupsStore.getOwnedGroups()
  tabs.value = groupsStore.groups
  activeTab.value = groupsStore.groups[0].id
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