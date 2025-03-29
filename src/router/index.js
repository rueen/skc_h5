/*
 * @Author: diaochan
 * @Date: 2025-02-25 10:10:45
 * @LastEditors: rueen
 * @LastEditTime: 2025-03-29 22:25:36
 * @Description: 
 */
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import Social from '../views/social/index.vue'

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
      path: '/taskApplications',
      name: 'TaskApplications',
      component: () => import('../views/taskApplications/index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/groups',
      name: 'Groups',
      component: () => import('../views/groups/index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/groups/members/:groupId',
      name: 'GroupsMembers',
      component: () => import('../views/groups/members.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/profile/index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/tasks/detail/:id',
      name: 'TaskDetail',
      component: () => import('../views/tasks/detail.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/invites',
      name: 'Invites',
      component: () => import('../views/invites/index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/social',
      name: 'Social',
      component: Social,
      meta: {
        title: '我的账号',
        requiresAuth: true,
        hideTabbar: true
      }
    },
    {
      path: '/social/detail/:id',
      name: 'SocialDetail',
      component: () => import('../views/social/detail.vue'),
      meta: {
        title: '账号详情',
        requiresAuth: true,
        hideTabbar: true
      }
    },
    {
      path: '/profile/edit',
      name: 'ProfileEdit',
      component: () => import('../views/profile/edit.vue'),
      meta: {
        title: '个人信息编辑',
        requiresAuth: true,
        hideTabbar: true
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('../views/settings/index.vue'),
      meta: {
        title: '设置',
        requiresAuth: true,
        hideTabbar: true
      }
    },
    {
      path: '/wallet',
      name: 'Wallet',
      component: () => import('../views/wallet/index.vue'),
      meta: {
        title: '我的钱包',
        requiresAuth: true,
        hideTabbar: true
      }
    },
    {
      path: '/wallet/bills',
      name: 'WalletBills',
      component: () => import('../views/wallet/bills.vue'),
      meta: {
        title: '结算账单',
        requiresAuth: true,
        hideTabbar: true
      }
    },
    {
      path: '/wallet/records',
      name: 'WalletRecords',
      component: () => import('../views/wallet/records.vue'),
      meta: {
        title: '提现记录',
        requiresAuth: true,
        hideTabbar: true
      }
    },
    {
      path: '/wallet/accounts',
      name: 'WalletAccounts',
      component: () => import('../views/wallet/accounts.vue'),
      meta: {
        title: '提现账户',
        requiresAuth: true,
        hideTabbar: true
      }
    },
    {
      path: '/wallet/withdraw',
      name: 'WalletWithdraw',
      component: () => import('../views/wallet/withdraw.vue'),
      meta: {
        title: '提现',
        requiresAuth: true,
        hideTabbar: true
      }
    },
    {
      path: '/tasks/submit/:id',
      name: 'TaskSubmit',
      component: () => import('../views/tasks/submit.vue'),
      meta: {
        title: '任务报名',
        requiresAuth: true,
        hideTabbar: true
      }
    },
    {
      path: '/settings/password',
      name: 'SettingsPassword',
      component: () => import('../views/settings/password.vue'),
      meta: {
        title: '修改密码',
        requiresAuth: true,
        hideTabbar: true
      }
    },
    {
      path: '/article/:id',
      name: 'Article',
      component: () => import('../views/article/index.vue'),
      meta: {
        title: '文章详情',
        requiresAuth: false,
      }
    },
    {
      path: '/examples/popup',
      name: 'PopupExample',
      component: () => import('../views/examples/PopupExample.vue'),
      meta: {
        title: '弹窗示例',
        requiresAuth: false,
        hideTabbar: true
      }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 如果URL中包含邀请码参数，则保存到会话存储
  if (to.query.inviteCode) {
    sessionStorage.setItem('inviteCode', to.query.inviteCode)
  }
  
  if (to.meta.requiresAuth && !userStore.token) {
    // 如果需要登录但用户未登录，重定向到登录页
    // 保存当前路径，登录成功后可以跳回来
    sessionStorage.setItem('redirectUrl', to.fullPath)
    next('/login')
  } else {
    next()
  }
})

export default router 