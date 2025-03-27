/*
 * @Author: diaochan
 * @Date: 2025-02-25 10:10:49
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-27 15:54:19
 * @Description: 
 */
import { defineStore } from 'pinia'
import { showToast } from 'vant'
import { post, get } from '@/utils/request'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: localStorage.getItem('token') || null
  }),
  getters: {
    // 获取用户邀请码
    inviteCode: (state) => state.userInfo?.inviteCode || ''
  },
  actions: {
    setUserInfo(info) {
      this.userInfo = info
    },
    setToken(token) {
      this.token = token
      // 保存到本地存储
      localStorage.setItem('token', token)
    },
    clearToken() {
      this.token = null
      localStorage.removeItem('token')
    },
    // 登录
    async login(loginData) {
      try {
        const res = await post('auth.login', loginData)
        if (res.code === 0) {
          this.setToken(res.data.token)
          this.setUserInfo(res.data.userInfo)
        }
        showToast(res.message)
        return res
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    },
    // 获取用户信息
    async fetchUserInfo() {
      try {
        const res = await get('user.info')
        this.setUserInfo(res.data)
        return res.data
      } catch (error) {
        console.error('获取用户信息失败:', error)
        if([401, 404].indexOf(error.response.status) > -1){
          this.clearToken()
          this.userInfo = null
        }
        throw error
      }
    },
    // 退出登录
    async logout() {
      try {
        await post('auth.logout')
      } catch (error) {
        console.error('退出登录失败:', error)
      } finally {
        this.clearToken()
        this.userInfo = null
      }
    }
  }
}) 