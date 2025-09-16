/*
 * @Author: diaochan
 * @Date: 2025-03-08 20:25:10
 * @LastEditors: rueen
 * @LastEditTime: 2025-09-16 15:09:37
 * @Description: 环境配置文件
 */

import API_PATH from './api'

// 判断当前环境
const isDev = process.env.NODE_ENV === 'development';

// 获取站点配置（从 vite.config.js 注入）
const siteConfig = __SITE_CONFIG__;

// 公共 API 路径配置（用于图片上传、获取枚举常量等）
const PUBLIC_API_PATH = '/api';

// 业务 API 路径配置
const BUSINESS_API_PATH = '/api/h5';

// 当前环境的基础 API 路径
// 开发环境使用代理，生产环境使用实际API地址
const BASE_URL = isDev ? '' : siteConfig.baseUrl;

// 当前环境的公共 API 路径
const PUBLIC_API_URL = BASE_URL + PUBLIC_API_PATH;

// 当前环境的业务 API 路径
const BUSINESS_API_URL = BASE_URL + BUSINESS_API_PATH;

// 模拟数据配置
const MOCK_CONFIG = {
  // 是否启用模拟数据（仅在开发环境启用）
  enable: false,
  // 模拟数据延迟时间（毫秒）
  delay: 300,
};

// 导出配置
export default {
  // 当前环境
  isDev,
  // 基础 API 路径
  baseUrl: BASE_URL,
  // 公共 API 路径（用于图片上传、获取枚举常量等）
  publicApiUrl: PUBLIC_API_URL,
  // 业务 API 路径（用于业务接口）
  businessApiUrl: BUSINESS_API_URL,
  // 图片上传路径
  imageUploadUrl: `${PUBLIC_API_URL}/upload/image`,
  // API 路径
  api: API_PATH,
  // 模拟数据配置
  mock: MOCK_CONFIG,
  // 当前站点配置
  site: siteConfig.site,
  apiSignSecret: siteConfig.apiSignSecret,
}; 