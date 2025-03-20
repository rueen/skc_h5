/*
 * @Author: diaochan
 * @Date: 2025-03-20 09:05:11
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-20 09:10:12
 * @Description: 
 */
import { defineStore } from 'pinia'
import { get } from '@/utils/request'
export const useGroupsStore = defineStore('groups', {
  state: () => ({
    isShowGroups: false,
    groups: [],
  }),
  actions: {
    async getOwnedGroups() {
      const res = await get('groups.list')
      if (res.code === 0 && res.data) {
        this.groups = res.data
        this.isShowGroups = res.data.length > 0
      }
    },
  },
})
