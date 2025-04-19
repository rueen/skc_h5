<!--
 * @Author: diaochan
 * @Date: 2025-03-26 11:00:41
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-19 11:21:50
 * @Description: 
-->
<template>
  <Layout>
    <!-- 顶部导航 -->
    <nav-bar
      :title="$t('groups.members.title')"
      left-arrow
      fixed
    />

    <!-- 列表内容区域 -->
    <div :class="$style.tips">
      {{ $t('groups.members.tips') }}
    </div>
    <div :class="$style.content">
      <div :class="$style.header">
        <div :class="[$style.headerItem, $style.headerItemLeft]">{{ $t('groups.members.memberInfo') }}</div>
        <div :class="[$style.headerItem, $style.headerItemCenter]">{{ $t('groups.members.taskCount') }}</div>
        <div :class="[$style.headerItem, $style.headerItemRight]">{{ $t('groups.members.totalCommission') }}</div>
      </div>
      <van-pull-refresh
        v-model="refreshing"
        :pulling-text="$t('common.pullingText')"
        :loosing-text="$t('common.loosingText')"
        @refresh="onRefresh"
      >
        <van-list
          v-model:loading="loading"
          v-model:finished="finished"
          :finished-text="$t('common.finishedText')"
        >
        <div 
            v-for="item in list" 
            :key="item.id"
            :class="$style.listItem"
          >
            <div :class="[$style.userInfo, $style.listItemLeft]">
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
            <div :class="$style.listItemCenter">{{ item.taskCount }}</div>
            <div :class="[$style.listItemRight, $style.earnings]">{{ item.earnings }}</div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { get } from '@/utils/request'
import Layout from '@/components/layout.vue'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const groupId = ref(route.params.groupId)

// 列表数据
const page = ref(1)
const pageSize = ref(10)
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

// 下拉刷新
const onRefresh = () => {
  finished.value = false
  loading.value = true
  loadMembers()
}

const loadMembers = async () => {
  const res = await get('groups.members', {
    page: page.value,
    pageSize: pageSize.value
  }, {
    urlParams: {
      groupId: groupId.value
    }
  })
  if(res.code === 0){
    list.value = res.data.list
    loading.value = false
    finished.value = res.data.total <= list.value.length
    refreshing.value = false
    if (list.value.length >= res.data.total) {
      finished.value = true
    }
  }
}

onMounted(async () => {
  loadMembers()
})
</script>

<style lang="less" module>
.content {
}
.tips {
  font-size: 12px;
  color: #E82134;
  text-align: center;
  background: #FFF3EE;
  border-radius: 8px 8px 0 0;
  padding: 10px;
}

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
    width: 70px;
    text-align: center;
  }
}
.listItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #fff;
  margin-bottom: 8px;

  .listItemLeft{
    flex: 1;
  }

  .listItemCenter{
    width: 70px;
    text-align: center;
  }

  .listItemRight{
    width: 70px;
    text-align: center;
  }
}

.userInfo {
  display: flex;
  align-items: center;

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
}

.earnings {
  color: #ff4d4f;
}
</style>