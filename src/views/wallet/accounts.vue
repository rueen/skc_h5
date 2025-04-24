<template>
  <Layout>
    <nav-bar
      :title="pageTitle"
      left-arrow
      fixed
      :right-text="mode === 'add' ? '' : (isEditing ? t('wallet.accounts.cancel') : t('wallet.accounts.edit'))"
      @click-right="onClickRight"
    />

    <div :class="$style.content">
      <!-- 账户信息表单 -->
      <div :class="$style.formGroup">
        <div :class="$style.formItem" @click="showAccountTypePicker = true && mode !== 'preview'">
          <span :class="$style.label">{{ t('wallet.accounts.accountType') }}</span>
          <div :class="$style.value">
            <span :class="$style.text">{{ selectedType ? selectedType.text : t('wallet.accounts.pleaseSelect') }}</span>
            <van-icon name="arrow" v-if="mode !== 'preview'" />
          </div>
        </div>
        <div :class="$style.formItem">
          <span :class="$style.label">{{ t('wallet.accounts.account') }}</span>
          <van-field
            v-model="form.account"
            :placeholder="t('wallet.accounts.accountPlaceholder')"
            :readonly="mode === 'preview'"
            :class="$style.input"
            clearable
            @clear="onInputClear('account')"
          />
        </div>
        <div :class="$style.formItem">
          <span :class="$style.label">{{ t('wallet.accounts.name') }}</span>
          <van-field
            v-model="form.name"
            :placeholder="t('wallet.accounts.namePlaceholder')"
            :readonly="mode === 'preview'"
            :class="$style.input"
            clearable
            @clear="onInputClear('name')"
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
        {{ mode === 'add' ? t('wallet.accounts.confirmAdd') : t('wallet.accounts.saveChanges') }}
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
        :confirm-button-text="$t('common.confirm')"
        :cancel-button-text="$t('common.cancel')"
      />
    </van-popup>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showDialog } from 'vant'
import Layout from '@/components/layout.vue'
import { useEnumStore } from '@/stores'
import { get, post, put } from '@/utils/request'
import NavBar from '@/components/NavBar.vue'
import { useI18n } from 'vue-i18n'

const enumStore = useEnumStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
// 页面模式：add-添加 edit-编辑 preview-预览
const mode = ref(route.query.mode || 'add')
const isEditing = ref(false)

// 页面标题
const pageTitle = computed(() => {
  const titles = {
    add: t('wallet.accounts.addTitle'),
    edit: t('wallet.accounts.editTitle'),
    preview: t('wallet.accounts.previewTitle')
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

// 清空输入框
const onInputClear = (field) => {
  form.value[field] = ''
}

// 选择账户类型
const onAccountTypeConfirm = ({ selectedOptions }) => {
  selectedType.value = selectedOptions[0]
  form.value.paymentChannelId = selectedType.value.value
  showAccountTypePicker.value = false
}

// 切换编辑状态
const onClickRight = () => {
  isEditing.value = !isEditing.value
  if(isEditing.value){
    mode.value = 'edit'
  } else {
    mode.value = 'preview'
  }
}

// 创建账户
const onCreate = async() => {
  const params = {
    paymentChannelId: form.value.paymentChannelId, // 支付渠道ID
    account: form.value.account.trim(), // 账号
    name: form.value.name.trim() // 姓名
  }
  const res = await post('withdrawals.create', params)
  if(res.code === 0){
    showToast(t('wallet.accounts.createSuccess'))
    router.back()
  } else {
    showToast(res.message)
  }
}

// 更新账户
const onUpdate = async() => {
  const params = {
    paymentChannelId: form.value.paymentChannelId, // 支付渠道ID
    account: form.value.account.trim(), // 账号
    name: form.value.name.trim() // 姓名
  }
  const res = await put('withdrawals.update', params, {
    urlParams: {
      id: form.value.id
    }
  })
  if(res.code === 0){
    showToast(t('wallet.accounts.updateSuccess'))
    router.back()
  } else {
    showToast(res.message)
  }
}

// 提交表单
const onSubmit = () => {
  if (!form.value.paymentChannelId) {
    showToast(t('wallet.accounts.pleaseSelectAccountType'))
    return
  }

  if (!form.value.account) {
    showToast(t('wallet.accounts.pleaseEnterAccount'))
    return
  }

  if(!/^0\d{10}$/.test(form.value.account)){
    showDialog({
      title: t('wallet.accounts.invalidAccount'),
      message: t('wallet.accounts.invalidAccountMessage'),
      showCancelButton: false,
      confirmButtonText: t('common.confirm'),
    })
    return
  }

  if (!form.value.name) {
    showToast(t('wallet.accounts.pleaseEnterName'))
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
    selectedType.value = accountTypesOptions.value.find(item => item.value === form.value.paymentChannelId)
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

onMounted(async () => {
  await getPaymentChannels()
  if(['edit', 'preview'].indexOf(mode.value) > -1){
    await getWithdrawalAccount()
  }
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