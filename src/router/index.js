/*
 * @Author: diaochan
 * @Date: 2025-02-25 10:10:45
 * @LastEditors: diaochan
 * @LastEditTime: 2025-02-25 10:19:33
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
        title: '我的名片',
        requiresAuth: true,
        hideTabbar: true
      }
    },
    {
      path: '/social/detail/:id',
      name: 'SocialDetail',
      component: () => import('../views/social/detail.vue'),
      meta: {
        title: '名片详情',
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
      path: '/wallet/accounts/add',
      name: 'WalletAccountsAdd',
      component: () => import('../views/wallet/accounts-add.vue'),
      meta: {
        title: '添加账户',
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
      path: '/tasks/apply/:id',
      name: 'TaskApply',
      component: () => import('../views/tasks/apply.vue'),
      meta: {
        title: '任务报名',
        requiresAuth: true,
        hideTabbar: true
      }
    },
    {
      path: '/tasks/apply/detail/:id',
      name: 'TaskApplyDetail',
      component: () => import('../views/tasks/apply-detail.vue'),
      meta: {
        title: '报名详情',
        requiresAuth: true,
        hideTabbar: true
      }
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