<!--
 * @Author: diaochan
 * @Date: 2025-02-25 18:25:46
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-22 19:42:38
 * @Description: 
-->
<template>
  <Layout>
    <van-nav-bar
      title="个人信息"
      left-arrow
      @click-left="onClickLeft"
      fixed
    >
      <template #right>
        <span :class="$style.navBtn" @click="onToggleEdit">
          {{ isEdit ? '取消' : '编辑' }}
        </span>
      </template>
    </van-nav-bar>

    <div :class="$style.content">
      <div :class="$style.formGroup">
        <!-- 头像 -->
        <div :class="$style.formItem">
          <span :class="$style.label">头像</span>
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
          <span :class="$style.label">昵称</span>
          <template v-if="isEdit">
            <van-field
              v-model="form.memberNickname"
              placeholder="请输入昵称"
              :class="$style.input"
            />
          </template>
          <div v-else :class="$style.value">
            <span :class="$style.text">{{ form.memberNickname }}</span>
          </div>
        </div>

        <!-- 性别 -->
        <div :class="$style.formItem">
          <span :class="$style.label">性别</span>
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
          <span :class="$style.label">职业</span>
          <template v-if="isEdit">
            <div :class="$style.value" @click="showOccupationPicker = true">
              <span :class="[$style.text, $style.pickerValue]">
                {{ form.occupation ? enumStore.getEnumText('OccupationType', form.occupation) : '请选择' }}
              </span>
              <van-icon name="arrow" />
            </div>
          </template>
          <div v-else :class="$style.value">
            <span :class="$style.text">
              {{ form.occupation ? enumStore.getEnumText('OccupationType', form.occupation) : '未设置' }}
            </span>
          </div>
        </div>

        <!-- 城市 -->
        <!-- <div :class="$style.formItem">
          <span :class="$style.label">城市</span>
          <template v-if="isEdit">
            <div :class="$style.value" @click="showCityPicker = true">
              <span :class="[$style.text, $style.pickerValue]">{{ form.city || '请选择' }}</span>
              <van-icon name="arrow" />
            </div>
          </template>
          <div v-else :class="$style.value">
            <span :class="$style.text">{{ form.city || '未设置' }}</span>
          </div>
        </div> -->

        <!-- 联系方式 -->
        <div :class="$style.formItem">
          <span :class="$style.label">电子邮箱</span>
          <template v-if="isEdit">
            <van-field
              v-model="form.email"
              placeholder="请输入邮箱"
              :class="$style.input"
            />
          </template>
          <div v-else :class="$style.value">
            <span :class="$style.text">{{ form.email }}</span>
          </div>
        </div>

        <div :class="$style.formItem">
          <span :class="$style.label">手机号码</span>
          <template v-if="isEdit">
            <van-field
              v-model="form.phone"
              placeholder="请输入手机号"
              :class="$style.input"
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
              placeholder="请输入Telegram"
              :class="$style.input"
            />
          </template>
          <div v-else :class="$style.value">
            <span :class="$style.text">{{ form.telegram }}</span>
          </div>
        </div>

        <!-- 邀请链接 -->
        <div :class="$style.formItem">
          <span :class="$style.label">邀请链接</span>
          <div :class="$style.value" @click="handleCopy(userInfo.inviteCode)">
            <span :class="$style.text">{{ userInfo.inviteCode }}</span>
            <van-icon name="copy" :class="$style.copyIcon" />
          </div>
        </div>
        <!-- 群链接 -->
        <div :class="$style.formItem">
          <span :class="$style.label">群链接</span>
          <div :class="$style.groupList">
            <div v-for="item in userInfo.groups">
              <div @click="handleJoinGroup(item.groupLink)">
                <span :class="$style.text">{{ item.groupLink }}</span>
                <span :class="$style.joinBtn">入群</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <van-button 
        block 
        type="primary"
        :class="$style.submitBtn"
        @click="onSubmit"
        v-if="isEdit"
      >保存</van-button>
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
      />
    </van-popup>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, closeToast } from 'vant'
import { areaList } from '@vant/area-data'
import { useUserStore, useEnumStore } from '@/stores'
import { put } from '@/utils/request'
import avatar from '@/components/avatar.vue'
import { uploadImage } from '@/utils/upload'
import Layout from '@/components/layout.vue'

const router = useRouter()
const enumStore = useEnumStore()
const userStore = useUserStore()

// 编辑状态
const isEdit = ref(false)

const userInfo = userStore.userInfo
// 表单数据
const form = ref({
  id: userInfo.id,
  avatar: userInfo.avatar,
  memberNickname: userInfo.memberNickname,
  gender: userInfo.gender,
  occupation: userInfo.occupation,
  email: userInfo.email,
  phone: userInfo.phone,
  telegram: userInfo.telegram
})
const avatarFile = ref([{
  url: userInfo.avatar
}])

// 选择器相关
const showGenderPicker = ref(false)
const showCityPicker = ref(false)
const showOccupationPicker = ref(false)

const genderOptions = enumStore.getEnumOptions('GenderType')

// 职业类型选项
const occupationColumns = enumStore.getEnumOptions('OccupationType')

// 处理头像上传
const afterRead = async (file) => {
  // 检查文件对象
  if (!file || !file.file) {
    showToast('文件无效')
    return
  }
  
  try {
    // 显示上传中提示
    showToast({
      type: 'loading',
      message: '上传中...',
      forbidClick: true,
      duration: 0
    })
    
    // 调用上传图片接口
    const result = await uploadImage(file.file)
    
    // 关闭上传中提示
    closeToast()
    
    // 更新头像地址
    if (result && result.url) {
      form.value.avatar = result.url
      showToast('上传成功')
    } else {
      console.error('头像上传返回数据异常:', result)
      showToast('上传失败，返回数据异常')
    }
  } catch (error) {
    // 关闭上传中提示
    closeToast()
    console.error('头像上传失败:', error)
    showToast('上传失败，请重试')
  }
}

// 事件处理
const onClickLeft = () => {
  router.back()
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
  navigator.clipboard.writeText(text).then(() => {
    showToast('复制成功')
  })
}

const handleJoinGroup = (groupLink) => {
  window.open(groupLink, '_blank')
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
        showToast('保存成功')
        // 更新用户信息
        userStore.setUserInfo({
          ...userStore.userInfo,
          ...submitData
        })
        isEdit.value = false
      }
    } catch (error) {
      console.error('保存个人信息失败:', error)
      showToast('保存失败')
    }
  }
}

onMounted(async () => {
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
.groupList{
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: flex-end;
}
.joinBtn{
  font-size: 14px;
  color: var(--van-primary-color);
  cursor: pointer;
  margin-left: 12px;
}
.copyIcon {
  font-size: 16px;
  color: #969799;
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