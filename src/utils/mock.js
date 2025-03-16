/*
 * @Author: diaochan
 * @Date: 2025-03-08 20:30:15
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-16 15:29:45
 * @Description: 模拟数据工具
 */

import config from '@/config/env';

// 模拟数据映射
const mockData = {
  'channel.list': (params) => {
    return {
      code: 0,
      message: '获取渠道列表成功',
      data: {
        total: 100,
        list: [
          {
            createTime: '2025-03-13 16:28:04',
            icon: 'http://localhost:3002/uploads/1742035626488-171861483.png',
            id: 6,
            name: 'facebook',
            updateTime: '2025-03-15 18:47:07',
          },
          {
            createTime: '2025-03-13 16:27:55',
            icon: 'http://localhost:3002/uploads/1742035638017-828581327.png',
            id: 5,
            name: 'Instagram',
            updateTime: '2025-03-15 18:47:19',
          }
        ],
        page: 1,
        pageSize: 10,
      },
    };
  },
  'user.info': (params) => {
    return {
      code: 0,
      message: '获取用户信息成功',
      data: {
        avatar: '',
        id: 9,
        loginType: 'phone',
        memberAccount: '13211111111',
        nickname: '用户317448'
      },
    };
  },
  'auth.login': (params) => {
    return {
      code: 0,
      message: '登录成功',
      data: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiYWNjb3VudCI6InBob25lXzEzMjExMTExMTExIiwiaWF0IjoxNzQyMDQ1ODQ1LCJleHAiOjE3NDIxMzIyNDV9.XGaUIjfvB8k1zMcVhRxgt3KNQVF7MqPLhNGLt-NzyeQ",
        userInfo: {
          avatar: '',
          id: 9,
          loginType: 'phone',
          memberAccount: '13211111111',
          nickname: '用户317448'
        }
      },
    };
  },
};

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