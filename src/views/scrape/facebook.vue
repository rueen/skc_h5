<template>
  <Layout>
    <nav-bar
      title="Find Facebook ID"
      :left-arrow="false"
      fixed
    />
    <div class="facebook-scraper">
      <div class="form-section">
        <!-- 类型选择 -->
        <div class="type-selector">
          <label class="field-label">Type:</label>
          <van-radio-group v-model="form.type" direction="horizontal">
            <van-radio name="profile" class="radio-item">Profile</van-radio>
            <van-radio name="post" class="radio-item">Post</van-radio>
            <van-radio name="group" class="radio-item">Group</van-radio>
          </van-radio-group>
        </div>

        <!-- URL输入框 -->
        <div class="url-input">
          <label class="field-label">
            {{ typeLabels[form.type] }} Link:
          </label>
          <van-cell-group style="margin: 0;border-radius: 0;" inset>
            <van-field
              v-model="form.url"
              type="text"
              :placeholder="placeholders[form.type]"
              class="url-field"
              clearable
              @clear="onInputClear"
            />
          </van-cell-group>
        </div>

        <!-- 查找按钮 -->
        <div class="button-section">
          <van-button
            type="primary"
            size="large"
            :loading="loading"
            @click="handleScrape"
            :disabled="!form.url.trim()"
            class="scrape-button"
          >
            {{ loading ? 'Finding...' : 'Find' }}
          </van-button>
        </div>
      </div>

      <!-- 结果显示区域 -->
      <div v-if="result" class="result-section">
        <div class="result-header">
          <h3>Result</h3>
          <van-button 
            size="small" 
            type="default"
            @click="copyResult"
            class="copy-button"
          >
            Copy
          </van-button>
        </div>
        
        <div class="result-content">
          <pre>{{ formatResult(result) }}</pre>
        </div>
      </div>

      <!-- 错误信息显示 -->
      <div v-if="error" class="error-section">
        <van-notice-bar
          type="warning"
          :text="error"
          closeable
          @close="error = ''"
        />
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { showToast } from 'vant'
import { post } from '@/utils/request'
import Layout from '@/components/layout.vue'
import NavBar from '@/components/NavBar.vue'

const loading = ref(false)
const result = ref(null)
const error = ref('')

/**
 * 表单数据
 */
const form = reactive({
  type: 'profile',
  url: ''
})

/**
 * 类型标签映射
 */
const typeLabels = {
  profile: 'Profile',
  post: 'Post',
  group: 'Group'
}

/**
 * 输入框占位符
 */
const placeholders = {
  profile: 'Please fill up',
  post: 'Please fill up',
  group: 'Please fill up'
}

/**
 * 清空输入框
 */
const onInputClear = () => {
  form.url = '';
  result.value = null
}

/**
 * 处理爬取请求
 */
const handleScrape = async () => {
  if (!form.url.trim()) {
    showToast('请输入有效的链接')
    return
  }

  // 简单的URL验证
  try {
    new URL(form.url)
  } catch {
    showToast('请输入有效的URL格式')
    return
  }

  loading.value = true
  error.value = ''
  result.value = null

  try {
    /**
     * 调用爬取接口
     */
    const res = await post('scrape.facebook', {
      type: form.type,
      url: form.url.trim()
    })

    if (res && res.data) {
      result.value = res.data
      showToast('Find successful!')
    } else {
      throw new Error('Return data format exception')
    }
  } catch (err) {
    error.value = err.message || '爬取失败，请检查链接是否正确'
    console.error('爬取错误:', err)
  } finally {
    loading.value = false
  }
}

/**
 * 格式化结果显示
 * @param {Object} data - 接口返回的数据
 * @returns {String} 格式化后的字符串
 */
const formatResult = (data) => {
  return JSON.stringify(data, null, 2)
}

/**
 * 复制结果到剪贴板
 */
const copyResult = async () => {
  if (!result.value) return

  try {
    await navigator.clipboard.writeText(formatResult(result.value))
    showToast('Copy successful!')
  } catch (err) {
    // 降级处理：创建临时textarea元素复制
    const textarea = document.createElement('textarea')
    textarea.value = formatResult(result.value)
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    showToast('Copy successful!')
  }
}
</script>

<style scoped>
.facebook-scraper {
  padding: 16px;
  background-color: #f7f8fa;
  min-height: 100vh;
}

.description {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.form-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.type-selector {
  margin-bottom: 20px;
}

.field-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.radio-item {
  margin-right: 16px;
}

.url-input {
  margin-bottom: 24px;
}

.url-field {
  margin-top: 8px;
  background-color: #f5f5f5;
}

.button-section {
  text-align: center;
}

.scrape-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
}

.result-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.result-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.copy-button {
  padding: 4px 12px;
}

.result-content {
  max-height: 400px;
  overflow-y: auto;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 12px;
}

.result-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #333;
}

.error-section {
  margin-bottom: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .facebook-scraper {
    padding: 12px;
  }
  
  .header {
    padding: 16px;
  }
  
  .form-section {
    padding: 16px;
  }
  
  .result-section {
    padding: 16px;
  }
  
  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* 滚动条美化 */
.result-content::-webkit-scrollbar {
  width: 6px;
}

.result-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.result-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.result-content::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style> 