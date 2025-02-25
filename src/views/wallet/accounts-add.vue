<template>
  <div :class="$style.addPage">
    <van-nav-bar
      title="添加银行卡"
      left-arrow
      @click-left="onClickLeft"
      :class="$style.navbar"
      fixed
    />

    <div :class="$style.content">
      <!-- 账户信息表单 -->
      <div :class="$style.formGroup">
        <div :class="$style.formItem">
          <span :class="$style.label">开户银行</span>
          <van-field
            v-model="form.bankName"
            placeholder="请输入开户银行"
            :class="$style.input"
          />
        </div>
        <div :class="$style.formItem">
          <span :class="$style.label">银行卡号</span>
          <van-field
            v-model="form.accountNo"
            placeholder="请输入银行卡号"
            :class="$style.input"
          />
        </div>
        <div :class="$style.formItem">
          <span :class="$style.label">持卡人</span>
          <van-field
            v-model="form.accountName"
            placeholder="请输入持卡人姓名"
            :class="$style.input"
          />
        </div>
      </div>

      <!-- 保存按钮 -->
      <van-button 
        block 
        type="primary"
        :class="$style.saveBtn"
        @click="onSave"
      >
        保存
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 表单数据
const form = reactive({
  bankName: '',
  accountNo: '',
  accountName: ''
})

// 事件处理
const onClickLeft = () => {
  router.back()
}

const onSave = () => {
  // 表单验证
  if (!form.bankName) {
    showToast('请输入开户银行')
    return
  }
  if (!form.accountNo) {
    showToast('请输入银行卡号')
    return
  }
  if (!form.accountName) {
    showToast('请输入持卡人姓名')
    return
  }

  showToast('保存成功')
  router.back()
}
</script>

<style lang="less" module>
.addPage {
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
  }
}

.content {
  padding: 12px;
}

.formGroup {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
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
    width: 80px;
    font-size: 14px;
    color: #323233;
  }
}

.input {
  flex: 1;
  padding: 0;
  background: transparent;

  :global {
    .van-field__body {
      text-align: right;
    }

    .van-field__control {
      text-align: right;
      font-size: 14px;
      color: #323233;
    }

    .van-cell {
      padding: 0;
      line-height: normal;
    }
  }
}

.saveBtn {
  margin-top: 24px;
  --van-button-primary-background: var(--van-primary-color);
}
</style> 