<!--
 * @Author: diaochan
 * @Date: 2025-02-25 10:15:45
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-14 18:30:17
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
              clearable
              @clear="onInputClear('memberAccount')"
            >
              <template #label>
                <div :class="$style.areaCodeWrapper" @click="showAreaCodePicker = true">
                  <span :class="$style.areaCode">+{{ formData.areaCode }}</span>
                  <van-icon name="arrow-down" />
                </div>
              </template>
            </van-field>
            <van-field
              v-model="formData.password"
              :type="passwordVisible ? 'text' : 'password'"
              :label="$t('login.password')"
              :placeholder="$t('login.passwordPlaceholder')"
              :rules="[{ required: true, message: $t('login.passwordRequired') }]"
              :class="$style.passwordInput"
              clearable
              @clear="onInputClear('password')"
            >
              <template #right-icon>
                <van-icon
                  :name="passwordVisible ? 'eye-o' : 'closed-eye'"
                  :class="$style.passwordToggle"
                  @click="togglePasswordVisibility"
                />
              </template>
            </van-field>
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
              clearable
              @clear="onInputClear('memberAccount')"
            />
            <van-field
              v-model="formData.password"
              :type="passwordVisible ? 'text' : 'password'"
              :label="$t('login.password')"
              :placeholder="$t('login.passwordPlaceholder')"
              :rules="[{ required: true, message: $t('login.passwordRequired') }]"
              clearable
              @clear="onInputClear('password')"
            >
              <template #right-icon>
                <van-icon
                  :name="passwordVisible ? 'eye-o' : 'closed-eye'"
                  :class="$style.passwordToggle"
                  @click="togglePasswordVisibility"
                />
              </template>
            </van-field>
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

    <div :class="$style.langSwitch" @click="showLanguagePicker = true">
      <van-space>
        <van-icon name="exchange" />
        <span>{{ getCurrentLanguageName() }}</span>
      </van-space>
    </div>

    <!-- 区号选择弹出层 -->
    <van-popup v-model:show="showAreaCodePicker" position="bottom" :style="{ maxHeight: '50%' }">
      <van-picker
        :columns="areaCodeColumns"
        @confirm="onAreaCodeConfirm"
        @cancel="showAreaCodePicker = false"
        show-toolbar
        title="选择区号"
      />
    </van-popup>

    <!-- 语言选择弹出层 -->
    <van-popup v-model:show="showLanguagePicker" position="bottom" :style="{ maxHeight: '50%' }">
      <van-picker
        :columns="languageColumns"
        @confirm="onLanguageConfirm"
        @cancel="showLanguagePicker = false"
        show-toolbar
        :title="$t('settings.selectLanguage')"
        :confirm-button-text="$t('common.confirm')"
        :cancel-button-text="$t('common.cancel')"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores'
import { showToast } from 'vant'
import { checkNotification } from '@/utils/notification'
import { useEnumStore } from '@/stores/enum'

const router = useRouter()
const userStore = useUserStore()
const enumStore = useEnumStore()

const { locale, t } = useI18n()

// 当前登录方式
const activeTab = ref(0)

// 密码可见性
const passwordVisible = ref(false)

// 切换密码可见性
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

// 区号选择相关
const showAreaCodePicker = ref(false)
const areaCodeColumns = [
  { text: '中国 +86', value: '86' },
  { text: 'USA +1', value: '1' },
  { text: 'Philippines +63', value: '63' },
  { text: 'UK +44', value: '44' },
  { text: 'Australia +61', value: '61' },
  { text: 'Japan +81', value: '81' },
  { text: 'South Korea +82', value: '82' },
  { text: 'Singapore +65', value: '65' },
  { text: 'Malaysia +60', value: '60' },
  { text: 'Thailand +66', value: '66' }
]

// 语言选择相关
const showLanguagePicker = ref(false)
const languageColumns = [
  { text: '简体中文', value: 'zh-CN' },
  { text: 'English', value: 'en-US' },
  { text: 'Tagalog', value: 'tl-PH' }
]

// 获取当前语言名称
const getCurrentLanguageName = () => {
  if (locale.value === 'zh-CN') return '简体中文'
  if (locale.value === 'en-US') return 'English'
  if (locale.value === 'tl-PH') return 'Tagalog'
  return '简体中文'
}

// 语言选择确认
const onLanguageConfirm = (values) => {
  const selectedLang = values.selectedOptions[0].value
  if (selectedLang !== locale.value) {
    locale.value = selectedLang
    localStorage.setItem('language', locale.value)
    // 更新区号
    formData.areaCode = getDefaultAreaCode()
  }
  showLanguagePicker.value = false
}

// 根据语言设置默认区号
const getDefaultAreaCode = () => {
  const currentLocale = locale.value
  
  // 根据语言设置默认区号
  if (currentLocale === 'zh-CN') return '86'  // 中国
  if (currentLocale === 'en-US') return '1'   // 美国
  if (currentLocale === 'tl-PH') return '63'  // 菲律宾
  
  // 也可以根据浏览器语言判断
  const browserLang = navigator.language || navigator.userLanguage
  if (browserLang.startsWith('zh')) return '86'
  if (browserLang.startsWith('en')) {
    if (browserLang === 'en-US' || browserLang === 'en-CA') return '1'
    if (browserLang === 'en-GB') return '44'
    if (browserLang === 'en-AU') return '61'
    return '1' // 默认英语区域使用美国区号
  }
  if (browserLang.startsWith('tl') || browserLang.startsWith('fil')) return '63'
  
  // 默认区号
  return '86'
}

// 监听登录方式变化
const onTabChange = (index) => {
  // 切换登录方式时清空账号字段
  formData.memberAccount = ''
}

// 表单数据
const formData = reactive({
  memberAccount: '',
  password: '',
  areaCode: getDefaultAreaCode(),
  agreed: false
})

// 清空输入框
const onInputClear = (field) => {
  formData[field] = ''
}

// 区号选择确认
const onAreaCodeConfirm = (values) => {
  formData.areaCode = values.selectedOptions[0].value
  showAreaCodePicker.value = false
}

// 组件挂载时设置区号
onMounted(() => {
  formData.areaCode = getDefaultAreaCode()
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

  if(formData.password.length < 8 || formData.password.length > 20 || !/^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/.test(formData.password)) {
    showToast(t('login.passwordTips'))
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
    await userStore.login(loginData, t('login.successMessage'))
    await userStore.fetchUserInfo()
    // 加载枚举数据
    enumStore.resetEnum();
    await enumStore.fetchEnum()
    
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

.areaCodeWrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.areaCode {
  color: var(--van-primary-color);
  margin-right: 4px;
}

.passwordToggle {
  cursor: pointer;
  font-size: 18px;
  color: #969799;
  
  &:hover {
    color: var(--van-primary-color);
  }
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
  display: flex;
  align-items: center;
  
  .van-icon {
    margin-right: 4px;
  }
}
</style> 