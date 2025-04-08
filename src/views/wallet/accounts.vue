<template>
  <Layout>
    <nav-bar
      :title="pageTitle"
      left-arrow
      fixed
    >
      <template #right v-if="mode === 'preview'">
        <span @click="onEdit">编辑</span>
      </template>
    </nav-bar>

    <div :class="$style.content">
      <!-- 账户信息表单 -->
      <div :class="$style.formGroup">
        <div :class="$style.formItem" @click="showAccountTypePicker = true && mode !== 'preview'">
          <span :class="$style.label">账户类型</span>
          <div :class="$style.value">
            <span :class="$style.text">{{ selectedType ? selectedType.text : '请选择' }}</span>
            <van-icon name="arrow" v-if="mode !== 'preview'" />
          </div>
        </div>
        <div :class="$style.formItem">
          <span :class="$style.label">账号</span>
          <van-field
            v-model="form.account"
            placeholder="请输入账号"
            :readonly="mode === 'preview'"
            :class="$style.input"
          />
        </div>
        <div :class="$style.formItem">
          <span :class="$style.label">姓名</span>
          <van-field
            v-model="form.name"
            placeholder="请输入姓名"
            :readonly="mode === 'preview'"
            :class="$style.input"
          />
        </div>
      </div>

      <!-- 提交按钮 -->
      <van-button 
        v-if="mode !== 'preview'"
        block 
        type="primary"
        :class="$style.submitBtn"
        @click="onSubmit"
      >
        {{ mode === 'add' ? '确认添加' : '保存修改' }}
      </van-button>
    </div>

    <!-- 账户类型选择器 -->
    <van-popup
      v-model:show="showAccountTypePicker"
      position="bottom"
      round
    >
      <van-picker
        :columns="accountTypesOptions"
        @confirm="onAccountTypeConfirm"
        @cancel="showAccountTypePicker = false"
        show-toolbar
      />
    </van-popup>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import Layout from '@/components/layout.vue'
import { useEnumStore } from '@/stores'
import { get, post, put } from '@/utils/request'
import NavBar from '@/components/NavBar.vue'

const enumStore = useEnumStore()
const router = useRouter()
const route = useRoute()

// 页面模式：add-添加 edit-编辑 preview-预览
const mode = ref(route.query.mode || 'add')

// 页面标题
const pageTitle = computed(() => {
  const titles = {
    add: '添加账户',
    edit: '编辑账户',
    preview: '账户详情'
  }
  return titles[mode.value]
})

// 表单数据
const form = ref({
  paymentChannelId: null, // 支付渠道ID
  account: '', // 账号
  name: '' // 姓名
})

// 账户类型列表
const accountTypesOptions = ref([])
const showAccountTypePicker = ref(false)
const selectedType = ref(null)

// 选择账户类型
const onAccountTypeConfirm = ({ selectedOptions }) => {
  selectedType.value = selectedOptions[0]
  form.value.paymentChannelId = selectedType.value.value
  showAccountTypePicker.value = false
}

// 切换到编辑模式
const onEdit = () => {
  mode.value = 'edit'
}

// 创建账户
const onCreate = async() => {
  const res = await post('withdrawals.create', form.value)
  if(res.code === 0){
    showToast('创建成功')
    router.back()
  } else {
    showToast(res.message)
  }
}

// 更新账户
const onUpdate = async() => {  
  const res = await put('withdrawals.update', form.value, {
    urlParams: {
      id: form.value.id
    }
  })
  if(res.code === 0){
    showToast('更新成功')
    router.back()
  } else {
    showToast(res.message)
  }
}

// 提交表单
const onSubmit = () => {
  if (!form.value.paymentChannelId) {
    showToast('请选择账户类型')
    return
  }

  if (!form.value.account) {
    showToast('请输入账号')
    return
  }

  if (!form.value.name) {
    showToast('请输入姓名')
    return
  }

  if(mode.value === 'add'){
    onCreate()
  } else {
    onUpdate()
  }
}

// 获取提现账户
const getWithdrawalAccount = async () => {
  const res = await get('withdrawals.accounts')
  if(res.code === 0 && res.data.length > 0){
    form.value = res.data[0]
    selectedType.value = accountTypesOptions.find(item => item.value === form.value.paymentChannelId)
  }
}

// 获取支付渠道
const getPaymentChannels = async () => {
  try {
    const res = await get('paymentChannels.list')
    accountTypesOptions.value = res.data.map(item => ({
      text: item.name,
      value: item.id
    }))
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  if(['edit', 'preview'].indexOf(mode.value) > -1){
    getWithdrawalAccount()
  }
  getPaymentChannels()
})
</script>

<style lang="less" module>
.content {
  padding: 12px;
}

.formGroup {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
}

.formItem {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f6f7;

  &:last-child {
    border-bottom: none;
  }

  .label {
    width: 70px;
    font-size: 14px;
    color: #323233;
  }

  .value {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;

    .text {
      font-size: 14px;
      color: #323233;
    }

    .van-icon {
      color: #969799;
      font-size: 16px;
    }
  }
}

.input {
  flex: 1;

  :global {
    .van-field__control {
      text-align: right;
    }

    .van-field__control[readonly] {
      color: #323233;
    }
  }
}

.submitBtn {
  --van-button-primary-background: var(--van-primary-color);
}
</style> 