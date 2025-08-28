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

export const useDefaultRegionStore = defineStore('defaultRegion', () => {
  const defaultRegion = ref('');
  const languageColumns = ref([]);
  const areaCodeColumns = ref([])

  const fetchDefaultRegion = async () => {
    const res = await get('system.defaultRegion')
    defaultRegion.value = res.data.region;

    switch(defaultRegion.value){
      case 'Malaysia':
        if(!localStorage.getItem('language')){
          localStorage.setItem('language', 'en-US')
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
        if(!localStorage.getItem('language')){
          localStorage.setItem('language', 'ja-JP')
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
        break;
    }
  }

  return {
    defaultRegion,
    languageColumns,
    areaCodeColumns,
    fetchDefaultRegion
  }
})