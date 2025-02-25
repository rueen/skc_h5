<!--
 * @Author: diaochan
 * @Date: 2025-02-25 10:15:45
 * @LastEditors: rueen
 * @LastEditTime: 2025-02-25 20:55:45
 * @Description: 登录页
 -->
<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()
const { t, locale } = useI18n()

// 当前登录方式
const activeTab = ref(0)

// 表单数据
const formData = reactive({
  phone: '',
  email: '',
  code: '',
  areaCode: '86',
  agreed: false
})

// 获取验证码
const getVerifyCode = () => {
  if (activeTab.value === 0 && !formData.phone) {
    showToast(t('login.phoneRequired'))
    return
  }
  if (activeTab.value === 1 && !formData.email) {
    showToast(t('login.emailRequired'))
    return
  }
  showToast(t('login.codeSent'))
}

// 提交登录
const onSubmit = () => {
  if (!formData.agreed) {
    showToast(t('login.agreementRequired'))
    return
  }
  if (!formData.code) {
    showToast(t('login.codeRequired'))
    return
  }
  userStore.setToken('mock_token')
  router.push('/')
}

// 切换语言
const toggleLang = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
  localStorage.setItem('language', locale.value)
}
</script>

<template>
  <div :class="$style.loginPage">
    <div :class="$style.logo">
      <h1>{{ t('login.title') }}</h1>
    </div>

    <van-tabs v-model:active="activeTab" :class="$style.tabs">
      <van-tab :title="t('login.phoneLogin')">
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="formData.phone"
              :label="t('login.phone')"
              :placeholder="t('login.phonePlaceholder')"
              :rules="[{ required: true, message: t('login.phoneRequired') }]"
            >
              <template #label>
                <span :class="$style.areaCode">+{{ formData.areaCode }}</span>
              </template>
            </van-field>
            <van-field
              v-model="formData.code"
              center
              :label="t('login.code')"
              :placeholder="t('login.codePlaceholder')"
            >
              <template #button>
                <van-button size="small" type="primary" @click="getVerifyCode">
                  {{ t('login.getCode') }}
                </van-button>
              </template>
            </van-field>
          </van-cell-group>
        </van-form>
      </van-tab>

      <van-tab :title="t('login.emailLogin')">
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="formData.email"
              :label="t('login.email')"
              :placeholder="t('login.emailPlaceholder')"
              :rules="[{ required: true, message: t('login.emailRequired') }]"
            />
            <van-field
              v-model="formData.code"
              center
              :label="t('login.code')"
              :placeholder="t('login.codePlaceholder')"
            >
              <template #button>
                <van-button size="small" type="primary" @click="getVerifyCode">
                  {{ t('login.getCode') }}
                </van-button>
              </template>
            </van-field>
          </van-cell-group>
        </van-form>
      </van-tab>
    </van-tabs>

    <div :class="$style.submit">
      <van-checkbox v-model="formData.agreed" :class="$style.agreement">
        {{ t('login.agreement') }}
        <a href="#">{{ t('login.userAgreement') }}</a>
        {{ t('login.and') }}
        <a href="#">{{ t('login.privacyPolicy') }}</a>
      </van-checkbox>

      <van-button type="primary" block @click="onSubmit">
        {{ t('login.login') }}
      </van-button>
    </div>

    <div :class="$style.langSwitch" @click="toggleLang">
      {{ locale === 'zh' ? 'English' : '中文' }}
    </div>
  </div>
</template>

<style lang="less" module>
.loginPage {
  min-height: 100vh;
  padding: 40px 20px;
  box-sizing: border-box;
  background: #fff;
}

.logo {
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 32px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: #999;
  }
}

.tabs {
  margin-bottom: 24px;

  :global {
    .van-tabs__line {
      background-color: var(--van-primary-color);
    }
  }
}

.areaCode {
  color: var(--van-primary-color);
  margin-right: 8px;
}

.submit {
  margin-top: 24px;
}

.agreement {
  margin-bottom: 16px;
  font-size: 12px;
  color: #666;

  a {
    color: var(--van-primary-color);
    text-decoration: none;
  }
}

.langSwitch {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}
</style> 