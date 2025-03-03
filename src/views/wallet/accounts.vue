<template>
  <div :class="$style.accountPage">
    <van-nav-bar
      :title="pageTitle"
      left-arrow
      @click-left="onClickLeft"
      :class="$style.navbar"
      fixed
    >
      <template #right v-if="mode === 'preview'">
        <span @click="onEdit">编辑</span>
      </template>
    </van-nav-bar>

    <div :class="$style.content">
      <!-- 账户信息表单 -->
      <div :class="$style.formGroup">
        <div :class="$style.formItem" @click="showAccountTypePicker = true && mode !== 'preview'">
          <span :class="$style.label">账户类型</span>
          <div :class="$style.value">
            <span :class="$style.text">{{ selectedType ? selectedType.label : '请选择' }}</span>
            <van-icon name="arrow" v-if="mode !== 'preview'" />
          </div>
        </div>

        <!-- GCASH/PAYMAYA表单 -->
        <template v-if="['gcash', 'paymaya'].includes(selectedType?.value)">
          <div :class="$style.formItem">
            <span :class="$style.label">手机号</span>
            <van-field
              v-model="form.phone"
              :placeholder="mode === 'preview' ? '' : `请输入${selectedType.label}账号`"
              :readonly="mode === 'preview'"
              :class="$style.input"
            />
          </div>
          <div :class="$style.formItem">
            <span :class="$style.label">姓名</span>
            <van-field
              v-model="form.name"
              placeholder="请输入账户姓名"
              :readonly="mode === 'preview'"
              :class="$style.input"
            />
          </div>
        </template>

        <!-- 支付宝表单 -->
        <template v-if="selectedType?.value === 'alipay'">
          <div :class="$style.formItem">
            <span :class="$style.label">账号</span>
            <van-field
              v-model="form.account"
              placeholder="请输入支付宝账号"
              :readonly="mode === 'preview'"
              :class="$style.input"
            />
          </div>
          <div :class="$style.formItem">
            <span :class="$style.label">姓名</span>
            <van-field
              v-model="form.name"
              placeholder="请输入账户姓名"
              :readonly="mode === 'preview'"
              :class="$style.input"
            />
          </div>
        </template>
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
        :columns="accountTypes"
        @confirm="onAccountTypeConfirm"
        @cancel="showAccountTypePicker = false"
        show-toolbar
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'

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

// 账户类型列表
const accountTypes = [
  { text: 'GCASH', value: 'gcash', label: 'GCASH' },
  { text: 'PAYMAYA', value: 'paymaya', label: 'PAYMAYA' },
  { text: '支付宝', value: 'alipay', label: '支付宝' }
]

// 表单数据
const form = ref({
  type: '',
  phone: '',
  account: '',
  name: ''
})

// 选择器控制
const showAccountTypePicker = ref(false)
const selectedType = ref(null)

// 如果是编辑/预览模式，回填数据
if (['edit', 'preview'].includes(mode.value)) {
  // 模拟获取账户数据
  const mockAccount = {
    type: 'gcash',
    phone: '0912345678',
    name: '张三'
  }
  form.value = { ...mockAccount }
  selectedType.value = accountTypes.find(type => type.value === mockAccount.type)
}

// 选择账户类型
const onAccountTypeConfirm = (value) => {
  selectedType.value = value.selectedOptions[0]
  form.value.type = selectedType.value.value
  showAccountTypePicker.value = false
}

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 切换到编辑模式
const onEdit = () => {
  mode.value = 'edit'
}

// 提交表单
const onSubmit = () => {
  if (!form.value.type) {
    showToast('请选择账户类型')
    return
  }

  if (['gcash', 'paymaya'].includes(form.value.type)) {
    if (!form.value.phone) {
      showToast('请输入手机号')
      return
    }
  } else if (form.value.type === 'alipay') {
    if (!form.value.account) {
      showToast('请输入支付宝账号')
      return
    }
  }

  if (!form.value.name) {
    showToast('请输入账户姓名')
    return
  }

  showToast(mode.value === 'add' ? '添加成功' : '修改成功')
  router.back()
}
</script>

<style lang="less" module>
.accountPage {
  min-height: 100vh;
  background: #f7f8fa;
  padding-top: 46px;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  max-width: 750px;
  margin: 0 auto;

  :global {
    .van-nav-bar {
      background: #fff;
    }

    .van-nav-bar__title {
      color: #323233;
      font-size: 16px;
    }

    .van-nav-bar__arrow {
      color: #323233;
      font-size: 18px;
    }

    .van-icon {
      color: #323233 !important;
    }

    .van-nav-bar__right {
      color: var(--van-primary-color);
      font-size: 14px;
      padding-right: 16px;
    }
  }
}

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