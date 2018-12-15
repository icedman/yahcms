import Vue from 'vue'
import Router from 'vue-router'
import SimplePage from '@/pages/SimplePage'
import Login from '@/pages/Login'
import Forget from '@/pages/Forget'
import Register from '@/pages/Register'
import Profile from '@/pages/Profile'
import Vendors from '@/pages/Vendors'
import Vendor from '@/pages/Vendor'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Vue.component('SimplePage', SimplePage),
      meta: {
        layout: 'app-splitter'
      }
    },
    {
      path: '/pages',
      name: 'pages',
      component: SimplePage,
      meta: {
        post_type: 'pages',
        layout: 'app-splitter'
      }
    },
    {
      path: '/pages/:slug',
      name: 'pages',
      component: SimplePage,
      meta: {
        post_type: 'pages',
        layout: 'app-splitter'
      }
    },
    {
      path: '/posts/:slug',
      name: 'posts',
      component: SimplePage,
      meta: {
        post_type: 'posts',
        layout: 'app-splitter'
      }
    },
    {
      path: '/vendors',
      name: 'vendors',
      component: Vendors,
      meta: {
        layout: 'app-splitter'
      }
    },
    {
      path: '/vendors/:id',
      name: 'vendors',
      component: Vendor,
      meta: {
        layout: 'app-splitter'
      }
    },
    {
      path: '/auth/login',
      name: 'login',
      component: Login,
      meta: {
        layout: 'app-full-page'
      }
    },
    {
      path: '/auth/forget',
      name: 'forget',
      component: Forget,
      meta: {
        layout: 'app-full-page'
      }
    },
    {
      path: '/auth/register',
      name: 'register',
      component: Register,
      meta: {
        layout: 'app-full-page'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: {
        layout: 'app-splitter',
        requiresAuth: true
      }
    }
  ]
})
