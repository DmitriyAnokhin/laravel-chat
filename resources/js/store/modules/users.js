export default {
  state: {
    user: {},
    usersInChat: [],
    usersList: []
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setUsersInChat (state, payload) {
      state.usersInChat = payload
    },
    addUsersInChat (state, payload) {
      state.usersInChat.push(payload)
    },
    removeUsersInChat (state, payload) {
      state.usersInChat = state.usersInChat.filter(u => u.id !== payload.id)
    },
    setUsersList (state, payload) {
      state.usersList = payload
    }
  },
  actions: {
    async readUser ({commit}) {
      try {
        commit('clearError')
        commit('setLoading', true)
        const success = await axios.get('/api/user')
        if (success.status == 200) {
          commit('setUser', success.data)
          commit('setLoading', false)
        }
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async readUsersList ({commit}) {
      try {
        commit('clearError')
        commit('setLoading', true)
        const success = await axios.get('/api/userslist')
        if (success.status == 200) {
          commit('setUsersList', success.data)
          commit('setLoading', false)
        }
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    }
  },
  getters: {
    getUser (state) {
      return state.user
    },
    getUsersInChat (state) {
      return state.usersInChat
    },
    getUsersList (state) {
      return state.usersList
    }
  }
}
