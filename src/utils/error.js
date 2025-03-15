/**
 * API 错误码映射
 */
export const ERROR_CODES = {
  1001: '参数错误',
  1002: '密码错误',
  1003: '用户被禁用',
  1004: '未授权',
  // 可以根据后端错误码继续添加
};

/**
 * 获取错误信息
 * @param {Object|Error} error 错误对象
 * @returns {string} 错误信息
 */
export function getErrorMessage(error) {
  if (!error) return '未知错误';
  
  // 如果是 API 返回的错误
  if (error.code && ERROR_CODES[error.code]) {
    return ERROR_CODES[error.code];
  }
  
  // 如果是普通 Error 对象
  if (error.message) {
    return error.message;
  }
  
  // 其他情况
  return '未知错误';
}

/**
 * 处理 API 错误
 * @param {Object|Error} error 错误对象
 * @param {Function} showToast 显示提示的函数
 * @param {Function} [callback] 错误处理后的回调函数
 */
export function handleApiError(error, showToast, callback) {
  const message = getErrorMessage(error);
  showToast(message);
  
  // 如果是未授权错误，可以执行登出操作
  if (error.code === 1004) {
    // 可以在这里添加登出逻辑
    console.log('用户未授权，需要重新登录');
  }
  
  // 执行回调
  if (typeof callback === 'function') {
    callback(error);
  }
} 