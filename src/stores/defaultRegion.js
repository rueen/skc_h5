/*
 * @Author: diaochan
 * @Date: 2025-08-28 16:08:02
 * @LastEditors: rueen
 * @LastEditTime: 2025-08-28 16:21:57
 * @Description: 
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get } from '@/utils/request'
import { setLocale } from '@/i18n'

export const useDefaultRegionStore = defineStore('defaultRegion', () => {
  const defaultRegion = ref('');
  const languageColumns = ref([]);
  const areaCodeColumns = ref([])

  /**
   * 获取默认地区并设置对应的默认语言
   */
  const fetchDefaultRegion = async () => {
    try {
      const res = await get('system.defaultRegion')
      defaultRegion.value = res.data.region;

      // 检查是否已经有语言设置
      const hasLanguageSetting = localStorage.getItem('language');

      switch(defaultRegion.value){
        case 'Malaysia':
          // 只有在没有语言设置时才设置默认语言
          if(!hasLanguageSetting){
            setLocale('en-US')
          }
          languageColumns.value = [
            { text: 'English', value: 'en-US' },
            { text: '简体中文', value: 'zh-CN' },
            { text: 'Tagalog', value: 'tl-PH' },
          ];
          areaCodeColumns.value = [
            { text: 'PH +63', value: '63' },
            { text: 'US +1', value: '1' },
            { text: 'GB +44', value: '44' },
            { text: 'AU +61', value: '61' },
            { text: 'JP +81', value: '81' },
            { text: 'SG +65', value: '65' },
            { text: 'KR +82', value: '82' },
            { text: 'MY +60', value: '60' },
            { text: 'TH +66', value: '66' },
            { text: 'IN +91', value: '91' },
          ];
          break;
        case 'Japan':
          // 只有在没有语言设置时才设置默认语言
          if(!hasLanguageSetting){
            setLocale('ja-JP')
          }
          languageColumns.value = [
            { text: '日本語', value: 'ja-JP' },
            { text: 'English', value: 'en-US' },
            { text: '简体中文', value: 'zh-CN' },
          ];
          areaCodeColumns.value = [
            { text: 'JP +81', value: '81' },
            { text: 'US +1', value: '1' },
            { text: 'GB +44', value: '44' },
            { text: 'AU +61', value: '61' },
            { text: 'PH +63', value: '63' },
            { text: 'SG +65', value: '65' },
            { text: 'KR +82', value: '82' },
            { text: 'MY +60', value: '60' },
            { text: 'TH +66', value: '66' },
            { text: 'IN +91', value: '91' },
          ];
          break;
        default:
          // 默认情况，如果没有语言设置，使用英文
          if(!hasLanguageSetting){
            setLocale('en-US')
          }
          break;
      }
    } catch (error) {
      console.error('获取默认地区失败:', error)
      // 如果接口失败，且没有语言设置，使用英文作为默认语言
      if(!localStorage.getItem('language')){
        setLocale('en-US')
      }
    }
  }

  return {
    defaultRegion,
    languageColumns,
    areaCodeColumns,
    fetchDefaultRegion
  }
})