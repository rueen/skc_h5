<!--
 * @Author: diaochan
 * @Date: 2025-02-25 10:15:45
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-11 16:59:39
 * @Description: 登录页
 -->
 <template>
  <div :class="$style.loginPage">
    <div :class="$style.logo">
      <h1>{{ $t('login.title') }}</h1>
    </div>

    <van-tabs v-model:active="activeTab" :class="$style.tabs" @change="onTabChange">
      <van-tab :title="$t('login.phoneLogin')">
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="formData.memberAccount"
              :label="$t('login.phone')"
              :placeholder="$t('login.phonePlaceholder')"
              :rules="[{ required: true, message: $t('login.phoneRequired') }]"
            >
              <template #label>
                <span :class="$style.areaCode">+{{ formData.areaCode }}</span>
              </template>
            </van-field>
            <van-field
              v-model="formData.password"
              type="password"
              :label="$t('login.password')"
              :placeholder="$t('login.passwordPlaceholder')"
              :rules="[{ required: true, message: $t('login.passwordRequired') }]"
              :class="$style.passwordInput"
            />
          </van-cell-group>
        </van-form>
      </van-tab>

      <van-tab :title="$t('login.emailLogin')">
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="formData.memberAccount"
              :label="$t('login.email')"
              :placeholder="$t('login.emailPlaceholder')"
              :rules="[{ required: true, message: $t('login.emailRequired') }]"
            />
            <van-field
              v-model="formData.password"
              type="password"
              :label="$t('login.password')"
              :placeholder="$t('login.passwordPlaceholder')"
              :rules="[{ required: true, message: $t('login.passwordRequired') }]"
            />
          </van-cell-group>
        </van-form>
      </van-tab>
    </van-tabs>

    <div :class="$style.tips">
      * {{ $t('login.passwordTips') }}
    </div>
      
    <div :class="$style.submit">
      <div :class="$style.tip">{{ $t('login.registerTips') }}</div>
      <van-button type="primary" block @click="onSubmit">
        {{ $t('login.login') }}
      </van-button>

      <van-checkbox v-model="formData.agreed" :class="$style.agreement">
        {{ $t('login.agreement') }}
        <a @click.stop="handleOpenArticle('0', 'userAgreement')">{{ $t('login.userAgreement') }}</a>
        {{ $t('login.and') }}
        <a @click.stop="handleOpenArticle('0', 'privacyPolicy')">{{ $t('login.privacyPolicy') }}</a>
      </van-checkbox>
    </div>

    <div :class="$style.langSwitch" @click="toggleLang">
      {{ locale === 'zh' ? 'English' : '中文' }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores'
import { showToast } from 'vant'
import { checkNotification } from '@/utils/notification'

const router = useRouter()
const userStore = useUserStore()

const { locale } = useI18n()

// 当前登录方式
const activeTab = ref(0)

// 监听登录方式变化
const onTabChange = (index) => {
  // 切换登录方式时清空账号字段
  formData.memberAccount = ''
}

// 表单数据
const formData = reactive({
  memberAccount: '',
  password: '',
  areaCode: '86',
  agreed: false
})

// 提交登录
const onSubmit = async () => {
  if (!formData.agreed) {
    showToast(t('login.agreementRequired'))
    return
  }
  if (!formData.password) {
    showToast(t('login.passwordRequired'))
    return
  }

  // 根据当前选中的标签页确定登录类型
  const loginType = activeTab.value === 0 ? 'phone' : 'email'
  
  // 验证必填字段
  if (!formData.memberAccount) {
    showToast(loginType === 'phone' ? t('login.phoneRequired') : t('login.emailRequired'))
    return
  }

  try {
    // 准备登录数据
    const loginData = {
      loginType,
      memberAccount: formData.memberAccount,
      password: formData.password
    }

    // 如果是手机号登录，添加区号
    if (loginType === 'phone') {
      loginData.areaCode = formData.areaCode
    }

    // 检查会话存储中是否有邀请码
    const inviteCode = sessionStorage.getItem('inviteCode')
    if (inviteCode) {
      // 将邀请码添加到登录数据中，后端可以处理用户注册时的邀请关系
      loginData.inviteCode = inviteCode
    }

    // 调用登录 API
    await userStore.login(loginData)
    await userStore.fetchUserInfo()
    
    // 检查是否有重定向URL
    const redirectUrl = sessionStorage.getItem('redirectUrl')
    if (redirectUrl) {
      // 清除会话存储中的重定向URL
      sessionStorage.removeItem('redirectUrl')
      // 跳转到重定向URL
      router.push(redirectUrl)
    } else {
      // 没有重定向URL，跳转到首页
      router.push('/')
    }
    // 登录成功后清除邀请码
    sessionStorage.removeItem('inviteCode')
    // 检查是否有未读通知
    checkNotification(router)
  } catch (error) {
    console.log(error)
  }
}

// 切换语言
const toggleLang = () => {
  locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  localStorage.setItem('language', locale.value)
}

// 打开文章
const handleOpenArticle = (id, location) => {
  router.push(`/article/${id}?location=${location}`)
}
</script>

<style lang="less" module>
.loginPage {
  min-height: 100vh;
  padding: 40px 10px;
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
  margin-left: var(--van-cell-group-inset-padding);
  margin-right: var(--van-cell-group-inset-padding);
  margin-top: 50px;
  padding: 0 20px;
}

.tip {
  font-size: 12px;
  color: #969799;
  text-align: center;
  margin-bottom: 16px;
}

.agreement {
  margin-top: 16px;
  font-size: 12px;
  color: #666;
  text-align: center;
  justify-content: center;

  a {
    color: var(--van-primary-color);
    text-decoration: none;
  }
}

.tips {
  font-size: 12px;
  color: #969799;
  margin: 16px 0 24px;
  padding: 0 4px;
  margin: var(--van-cell-group-inset-padding) 0;
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