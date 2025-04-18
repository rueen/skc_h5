<template>
  <Layout>
    <nav-bar
      :title="$t('settings.password')"
      left-arrow
      fixed
    />

    <div :class="$style.content">
      <div :class="$style.formGroup">
        <van-field
          v-model="form.currentPassword"
          :type="passwordVisible['currentPassword'] ? 'text' : 'password'"
          clearable
          @clear="onInputClear('currentPassword')"
          :label="$t('settings.currentPassword')"
          :placeholder="$t('settings.currentPasswordPlaceholder')"
          :rules="[{ required: true, message: $t('settings.currentPasswordPlaceholder') }]"
        >
          <template #right-icon>
            <van-icon
              :name="passwordVisible['currentPassword'] ? 'eye-o' : 'closed-eye'"
              :class="$style.passwordToggle"
              @click="togglePasswordVisibility('currentPassword')"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.newPassword"
          :type="passwordVisible['newPassword'] ? 'text' : 'password'"
          clearable
          @clear="onInputClear('newPassword')"
          :label="$t('settings.newPassword')"
          :placeholder="$t('settings.newPasswordPlaceholder')"
          :rules="[{ required: true, message: $t('settings.newPasswordPlaceholder') }]"
        >
          <template #right-icon>
            <van-icon
              :name="passwordVisible['newPassword'] ? 'eye-o' : 'closed-eye'"
              :class="$style.passwordToggle"
              @click="togglePasswordVisibility('newPassword')"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.confirmPassword"
          :type="passwordVisible['confirmPassword'] ? 'text' : 'password'"
          clearable
          @clear="onInputClear('confirmPassword')"
          :label="$t('settings.confirmPassword')"
          :placeholder="$t('settings.confirmPasswordPlaceholder')"
          :rules="[{ required: true, message: $t('settings.confirmPasswordPlaceholder') }]"
        >
          <template #right-icon>
            <van-icon
              :name="passwordVisible['confirmPassword'] ? 'eye-o' : 'closed-eye'"
              :class="$style.passwordToggle"
              @click="togglePasswordVisibility('confirmPassword')"
            />
          </template>
        </van-field>
      </div>

      <div :class="$style.tips">
        {{ $t('settings.passwordTips') }}
      </div>

      <van-button 
        block 
        type="primary"
        :class="$style.submitBtn"
        @click="onSubmit"
      >
        {{ $t('settings.password') }}
      </van-button>
    </div>
  </Layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { showToast } from 'vant'
import { post } from '@/utils/request'
import Layout from '@/components/layout.vue'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const { t } = useI18n()

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const passwordVisible = ref({
  currentPassword: false,
  newPassword: false,
  confirmPassword: false
})

// 切换密码可见性
const togglePasswordVisibility = (field) => {
  passwordVisible.value[field] = !passwordVisible.value[field]
}

// 清空输入框
const onInputClear = (field) => {
  form.value[field] = ''
}

const onSubmit = async () => {
  if (!form.value.currentPassword) {
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
    showToast(t('settings.confirmPasswordPlaceholder2'))
    return
  }

  const res = await post('auth.changePassword', {
    currentPassword: form.value.currentPassword,
    newPassword: form.value.newPassword,
    confirmPassword: form.value.confirmPassword
  })
  if(res.code === 0) {
    showToast(t('settings.passwordSuccess'))
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  } else {
    showToast(res.message)
  }
}
</script>

<style lang="less" module>
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

.passwordToggle {
  cursor: pointer;
  font-size: 18px;
  color: #969799;
  
  &:hover {
    color: var(--van-primary-color);
  }
}

.submitBtn {
  --van-button-primary-background: var(--van-primary-color);
}
</style> 