<template>
  <div :class="$style.passwordPage">
    <van-nav-bar
      :title="t('settings.password')"
      left-arrow
      @click-left="onClickLeft"
      :class="$style.navbar"
      fixed
    />

    <div :class="$style.content">
      <div :class="$style.formGroup">
        <van-field
          v-model="form.oldPassword"
          type="password"
          :label="t('settings.currentPassword')"
          :placeholder="t('settings.currentPasswordPlaceholder')"
          :rules="[{ required: true, message: t('settings.currentPasswordPlaceholder') }]"
        />
        <van-field
          v-model="form.newPassword"
          type="password"
          :label="t('settings.newPassword')"
          :placeholder="t('settings.newPasswordPlaceholder')"
          :rules="[{ required: true, message: t('settings.newPasswordPlaceholder') }]"
        />
        <van-field
          v-model="form.confirmPassword"
          type="password"
          :label="t('settings.confirmPassword')"
          :placeholder="t('settings.confirmPasswordPlaceholder')"
          :rules="[{ required: true, message: t('settings.confirmPasswordPlaceholder') }]"
        />
      </div>

      <div :class="$style.tips">
        {{ t('settings.passwordTips') }}
      </div>

      <van-button 
        block 
        type="primary"
        :class="$style.submitBtn"
        @click="onSubmit"
      >
        {{ t('settings.password') }}
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { showToast } from 'vant'

const router = useRouter()
const { t } = useI18n()

const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const onClickLeft = () => {
  router.back()
}

const onSubmit = () => {
  if (!form.value.oldPassword) {
    showToast(t('settings.currentPasswordPlaceholder'))
    return
  }
  if (!form.value.newPassword) {
    showToast(t('settings.newPasswordPlaceholder'))
    return
  }
  if (!form.value.confirmPassword) {
    showToast(t('settings.confirmPasswordPlaceholder'))
    return
  }

  // 验证密码格式
  const passwordReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/
  if (!passwordReg.test(form.value.newPassword)) {
    showToast(t('settings.passwordTips'))
    return
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    showToast(t('settings.confirmPasswordPlaceholder'))
    return
  }

  showToast(t('settings.passwordSuccess'))
  router.back()
}
</script>

<style lang="less" module>
.passwordPage {
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

.tips {
  font-size: 12px;
  color: #969799;
  margin: 16px 0 24px;
  padding: 0 4px;
}

.submitBtn {
  --van-button-primary-background: var(--van-primary-color);
}
</style> 