<!--
 * @Author: diaochan
 * @Date: 2025-02-25 18:25:46
 * @LastEditors: rueen
 * @LastEditTime: 2025-02-25 19:30:47
 * @Description: 
-->
<template>
  <div :class="$style.editPage">
    <van-nav-bar
      title="编辑个人信息"
      left-arrow
      @click-left="onClickLeft"
      :class="$style.navbar"
      fixed
    />

    <div :class="$style.content">
      <!-- 头像 -->
      <div :class="$style.avatarItem" @click="onAvatarClick">
        <div :class="$style.avatarContent">
          <van-image
            round
            width="70"
            height="70"
            :src="form.avatar"
          />
          <span :class="$style.avatarText">点击更换头像</span>
        </div>
      </div>

      <!-- 基本信息 -->
      <div :class="$style.formGroup">
        <div :class="$style.formItem">
          <span :class="$style.label">名称</span>
          <van-field
            v-model="form.name"
            placeholder="请输入名称"
            :class="$style.input"
          />
        </div>

        <div :class="$style.formItem">
          <span :class="$style.label">性别</span>
          <div :class="$style.value" @click="showGenderPicker = true">
            <span :class="[$style.text, $style.pickerValue]">{{ form.gender || '请选择' }}</span>
            <van-icon name="arrow" />
          </div>
        </div>

        <div :class="$style.formItem">
          <span :class="$style.label">职业</span>
          <van-field
            v-model="form.occupation"
            placeholder="请输入职业"
            :class="$style.input"
          />
        </div>

        <div :class="$style.formItem">
          <span :class="$style.label">城市</span>
          <div :class="$style.value" @click="showCityPicker = true">
            <span :class="[$style.text, $style.pickerValue]">{{ form.city || '请选择' }}</span>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>

      <!-- 联系方式 -->
      <div :class="$style.formGroup">
        <div :class="$style.formItem">
          <span :class="$style.label">电子邮箱</span>
          <van-field
            v-model="form.email"
            placeholder="请输入邮箱"
            :class="$style.input"
          />
        </div>

        <div :class="$style.formItem">
          <span :class="$style.label">手机号码</span>
          <van-field
            v-model="form.phone"
            placeholder="请输入手机号"
            :class="$style.input"
          />
        </div>

        <div :class="$style.formItem">
          <span :class="$style.label">Telegram</span>
          <van-field
            v-model="form.telegram"
            placeholder="请输入Telegram"
            :class="$style.input"
          />
        </div>
      </div>

      <!-- 保存按钮 -->
      <van-button 
        type="primary" 
        block
        :class="$style.saveBtn"
        @click="onSave"
      >
        保存
      </van-button>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { areaList } from '@vant/area-data'

const router = useRouter()

// 表单数据
const form = ref({
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  name: 'Hi Han',
  gender: '男',
  occupation: '自由职业',
  city: '广东省/深圳市/南山区',
  email: 'hihan@example.com',
  phone: '13800138000',
  telegram: '@hihan'
})

// 选择器相关
const showGenderPicker = ref(false)
const showCityPicker = ref(false)

const genderOptions = [
  { text: '男', value: 0 },
  { text: '女', value: 1 },
  { text: '保密', value: 2 }
]

// 事件处理
const onClickLeft = () => {
  router.back()
}

const onSave = () => {
  showToast('保存成功')
  router.back()
}

const onAvatarClick = () => {
  showToast('头像上传功能开发中')
}

const onGenderConfirm = (values) => {
  form.value.gender = values.selectedOptions[0].text
  showGenderPicker.value = false
}

const onCityConfirm = (values) => {
  form.value.city = values.selectedOptions.map(item => item.text).join('/')
  showCityPicker.value = false
}
</script>

<style lang="less" module>
.editPage {
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

    .van-nav-bar__text {
      color: var(--van-primary-color);
    }
  }
}

.content {
  padding: 12px;
}

.avatarItem {
  padding: 24px 16px;
  cursor: pointer;
}

.avatarContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.avatarText {
  font-size: 12px;
  color: #c8c9cc;
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

.saveBtn {
  margin-top: 24px;
}
</style> 