/*
 * @Author: diaochan
 * @Date: 2025-03-16 12:35:20
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-17 20:41:04
 * @Description: 上传工具函数
 */

import { post } from './request'
import { showToast, closeToast } from 'vant'
import Compressor from 'compressorjs'

/**
 * 压缩图片
 * @param {File} file - 要压缩的图片文件
 * @param {Object} options - 压缩选项
 * @param {number} options.quality - 压缩质量 0-1 之间，默认0.8
 * @param {number} options.maxWidth - 最大宽度，默认800px
 * @param {number} options.maxHeight - 最大高度，默认800px
 * @param {number} options.convertSize - 超过该大小自动转为JPEG，默认200KB
 * @returns {Promise<File>} - 返回压缩后的文件
 */
export const compressImage = (file, options = {}) => {
  const defaultOptions = {
    quality: 0.8,
    maxWidth: 800,
    maxHeight: 800,
    convertSize: 200000,
  }

  const compressOptions = { ...defaultOptions, ...options }

  return new Promise((resolve, reject) => {
    new Compressor(file, {
      ...compressOptions,
      success(result) {
        if (options.debug) {
          console.log(`图片压缩: 原始大小: ${Math.round(file.size / 1024)}KB, 压缩后: ${Math.round(result.size / 1024)}KB, 压缩率: ${Math.round((1 - result.size / file.size) * 100)}%`)
        }
        resolve(result)
      },
      error(err) {
        console.error('图片压缩失败:', err)
        // 压缩失败则使用原始文件
        resolve(file)
      },
    })
  })
}

/**
 * 上传图片
 * @param {File} file - 图片文件
 * @param {Object} options - 上传选项
 * @param {boolean} options.compress - 是否压缩图片，默认true
 * @param {Object} options.compressOptions - 压缩选项
 * @returns {Promise<Object>} - 返回上传结果
 */
export const uploadImage = async (file, options = {}) => {
  // 检查文件类型
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    showToast('请上传图片文件')
    return Promise.reject(new Error('文件类型错误，请上传图片文件'))
  }
  
  // 检查文件大小（默认限制为 5MB）
  const maxSize = options.maxSize || 5 * 1024 * 1024
  if (file.size > maxSize) {
    showToast(`图片大小不能超过 ${maxSize / 1024 / 1024}MB`)
    return Promise.reject(new Error(`文件过大，请上传小于 ${maxSize / 1024 / 1024}MB 的图片`))
  }
  
  // 处理图片压缩
  let processedFile = file
  if (options.compress !== false) {
    try {
      processedFile = await compressImage(file, options.compressOptions || {})
    } catch (error) {
      console.warn('图片压缩失败，使用原始图片:', error)
    }
  }
  
  // 创建 FormData
  const formData = new FormData()
  formData.append('file', processedFile)
  
  // 添加额外参数
  if (options.params) {
    Object.keys(options.params).forEach(key => {
      formData.append(key, options.params[key])
    })
  }
  
  // 调试日志
  console.log('上传图片FormData:', {
    fileName: processedFile.name,
    fileType: processedFile.type,
    fileSize: processedFile.size,
    formDataEntries: [...formData.entries()].map(entry => ({ key: entry[0], value: entry[1] instanceof File ? `File: ${entry[1].name}` : entry[1] }))
  })
  
  try {
    // 使用公共 API 上传图片
    const res = await post('upload.image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      // 确保不过滤FormData
      filterEmpty: false,
      ...options
    })
    
    return res.data
  } catch (error) {
    console.error('图片上传失败详情:', error)
    showToast('图片上传失败')
    return Promise.reject(error)
  }
}

/**
 * 上传文件
 * @param {File} file - 文件
 * @param {Object} options - 上传选项
 * @returns {Promise<Object>} - 返回上传结果
 */
export const uploadFile = async (file, options = {}) => {
  // 检查文件大小（默认限制为 10MB）
  const maxSize = options.maxSize || 10 * 1024 * 1024
  if (file.size > maxSize) {
    showToast(`文件大小不能超过 ${maxSize / 1024 / 1024}MB`)
    return Promise.reject(new Error(`文件过大，请上传小于 ${maxSize / 1024 / 1024}MB 的文件`))
  }
  
  // 创建 FormData
  const formData = new FormData()
  formData.append('file', file)
  
  // 添加额外参数
  if (options.params) {
    Object.keys(options.params).forEach(key => {
      formData.append(key, options.params[key])
    })
  }
  
  try {
    // 使用公共 API 上传文件
    const res = await post('upload.file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...options
    })
    
    return res.data
  } catch (error) {
    showToast('文件上传失败')
    return Promise.reject(error)
  }
}

export default {
  uploadImage,
  uploadFile
} 