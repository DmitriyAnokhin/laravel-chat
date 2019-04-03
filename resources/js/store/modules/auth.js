export default {
  state: {
    authToken: localStorage.getItem('authToken') || null
  },
  mutations: {
    /* Перезагрузка */
    loadToken (state) {
      if (localStorage.getItem('authToken')) {
        state.authToken = localStorage.getItem('authToken')
        if (state.authToken) {
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + state.authToken
        }
      }
    },
    /* Авторизация */
    setAuth (state, payload) {
      if (payload === 'false') {
        state.authToken = null
        axios.defaults.headers.common['Authorization'] = null
        localStorage.removeItem('authToken')
        localStorage.removeItem('expiredIn')
      }
      else {
        localStorage.setItem('authToken', payload)
        localStorage.setItem('expiredIn', new Date().getTime() + 23.95 * 3600 * 1000) // на сервере 24 часа, тут 23.95
        state.authToken = localStorage.getItem('authToken')
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + state.authToken
      }
    },
    /* Выход */
    onLogout (state) {
      state.authToken = null
      state.bots = []
      state.dialogs = []
      axios.defaults.headers.common['Authorization'] = null
      localStorage.removeItem('authToken')
      localStorage.removeItem('expiredIn')
    }
  },
  actions: {
    /* Логин */
    async loginUser ({commit}, user) {
      try {
        commit('clearError')
        commit('setLoading', true)
        const success = await axios.post('/api/login', user)
        if (success.status == 200) {
          if (success.data.token) {
            commit('setAuth', success.data.token)
            commit('setLoading', false)
          }
        }
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        commit('setAuth', 'false')
        throw error
      }
    },
    /* Регистрация */
    async registerUser ({commit}, user) {
      try {
        commit('clearError')
        commit('setLoading', true)
        const success = await axios.post('/api/register', user)
        if (success.status == 200) {
          // commit('setAuth', success.data.token)
          commit('setLoading', false)
        }
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    /* Refresh токена */
    async refreshToken ({commit}) {
      const authToken = localStorage.getItem('authToken')
      try {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken
        const success = await axios.post('/api/refresh')
        if (success.status == 200) {
          commit('setAuth', success.data)
          return success
        }
      } catch (error) {
        throw error
        commit('setAuth', 'false')
      }
    },
    /* Выход */
    async logoutUser ({commit}) {
      try {
        const success = await axios.post('/api/logout')
        if (success.status == 200) commit('onLogout')
      } catch (error) {
        throw error
      }
    }
  },
  getters: {
    /* Проверка авторизации для компонентов */
    checkAuth (state) {
      if (state.authToken) {
        return true
      }
      return false
    }
  }
}
