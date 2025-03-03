<!--
 * @Author: diaochan
 * @Date: 2025-02-25 18:25:46
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-03 14:48:50
 * @Description: 
-->
<template>
  <div :class="$style.editPage">
    <van-nav-bar
      title="个人信息"
      left-arrow
      @click-left="onClickLeft"
      :class="$style.navbar"
      fixed
    >
      <template #right>
        <span :class="$style.navBtn" @click="onToggleEdit">
          {{ isEdit ? '保存' : '编辑' }}
        </span>
      </template>
    </van-nav-bar>

    <div :class="$style.content">
      <div :class="$style.formGroup">
        <!-- 头像 -->
        <div :class="$style.formItem">
          <span :class="$style.label">头像</span>
          <div :class="$style.value">
            <van-image
              :src="form.avatar"
              round
              width="40"
              height="40"
            />
            <van-icon name="arrow" v-if="isEdit" />
          </div>
        </div>

        <!-- 昵称 -->
        <div :class="$style.formItem">
          <span :class="$style.label">昵称</span>
          <template v-if="isEdit">
            <van-field
              v-model="form.name"
              placeholder="请输入昵称"
              :class="$style.input"
            />
          </template>
          <div v-else :class="$style.value">
            <span :class="$style.text">{{ form.name }}</span>
          </div>
        </div>

        <!-- 性别 -->
        <div :class="$style.formItem">
          <span :class="$style.label">性别</span>
          <template v-if="isEdit">
            <div :class="$style.value" @click="showGenderPicker = true">
              <span :class="[$style.text, $style.pickerValue]">
                {{ getGenderText(form.gender) }}
              </span>
              <van-icon name="arrow" />
            </div>
          </template>
          <div v-else :class="$style.value">
            <span :class="$style.text">{{ getGenderText(form.gender) }}</span>
          </div>
        </div>

        <!-- 职业 -->
        <div :class="$style.formItem">
          <span :class="$style.label">职业</span>
          <template v-if="isEdit">
            <div :class="$style.value" @click="showOccupationPicker = true">
              <span :class="[$style.text, $style.pickerValue]">
                {{ form.occupation ? getLangText(OccupationTypeLang, form.occupation) : '请选择' }}
              </span>
              <van-icon name="arrow" />
            </div>
          </template>
          <div v-else :class="$style.value">
            <span :class="$style.text">
              {{ form.occupation ? getLangText(OccupationTypeLang, form.occupation) : '未设置' }}
            </span>
          </div>
        </div>

        <!-- 城市 -->
        <div :class="$style.formItem">
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
        </div>

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
          <div :class="$style.value" @click="onCopyLink">
            <span :class="$style.text">{{ inviteLink }}</span>
            <van-icon name="copy" :class="$style.copyIcon" />
          </div>
        </div>
      </div>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { areaList } from '@vant/area-data'
import { OccupationType, OccupationTypeLang, getLangText } from '@/constants/enums'

const router = useRouter()

// 编辑状态
const isEdit = ref(false)

// 表单数据
const form = ref({
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  name: 'Hi Han',
  gender: '男',
  occupation: '',
  city: '广东省/深圳市/南山区',
  email: 'hihan@example.com',
  phone: '13800138000',
  telegram: '@hihan'
})

// 选择器相关
const showGenderPicker = ref(false)
const showCityPicker = ref(false)
const showOccupationPicker = ref(false)

const genderOptions = [
  { text: '男', value: 0 },
  { text: '女', value: 1 },
  { text: '保密', value: 2 }
]

// 职业类型选项
const occupationColumns = Object.entries(OccupationType).map(([_, value]) => ({
  text: getLangText(OccupationTypeLang, value),
  value
}))

// 邀请链接
const inviteLink = 'https://skc.com/invite/abc123'

// 事件处理
const onClickLeft = () => {
  router.back()
}

const onToggleEdit = () => {
  if (isEdit.value) {
    // 保存数据
    showToast('保存成功')
  }
  isEdit.value = !isEdit.value
}

const onGenderConfirm = (values) => {
  form.value.gender = values.selectedOptions[0].text
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

const getGenderText = (gender) => {
  switch (gender) {
    case '男':
      return '男'
    case '女':
      return '女'
    case '保密':
      return '保密'
    default:
      return '未设置'
  }
}

// 复制邀请链接
const onCopyLink = () => {
  navigator.clipboard.writeText(inviteLink).then(() => {
    showToast('复制成功')
  })
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

.copyIcon {
  font-size: 16px;
  color: #969799;
}
</style> 