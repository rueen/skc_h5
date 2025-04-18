/*
 * @Author: diaochan
 * @Date: 2025-03-08 20:30:15
 * @LastEditors: rueen
 * @LastEditTime: 2025-04-14 18:10:54
 * @Description: 模拟数据工具
 */

import config from '@/config/env';

// 模拟数据映射
const mockData = {};

/**
 * 模拟 API 请求
 * @param {String} apiName - API 名称，格式为 "模块.接口"，例如 "task.list"
 * @param {Object} params - 请求参数
 * @return {Promise} - 返回模拟数据
 */
export const mockRequest = (apiName, params = {}) => {
  return new Promise((resolve) => {
    // 如果未启用模拟数据，则直接返回错误
    if (!config.mock.enable) {
      resolve({
        code: 500,
        message: '模拟数据未启用',
        data: null,
      });
      return;
    }
    
    // 获取模拟数据处理函数
    const mockFn = mockData[apiName];
    
    // 如果模拟数据处理函数不存在，则返回错误
    if (!mockFn) {
      console.error(`模拟数据 ${apiName} 不存在`);
      resolve({
        code: 404,
        message: `接口 ${apiName} 不存在`,
        data: null,
      });
      return;
    }
    
    // 模拟网络延迟
    setTimeout(() => {
      try {
        // 调用模拟数据处理函数
        const result = mockFn(params);
        resolve(result);
      } catch (err) {
        console.error(`模拟数据处理出错: ${err.message}`);
        resolve({
          code: 500,
          message: '服务器内部错误',
          data: null,
        });
      }
    }, config.mock.delay);
  });
};

export default {
  mockRequest,
}; 