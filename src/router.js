import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/login.vue'
import Home from './components/home.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    }, {
      path: '/home',
      component: Home
    }
  ]
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') next()
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) next('/login')
  next()
})

export default router
