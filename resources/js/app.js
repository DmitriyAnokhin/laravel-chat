require('./bootstrap')
window.Vue = require('vue')
import router from './router'
import store from './store'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import App from './App.vue'
/* Template */
import Toolbar from './components/template/Toolbar'
import Drawer from './components/template/Drawer'
/* Partials */
import ChatField from './components/ChatField'

/* Template */
Vue.component('app-toolbar', Toolbar)
Vue.component('app-drawer', Drawer)
/* Partials */
Vue.component('app-chat-field', ChatField)

Vue.use(Vuelidate)
Vue.use(Vuetify)

const app = new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
  created () {
    // закрытие окна
    /*
    let user = this.$store.getters.getUser
    window.onbeforeunload = function () {
      //this.$store.dispatch('sendLogout')
      let success = axios.post('/api/sendlogout', user)
      return (success ? success : null)
    }
    */
    // проверка авторизации
    if (localStorage.getItem('expiredIn') <= new Date().getTime()) {
      /*
      this.$store.dispatch('refreshToken')
        .then(() => {})
      */
    } else {
      this.$store.commit('loadToken')
    }
  }
})
