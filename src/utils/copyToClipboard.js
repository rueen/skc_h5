import { showToast } from 'vant'
import { getI18n } from '@/i18n/get'

const { common: { copy } } = getI18n()

// 兼容复制方法
const fallbackCopyToClipboard = (text, type) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-9999px'
  textArea.style.top = '-9999px'
  textArea.style.opacity = '0'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  
  try {
    const successful = document.execCommand('copy')
    if (successful) {
      showToast(copy(type).success)
    } else {
      showToast(copy(type).failed)
    }
  } catch (err) {
    console.error('复制失败:', err)
    showToast(copy(type).failed)
  }
  
  document.body.removeChild(textArea)
}

export const copyToClipboard = async (text, type = 'default') => {
  console.log(copy(type))
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast(copy(type).success)
      })
      .catch(() => {
        // Clipboard API 失败，尝试兼容方法
        fallbackCopyToClipboard(text, type)
      })
  } else {
    // 不支持 Clipboard API，使用兼容方法
    fallbackCopyToClipboard(text, type)
  }
}

export default {
  copyToClipboard
}
