<!--
 * @Author: diaochan
 * @Date: 2025-02-25 18:25:46
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-16 15:39:31
 * @Description: 
-->
<template>
  <Layout>
    <nav-bar
      :title="$t('profile.info.title')"
      left-arrow
      fixed
    >
      <template #right>
        <span :class="$style.navBtn" @click="onToggleEdit">
          {{ isEdit ? $t('profile.info.cancel') : $t('profile.info.edit') }}
        </span>
      </template>
    </nav-bar>

    <div :class="$style.content">
      <div :class="$style.formGroup">
        <!-- 头像 -->
        <div :class="$style.formItem">
          <span :class="$style.label">{{ $t('profile.info.avatar') }}</span>
          <div :class="$style.value">
            <van-uploader
              :max-count="1"
              :after-read="afterRead"
              v-model="avatarFile"
              :class="$style.avatarUpload"
              v-if="isEdit"
            />
            <avatar v-else :avatar="form.avatar" width="40px" height="40px" />
          </div>
        </div>

        <!-- 昵称 -->
        <div :class="$style.formItem">
          <span :class="$style.label">{{ $t('profile.info.nickname') }}</span>
          <template v-if="isEdit">
            <van-field
              v-model="form.memberNickname"
              :placeholder="$t('profile.info.nicknamePlaceholder')"
              :class="$style.input"
              clearable
              @clear="onInputClear('memberNickname')"
            />
          </template>
          <div v-else :class="$style.value">
            <span :class="$style.text">{{ form.memberNickname }}</span>
          </div>
        </div>

        <!-- 性别 -->
        <div :class="$style.formItem">
          <span :class="$style.label">{{ $t('profile.info.gender') }}</span>
          <template v-if="isEdit">
            <div :class="$style.value" @click="showGenderPicker = true">
              <span :class="[$style.text, $style.pickerValue]">
                {{ enumStore.getEnumText('GenderType', form.gender) }}
              </span>
              <van-icon name="arrow" />
            </div>
          </template>
          <div v-else :class="$style.value">
            <span :class="$style.text">{{ enumStore.getEnumText('GenderType', form.gender) }}</span>
          </div>
        </div>

        <!-- 职业 -->
        <div :class="$style.formItem">
          <span :class="$style.label">{{ $t('profile.info.occupation') }}</span>
          <template v-if="isEdit">
            <div :class="$style.value" @click="showOccupationPicker = true">
              <span :class="[$style.text, $style.pickerValue]">
                {{ form.occupation ? enumStore.getEnumText('OccupationType', form.occupation) : $t('common.select') }}
              </span>
              <van-icon name="arrow" />
            </div>
          </template>
          <div v-else :class="$style.value">
            <span :class="$style.text">
              {{ form.occupation ? enumStore.getEnumText('OccupationType', form.occupation) : $t('profile.info.notSet') }}
            </span>
          </div>
        </div>

        <!-- 联系方式 -->
        <div :class="$style.formItem">
          <span :class="$style.label">{{ $t('profile.info.email') }}</span>
          <template v-if="isEdit">
            <van-field
              v-model="form.email"
              :placeholder="$t('profile.info.emailPlaceholder')"
              :class="$style.input"
              clearable
              @clear="onInputClear('email')"
            />
          </template>
          <div v-else :class="$style.value">
            <span :class="$style.text">{{ form.email }}</span>
          </div>
        </div>

        <div :class="$style.formItem">
          <span :class="$style.label">{{ $t('profile.info.phone') }}</span>
          <template v-if="isEdit">
            <van-field
              v-model="form.phone"
              :placeholder="$t('profile.info.phonePlaceholder')"
              :class="$style.input"
              clearable
              @clear="onInputClear('phone')"
            />
          </template>
          <div v-else :class="$style.value">
            <span :class="$style.text">{{ form.phone }}</span>
          </div>
        </div>

        <div :class="$style.formItem">
          <span :class="$style.label">Telegram</span>
          <template v-if="isEdit">
            <van-field
              v-model="form.telegram"
              :placeholder="`${t('common.inputPlaceholder')} Telegram`"
              :class="$style.input"
              clearable
              @clear="onInputClear('telegram')"
            />
          </template>
          <div v-else :class="$style.value">
            <span :class="$style.text">{{ form.telegram }}</span>
          </div>
        </div>

        <!-- 邀请链接 -->
        <div :class="$style.formItem">
          <span :class="$style.label">{{ $t('profile.info.inviteLink') }}</span>
          <div :class="$style.value">
            <div :class="$style.inviteUrl">{{ inviteUrl }}</div>
            <van-button type="primary" size="mini" @click="handleCopy(inviteUrl)">复制</van-button>
          </div>
        </div>
      </div>
      <van-button 
        block 
        type="primary"
        :class="$style.submitBtn"
        @click="onSubmit"
        v-if="isEdit"
      >{{ $t('profile.info.save') }}</van-button>
    </div>

    <!-- 性别选择器 -->
    <van-popup
      v-model:show="showGenderPicker"
      position="bottom"
      round
    >
      <van-picker
        :columns="genderOptions"
        @confirm="onGenderConfirm"
        @cancel="showGenderPicker = false"
        show-toolbar
        :confirm-button-text="$t('common.confirm')"
        :cancel-button-text="$t('common.cancel')"
      />
    </van-popup>

    <!-- 城市选择器 -->
    <van-popup
      v-model:show="showCityPicker"
      position="bottom"
      round
    >
      <van-area
        :area-list="areaList"
        @confirm="onCityConfirm"
        @cancel="showCityPicker = false"
      />
    </van-popup>

    <!-- 职业类型选择器 -->
    <van-popup
      v-model:show="showOccupationPicker"
      position="bottom"
      round
    >
      <van-picker
        :columns="occupationColumns"
        @confirm="onOccupationConfirm"
        @cancel="showOccupationPicker = false"
        show-toolbar
        :confirm-button-text="$t('common.confirm')"
        :cancel-button-text="$t('common.cancel')"
      />
    </van-popup>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { showToast, closeToast } from 'vant'
