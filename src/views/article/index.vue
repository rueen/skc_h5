<!--
 * @Author: diaochan
 * @Date: 2025-03-20 21:33:28
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-30 16:47:05
 * @Description: 
-->
<template>
  <Layout>
    <nav-bar
      :title="title"
      left-arrow
      fixed
      @click-left="onClickLeft"
    />
    <div v-html="content" class="article-content"></div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Layout from '@/components/layout.vue'
import { get } from '@/utils/request'
import NavBar from '@/components/NavBar.vue'

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

<style lang="less" scoped>
.article-content{
  padding: 16px;
  min-height: 100vh;
  background-color: #fff;
}
</style>