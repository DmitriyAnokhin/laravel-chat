import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import dialogs from './modules/dialogs'
import domains from './modules/domains'
import messages from './modules/messages'
import shared from './modules/shared'
import users from './modules/users'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth, dialogs, domains, messages, shared, users
  },
  state : {
    drawer: false,
  },
  mutations: {
    showDrawer (state) {
      state.drawer = !state.drawer
    }
  },
  actions: {

  },
  getters: {

  }
})
