<template>
  <Layout :class="$style.socialPage">
    <!-- 顶部导航 -->
    <nav-bar
      title="我的账号"
      left-arrow
      fixed
    />

    <!-- 列表内容 -->
    <div :class="$style.content">
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
          <div 
            :class="$style.userInfo"
            @click="onItemClick(item)"
          >
            <div :class="$style.userMeta">
              <div :class="$style.userName">
                <span>{{ item.account }}</span>
                <tag :process="item.accountAuditStatus">{{ enumStore.getEnumText('AccountAuditStatus', item.accountAuditStatus) }}</tag>
              </div>
              <div :class="$style.platform">
                <img 
                  :src="item.channelIcon" 
                  :class="$style.platformIcon"
                  alt="platform"
                />
                <span>{{ item.channelName }}</span>
              </div>
            </div>
          </div>
          <van-icon 
            name="delete-o" 
            :class="$style.deleteBtn"
            @click.stop="onDeleteClick(item)"
          />
          <van-icon name="arrow" :class="$style.arrow" />
        </div>
      </van-list>
    </div>

    <!-- 底部按钮 -->
    <div :class="$style.footer">
      <van-button 
        type="primary" 
        block
        @click="router.push('/social/detail/new')"
      >
        添加账号
      </van-button>
    </div>

    <!-- 删除确认弹窗 -->
    <van-dialog
      v-model:show="showDeleteDialog"
      title="确认删除"
      :message="`确定要删除账号「${selectedCard?.account}」吗？`"
      show-cancel-button
      @confirm="onDeleteConfirm"
    />
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { get, del } from '@/utils/request'
import { useEnumStore } from '@/stores'
import tag from '@/components/tag.vue'
import Layout from '@/components/layout.vue'
import NavBar from '@/components/NavBar.vue'

const enumStore = useEnumStore()
const router = useRouter()
const loading = ref(false)
const finished = ref(false)

// 列表数据
const list = ref([])

// 删除相关
const showDeleteDialog = ref(false)
const selectedCard = ref(null)

const onLoad = () => {
  loading.value = false
  finished.value = true
}

const onItemClick = (item) => {
  router.push(`/social/detail/${item.id}`)
}

const onDeleteClick = (item) => {
  selectedCard.value = item
  showDeleteDialog.value = true
}

const onDeleteConfirm = async () => {
  try {
    const res = await del('account.delete', {}, {
      urlParams: {
        id: selectedCard.value.id
      }
    })
    if(res.code === 0) {
      list.value = list.value.filter(item => item.id !== selectedCard.value.id)
      showToast('删除成功')
    } else {
      showToast(res.message)
    }
  } catch (error) {
    console.log(error)
  }
}

const loadList = async () => {
  try {
    const res = await get('account.list')
    if(res.code === 0) {
      list.value = res.data || []
    } else {
      showToast(res.message)
    }
  } catch (error) {
    console.log(error)
  }
}
onMounted(async () => {
  loadList()
})
</script>

<style lang="less" module>
.socialPage {
  padding-bottom: 80px;
}

.tableHeader {
  position: fixed;
  top: 46px;
  left: 0;
  right: 0;
  z-index: 99;
  background: #fff;
  display: flex;
  justify-content: space-between;
  padding: 12px 24px;
  font-size: 14px;
  color: #323233;
  border-bottom: 1px solid #f5f6f7;
  max-width: 750px;
  margin: 0 auto;
}

.content {
  padding: 12px;
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
  flex: 1;
}

.userName {
  font-size: 14px;
  color: #323233;
  margin-bottom: 6px;
}

.platform {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #969799;
}

.platformIcon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  flex-shrink: 0;
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  max-width: 750px;
  margin: 0 auto;
}

.arrow {
  margin-left: 8px;
  font-size: 16px;
  color: #969799;
}

.deleteBtn {
  font-size: 18px;
  color: #969799;
  padding: 8px;
  margin-right: -4px;
  cursor: pointer;
}
</style> 