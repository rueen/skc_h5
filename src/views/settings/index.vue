<template>
  <Layout>
    <nav-bar
      :title="$t('settings.title')"
      left-arrow
      fixed
    />

    <div :class="$style.content">
      <div :class="$style.menuList">
        <!-- 语言设置 -->
        <div 
          :class="$style.menuItem"
          @click="showLanguagePicker = true"
        >
          <div :class="$style.menuTitle">
            <span>{{ $t('settings.language') }}</span>
          </div>
          <div :class="$style.menuValue">
            <span>{{ currentLanguage }}</span>
            <van-icon name="arrow" />
          </div>
        </div>

        <!-- 修改密码 -->
        <div 
          :class="$style.menuItem"
          @click="router.push('/settings/password')"
        >
          <div :class="$style.menuTitle">
            <span>{{ $t('settings.password') }}</span>
          </div>
          <van-icon name="arrow" />
        </div>
      </div>
      <!-- 退出登录按钮 -->
      <van-button 
        block 
        :class="$style.logoutBtn"
        @click="onLogout"
      >
        {{ $t('settings.logout') }}
      </van-button>
    </div>

    <!-- 语言选择器 -->
    <van-popup
      v-model:show="showLanguagePicker"
      position="bottom"
      round
    >
      <van-picker
        :columns="languages"
        @confirm="onConfirm"
        @cancel="showLanguagePicker = false"
        :default-index="currentLangIndex"
        :title="$t('settings.selectLanguage')"
        show-toolbar
      />
    </van-popup>
  </Layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { showDialog, showToast } from 'vant'
import { useUserStore } from '../../stores/user'
import Layout from '@/components/layout.vue'
import NavBar from '@/components/NavBar.vue'
import { useEnumStore } from '@/stores/enum'

const router = useRouter()
const { t, locale } = useI18n()
const userStore = useUserStore()
const enumStore = useEnumStore()
const showLanguagePicker = ref(false)

const languages = [
  { text: '简体中文', value: 'zh-CN' },
  { text: 'English', value: 'en-US' },
  { text: 'Tagalog', value: 'tl-PH' }
]

const currentLanguage = computed(() => {
  return languages.find(lang => lang.value === locale.value)?.text
})

const currentLangIndex = computed(() => {
  return languages.findIndex(lang => lang.value === locale.value)
})

const onConfirm = (value) => {
  locale.value = value.selectedValues[0];
  showLanguagePicker.value = false;
  localStorage.setItem('language', locale.value)
  // 加载枚举数据
  enumStore.resetEnum();
  enumStore.fetchEnum()
}

const onLogout = () => {
  showDialog({
    title: t('settings.logoutConfirm'),
    message: t('settings.logoutMessage'),
    showCancelButton: true,
    confirmButtonText: t('settings.logout'),
    cancelButtonText: t('settings.cancel')
  }).then(async () => {
    try {
      await userStore.logout()
      showToast(t('settings.logoutSuccess'))
      router.push('/login')
    } catch (error) {
      showToast(error)
    }
  })
}
</script>

<style lang="less" module>
.content {
  padding: 12px;
}

.menuList {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.menuItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  font-size: 14px;
  color: #323233;
}

.menuTitle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.menuValue {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #969799;
  cursor: pointer;

  .van-icon {
    font-size: 16px;
  }
}

.logoutBtn {
  margin-top: 24px;
  --van-button-default-background: #fff;
  --van-button-default-border-color: transparent;
  --van-button-default-color: #ff4d4f;
  border-radius: 8px;
}
</style> 