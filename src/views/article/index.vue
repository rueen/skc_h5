<!--
 * @Author: diaochan
 * @Date: 2025-03-20 21:33:28
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-20 22:13:00
 * @Description: 
-->
<template>
  <div>
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      @click-left="onClickLeft"
    />
    {{ content }}
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { get } from '@/utils/request'

const route = useRoute()
const router = useRouter()
const title = ref('')
const content = ref('')

const onClickLeft = () => {
  router.back()
}

const getArticleDetail = async () => {
  if(route.query.location != null){
    const res = await get('article.byLocation', {}, {
      urlParams: {
        location: route.query.location
      }
    })
    title.value = res.data.title
    content.value = res.data.content
  } else if(route.params.id != null) {
    const res = await get('article.byId', {}, {
      urlParams: {
        id: route.params.id
      }
    })
    title.value = res.data.title
    content.value = res.data.content
  }
}

onMounted(() => {
  getArticleDetail()
})
</script>

<style lang="less" module>
</style>