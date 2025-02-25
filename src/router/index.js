/*
 * @Author: diaochan
 * @Date: 2025-02-25 10:10:45
 * @LastEditors: diaochan
 * @LastEditTime: 2025-02-25 10:19:33
 * @Description: 
 */
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/login/index.vue')
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/home/index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/tasks',
      name: 'Tasks',
      component: () => import('../views/tasks/index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/groups',
      name: 'Groups',
      component: () => import('../views/groups/index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/profile/index.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.token) {
    next('/login')
  } else {
    next()
  }
})

export default router 