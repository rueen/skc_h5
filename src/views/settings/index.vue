<template>
  <div :class="$style.settingsPage">
    <van-nav-bar
      title="设置"
      left-arrow
      @click-left="onClickLeft"
      :class="$style.navbar"
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
            <van-icon name="translate-o" />
            <span>{{ t('settings.language') }}</span>
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
            <span>{{ t('settings.password') }}</span>
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
        {{ t('settings.logout') }}
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
        :title="t('settings.selectLanguage')"
        show-toolbar
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { showDialog, showToast } from 'vant'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const { t, locale } = useI18n()
const userStore = useUserStore()

const showLanguagePicker = ref(false)

const languages = [
  { text: '简体中文', value: 'zh' },
  { text: 'English', value: 'en' }
]

const currentLanguage = computed(() => {
  return languages.find(lang => lang.value === locale.value)?.text
})

const currentLangIndex = computed(() => {
  return languages.findIndex(lang => lang.value === locale.value)
})

const onClickLeft = () => {
  router.back()
}

const onConfirm = (value) => {
  locale.value = value.selectedValues[0];
  showLanguagePicker.value = false;
  localStorage.setItem('language', locale.value)
}

const onLogout = () => {
  showDialog({
    title: t('settings.logoutConfirm'),
    message: t('settings.logoutMessage'),
    showCancelButton: true,
    confirmButtonText: t('settings.logout'),
    cancelButtonText: t('common.cancel')
  }).then(async () => {
    try {
      await userStore.logout()
      showToast('退出登录成功')
      router.push('/login')
    } catch (error) {
      showToast(error)
    }
  })
}
</script>

<style lang="less" module>
.settingsPage {
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