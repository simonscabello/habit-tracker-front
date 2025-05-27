import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Proteção de rotas privadas
  Router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const isAuthenticated = !!token

    const publicPages = ['/login', '/register']
    const authRequired = !publicPages.includes(to.path)

    if (authRequired && !isAuthenticated) {
      return next('/login')
    }

    next()
  })

  return Router
})
