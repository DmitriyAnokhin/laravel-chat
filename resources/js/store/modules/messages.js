export default {
  state: {
    messages: []
  },
  mutations: {
    setMessages (state, payload) {
      state.messages = payload
    }
  },
  actions: {
    async addMessage ({ state, commit, rootState }, payload) {
      if (state.messages[payload.dialog_id]) {
        if (rootState.users.user.email == payload.author) {
          if (payload.status == 'sending') {
            state.messages[payload.dialog_id].push(payload)
          }
          if (payload.status == 'delivered') {
            state.messages[payload.dialog_id].splice([state.messages[payload.dialog_id].length - 1], 1, payload)
          }
          if (payload.status == 'seen') {
            state.messages[payload.dialog_id].splice([state.messages[payload.dialog_id].length - 1], 1, payload)
          }
        } else {
          if (payload.status == 'delivered') {
            state.messages[payload.dialog_id].push(payload)
            const success = await axios.post('/api/messages/seen', payload)
          }
          if (payload.status == 'seen') {
            state.messages[payload.dialog_id].splice([state.messages[payload.dialog_id].length - 1], 1, payload)
          }
        }
      }
    },
    async sendMessages ({ state, commit, rootState }, message) {
      try {
        commit('clearError')
        //commit('setLoading', true)

        // загрузка файла
        if (message.file) {
          let formData = new FormData()
          formData.append('file', message.file)
          formData.append('dialog_id', message.dialog_id)
          const uploadFile = await axios.post('/api/messages/file', formData)
          message.attachment = uploadFile.data.url
          delete message.file
        }

        const success = await axios.post('/api/messages/send', message)
        if (success.status == 200) {
          //commit('setLoading', false)
        }
      } catch (error) {
        //commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async readMessages ({commit}, dialogsIds) {
      try {
        commit('clearError')
        commit('setLoading', true)
        const array = {
          dialogs_ids: dialogsIds
        }
        const success = await axios.post('/api/messages/read', array)
        if (success.status == 200) {
          commit('setMessages', success.data)
          commit('setLoading', false)
        }
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async massUpdateMessages ({ state, commit, rootState }) {
        if (state.messages[rootState.dialogs.dialogId]
          && state.messages[rootState.dialogs.dialogId].length > 0) {
          let notSeenMessages = state.messages[rootState.dialogs.dialogId].filter(function(item) {
            return item.author != rootState.users.user.email && item.status != 'seen'
          })
          if (notSeenMessages.length == 0) return

          try {
            commit('clearError')
            commit('setLoading', true)
            const array = {
              not_seen: notSeenMessages
            }
            const success = await axios.post('/api/messages/massseen', array)
            if (success.status == 200) {
              state.messages[rootState.dialogs.dialogId] = success.data
              // commit('setMessages', success.data)
              commit('setLoading', false)
            }
          } catch (error) {
            commit('setLoading', false)
            commit('setError', error.message)
            throw error
          }

        }
    },
    async massReadMessages ({ state, commit, rootState }, message ) {
      try {
        commit('clearError')
        commit('setLoading', true)
        const success = await axios.post('/api/messages/massread', message)
        if (success.status == 200) {
          state.messages[rootState.dialogs.dialogId] = success.data
          // commit('setMessages', success.data)
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
    getMessages (state) {
      return state.messages
    }
  }
}