import { areaList } from '@vant/area-data'
import { useUserStore, useEnumStore } from '@/stores'
import { put } from '@/utils/request'
import avatar from '@/components/avatar.vue'
import { uploadImage } from '@/utils/upload'
import Layout from '@/components/layout.vue'
import NavBar from '@/components/NavBar.vue'
import { useI18n } from 'vue-i18n'
import { copyToClipboard } from '@/utils/copyToClipboard'

const { t } = useI18n()

const enumStore = useEnumStore()
const userStore = useUserStore()

// 编辑状态
const isEdit = ref(false)
const inviteUrl = ref('')
// 表单数据
const form = ref({})

const avatarFile = ref([])

// 选择器相关
const showGenderPicker = ref(false)
const showCityPicker = ref(false)
const showOccupationPicker = ref(false)

const genderOptions = enumStore.getEnumOptions('GenderType')

// 职业类型选项
const occupationColumns = enumStore.getEnumOptions('OccupationType')

// 清空输入框
const onInputClear = (field) => {
  form.value[field] = ''
}

// 处理头像上传
const afterRead = async (file) => {
  // 检查文件对象
  if (!file || !file.file) {
    showToast(t('common.upload.invalidFile'))
    return
  }
  
  try {
    // 显示上传中提示
    showToast({
      type: 'loading',
      message: t('common.upload.uploading'),
      forbidClick: true,
      duration: 0
    })
    
    // 调用上传图片接口，自动会进行压缩
    const result = await uploadImage(file.file, {}, {
      imageRequired: t('common.upload.imageRequired'),
      imageSize: t('common.upload.imageSize'),
      uploadFailed: t('common.upload.uploadFailed')
    })
    
    // 关闭上传中提示
    closeToast()
    
    // 更新头像地址
    if (result && result.url) {
      form.value.avatar = result.url
      showToast(t('common.upload.uploadSuccess'))
    } else {
      console.error('头像上传返回数据异常:', result)
      showToast(t('common.upload.uploadFailed'))
    }
  } catch (error) {
    // 关闭上传中提示
    closeToast()
    console.error('头像上传失败:', error)
    showToast(t('common.upload.uploadFailed'))
  }
}

const onToggleEdit = async () => {
  isEdit.value = !isEdit.value
}

const onGenderConfirm = (values) => {
  form.value.gender = values.selectedOptions[0].value
  showGenderPicker.value = false
}

const onCityConfirm = (values) => {
  form.value.city = values.selectedOptions.map(item => item.text).join('/')
  showCityPicker.value = false
}

const onOccupationConfirm = ({ selectedOptions }) => {
  form.value.occupation = selectedOptions[0].value
  showOccupationPicker.value = false
}

// 复制邀请链接
const handleCopy = (text) => {
  copyToClipboard(text)
}

const onSubmit = async () => {
  if (isEdit.value) {
    // 保存数据
    try {
      // 构建提交数据
      const submitData = {
        ...form.value,
        // 确保头像字段名称正确
        avatar: form.value.avatar || ''
      }
      
      const res = await put('member.update', submitData)
      if (res.code === 0) {
        showToast(t('profile.message.saveSuccess'))
        // 更新用户信息
        userStore.setUserInfo({
          ...userStore.userInfo,
          ...submitData
        })
        isEdit.value = false
      }
    } catch (error) {
      console.error('保存个人信息失败:', error)
      showToast(t('profile.message.saveFailed'))
    }
  }
}

onMounted(async () => {
  const userInfo = await userStore.getUserInfo()
  form.value = {
    id: userInfo.id,
    avatar: userInfo.avatar,
    memberNickname: userInfo.nickname,
    gender: userInfo.gender,
    occupation: userInfo.occupation,
    email: userInfo.email,
    phone: userInfo.phone,
    telegram: userInfo.telegram
  }
  if(userInfo.avatar){
    avatarFile.value = [{
      url: userInfo.avatar
    }]
  }
  if(userInfo.inviteCode){
    inviteUrl.value = `${window.location.origin}?inviteCode=${userInfo.inviteCode}`
  }
})
</script>

<style lang="less" module>
.content {
  padding: 12px;
}

.formGroup {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
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

  .value {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
    gap: 4px;

    .text {
      font-size: 14px;
      color: #323233;

      &.pickerValue {
        text-align: right;
        flex: 1;
      }
    }

    .van-icon {
      color: #969799;
      font-size: 16px;
    }
  }
  .inviteUrl{
    font-size: 14px;
    color: #323233;
    text-align: right;
    max-width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

.navBtn {
  font-size: 14px;
  color: var(--van-primary-color);
  cursor: pointer;
}

.text {
  font-size: 14px;
  color: #323233;

  &.pickerValue {
    color: #969799;
  }
}
.formItem{
  justify-content: space-between;
}

.avatarUpload{
  --van-uploader-size: 40px;
  --van-padding-xs: 0;
}

.submitBtn {
  --van-button-primary-background: var(--van-primary-color);
  margin-top: 30px;
}
</style> 