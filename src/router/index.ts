import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

/** Automatic loading of other routing modules */
const files = require.context('.', true, /\.ts$/)
const modules: Array<RouteRecordRaw> = []
files.keys().forEach(key => {
  if (key === './index.ts') return
  modules.push(files(key).default)
})

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:user?',
    name: 'Home',
    component: Home,
    props: true
  },
  ...modules,
  {
    path: '/wallet',
    name: 'Wallet',
    component: () => import(/* webpackChunkName: "Wallet" */ '../views/Wallet.vue')
  },
  {
    path: '/seed',
    name: 'Seed',
    component: () => import(/* webpackChunkName: "Seed" */ '../views/Seed.vue')
  },
  {
    path: '/tests',
    name: 'Tests',
    component: () => import(/* webpackChunkName: "Test" */ '../views/Tests.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
