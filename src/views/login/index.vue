<!--
 * @Author: diaochan
 * @Date: 2025-02-25 10:15:45
 * @LastEditors: rueen
 * @LastEditTime: 2025-07-21 18:08:33
 * @Description: 登录页
 -->
 <template>
  <div :class="$style.loginPage">
    <div :class="$style.logo">
      <h1>{{ $t('login.title') }}</h1>
      <p>{{ $t('login.titleDesc') }}</p>
    </div>

    <van-tabs v-model:active="activeTab" :class="$style.tabs" @change="onTabChange">
      <van-tab :title="$t('login.phoneLogin')">
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="formData.memberAccount"
              :label="$t('login.phone')"
              :placeholder="$t('login.phonePlaceholder')"
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
              clearable
              @clear="onInputClear('memberAccount')"
            />
            <van-field
              v-model="formData.password"
              :type="passwordVisible ? 'text' : 'password'"
              :label="$t('login.password')"
              :placeholder="$t('login.passwordPlaceholder')"
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
        :title="$t('login.selectAreaCode')"
        :confirm-button-text="$t('common.confirm')"
        :cancel-button-text="$t('common.cancel')"
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
import { checkMessages } from '@/utils/messages'
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
  { text: 'PH +63', value: '63' },
  { text: 'US +1', value: '1' },
  { text: 'GB +44', value: '44' },
  { text: 'AU +61', value: '61' },
  { text: 'JP +81', value: '81' },
  { text: 'SG +65', value: '65' },
  { text: 'KR +82', value: '82' },
  { text: 'MY +60', value: '60' },
  { text: 'TH +66', value: '66' },
  { text: 'IN +91', value: '91' },
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
  }
  showLanguagePicker.value = false
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
  areaCode: '63',
  agreed: true
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

// 提交登录
const onSubmit = async () => {
  // 根据当前选中的标签页确定登录类型
  const loginType = activeTab.value === 0 ? 'phone' : 'email'
  
  // 验证必填字段
  if (!formData.memberAccount) {
    showToast(loginType === 'phone' ? t('login.phoneRequired') : t('login.emailRequired'))
    return
  }
  
  // 验证账号格式
  if (loginType === 'phone') {
    // 验证手机号格式
    if (formData.areaCode === '63') {
      // 菲律宾手机号格式：9开头的10位数字
      const phPhoneRegex = /^9[0-9]{9}$/;
      if (!phPhoneRegex.test(formData.memberAccount)) {
        showToast(t('login.invalidPhPhone'))
        return
      }
    } else if (formData.areaCode === '1') {
      // 美国手机号格式：10位数字
      const usPhoneRegex = /^\d{10}$/;
      if (!usPhoneRegex.test(formData.memberAccount)) {
        showToast(t('login.invalidUsPhone'))
        return
      }
    } else if (formData.areaCode === '44') {
      // 英国手机号格式：通常以7或07开头的10-11位数字
      const gbPhoneRegex = /^(7|07)\d{9}$/;
      if (!gbPhoneRegex.test(formData.memberAccount)) {
        showToast(t('login.invalidGbPhone'))
        return
      }
    } else if (formData.areaCode === '61') {
      // 澳大利亚手机号格式：以04开头后跟8位数字或以4开头后跟8位数字
      const auPhoneRegex = /^(04\d{8}|4\d{8})$/;
      if (!auPhoneRegex.test(formData.memberAccount)) {
        showToast(t('login.invalidAuPhone'))
        return
      }
    } else if (formData.areaCode === '81') {
      // 日本手机号格式：以0开头后跟10-11位数字
      const jpPhoneRegex = /^0\d{9,10}$/;
      if (!jpPhoneRegex.test(formData.memberAccount)) {
        showToast(t('login.invalidJpPhone'))
        return
      }
    } else if (formData.areaCode === '65') {
      // 新加坡手机号格式：以8或9开头后跟7位数字，总共8位数字
      const sgPhoneRegex = /^[89]\d{7}$/;
      if (!sgPhoneRegex.test(formData.memberAccount)) {
        showToast(t('login.invalidSgPhone'))
        return
      }
    } else if (formData.areaCode === '82') {
      // 韩国手机号格式：以01开头后跟8-9位数字
      const krPhoneRegex = /^01\d{8,9}$/;
      if (!krPhoneRegex.test(formData.memberAccount)) {
        showToast(t('login.invalidKrPhone'))
        return
      }
    } else if (formData.areaCode === '60') {
      // 马来西亚手机号格式：以01开头后跟8-9位数字
      const myPhoneRegex = /^01\d{8,9}$/;
      if (!myPhoneRegex.test(formData.memberAccount)) {
        showToast(t('login.invalidMyPhone'))
        return
      }
    } else if (formData.areaCode === '66') {
      // 泰国手机号格式：以0开头后跟9位数字或以6或8或9开头后跟8位数字
      const thPhoneRegex = /^(0\d{9}|[689]\d{8})$/;
      if (!thPhoneRegex.test(formData.memberAccount)) {
        showToast(t('login.invalidThPhone'))
        return
      }
    } else if (formData.areaCode === '91') {
      // 印度手机号格式：以6-9开头后跟9位数字，总共10位数字
      const inPhoneRegex = /^[6-9]\d{9}$/;
      if (!inPhoneRegex.test(formData.memberAccount)) {
        showToast(t('login.invalidInPhone'))
        return
      }
    }
  } else {
    // 验证邮箱格式
    const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!emailRegex.test(formData.memberAccount)) {
      showToast(t('login.invalidEmail'))
      return
    }
  }

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
    // sessionStorage.removeItem('inviteCode')
    // 检查是否有未读通知
    await checkNotification(router)
    await checkMessages()
  } catch (error) {
    console.log(error)
  }
}

// 打开文章
const handleOpenArticle = (id, location) => {
  router.push(`/article/${id}?location=${location}`)
}

onMounted(() => {

})
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