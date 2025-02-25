<!--
 * @Author: diaochan
 * @Date: 2025-02-25 10:15:45
 * @LastEditors: diaochan
 * @LastEditTime: 2025-02-25 10:25:33
 * @Description: 登录页
 -->
<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

// 当前语言
const currentLang = ref('zh')
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
    showToast('请输入手机号')
    return
  }
  if (activeTab.value === 1 && !formData.email) {
    showToast('请输入邮箱')
    return
  }
  // TODO: 调用获取验证码接口
  showToast('验证码已发送')
}

// 提交登录
const onSubmit = () => {
  if (!formData.agreed) {
    showToast('请同意用户协议和隐私政策')
    return
  }
  if (!formData.code) {
    showToast('请输入验证码')
    return
  }
  // TODO: 调用登录接口
  userStore.setToken('mock_token')
  router.push('/')
}

// 切换语言
const toggleLang = () => {
  currentLang.value = currentLang.value === 'zh' ? 'en' : 'zh'
  // TODO: 触发全局语言切换
}
</script>

<template>
  <div :class="$style.loginPage">
    <div :class="$style.logo">
      <h1>SKC 种草</h1>
      <p>{{ currentLang === 'zh' ? '分享你的种草清单' : 'Share Your Shopping List' }}</p>
    </div>

    <van-tabs v-model:active="activeTab" :class="$style.tabs">
      <van-tab :title="currentLang === 'zh' ? '手机号登录' : 'Phone Login'">
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="formData.phone"
              :label="currentLang === 'zh' ? '手机号' : 'Phone'"
              :placeholder="currentLang === 'zh' ? '请输入手机号' : 'Enter phone number'"
              :rules="[{ required: true, message: currentLang === 'zh' ? '请输入手机号' : 'Phone number is required' }]"
            >
              <template #label>
                <span :class="$style.areaCode" @click="showArea = true">+{{ formData.areaCode }}</span>
              </template>
            </van-field>
            <van-field
              v-model="formData.code"
              center
              :label="currentLang === 'zh' ? '验证码' : 'Code'"
              :placeholder="currentLang === 'zh' ? '请输入验证码' : 'Enter verification code'"
            >
              <template #button>
                <van-button size="small" type="primary" @click="getVerifyCode">
                  {{ currentLang === 'zh' ? '获取验证码' : 'Get Code' }}
                </van-button>
              </template>
            </van-field>
          </van-cell-group>
        </van-form>
      </van-tab>

      <van-tab :title="currentLang === 'zh' ? '邮箱登录' : 'Email Login'">
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="formData.email"
              :label="currentLang === 'zh' ? '邮箱' : 'Email'"
              :placeholder="currentLang === 'zh' ? '请输入邮箱' : 'Enter email address'"
              :rules="[{ required: true, message: currentLang === 'zh' ? '请输入邮箱' : 'Email is required' }]"
            />
            <van-field
              v-model="formData.code"
              center
              :label="currentLang === 'zh' ? '验证码' : 'Code'"
              :placeholder="currentLang === 'zh' ? '请输入验证码' : 'Enter verification code'"
            >
              <template #button>
                <van-button size="small" type="primary" @click="getVerifyCode">
                  {{ currentLang === 'zh' ? '获取验证码' : 'Get Code' }}
                </van-button>
              </template>
            </van-field>
          </van-cell-group>
        </van-form>
      </van-tab>
    </van-tabs>

    <div :class="$style.submit">
      <van-checkbox v-model="formData.agreed" :class="$style.agreement">
        {{ currentLang === 'zh' ? '我已阅读并同意' : 'I have read and agree to' }}
        <a href="#">{{ currentLang === 'zh' ? '《用户协议》' : 'User Agreement' }}</a>
        {{ currentLang === 'zh' ? '和' : 'and' }}
        <a href="#">{{ currentLang === 'zh' ? '《隐私政策》' : 'Privacy Policy' }}</a>
      </van-checkbox>

      <van-button type="primary" block @click="onSubmit">
        {{ currentLang === 'zh' ? '登录' : 'Login' }}
      </van-button>
    </div>

    <div :class="$style.langSwitch" @click="toggleLang">
      {{ currentLang === 'zh' ? 'English' : '中文' }}
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
    font-size: 28px;
    font-weight: bold;
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