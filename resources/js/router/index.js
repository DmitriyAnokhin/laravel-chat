import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'

import Home from '../components/Home'
/* Auth */
import Login from '../components/auth/Login'
import Registration from '../components/auth/Registration'

Vue.use(Router)

export default new Router({
  routes: [
    // Auth
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/registration',
      name: 'registration',
      component: Registration
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: AuthGuard
    }    
  ],
  mode: 'history'
})
