export default {
  state: {
    dialogId: '',
    dialogsList: [],
    whisperUsers: []
  },
  mutations: {
    setDialogId (state, payload) {
      state.dialogId = payload
    },
    setDialogsList (state, payload) {
      state.dialogsList = payload
    }
  },
  actions: {
    setWhisperUsers ({ state, commit, rootState }, whisper) {
      if (state.whisperUsers.length > 0) {
        let whisperUser = state.whisperUsers.filter(item => item.dialog_id == whisper.dialog_id && item.email == whisper.email)
        if (whisperUser) {
          state.whisperUsers.splice(state.whisperUsers.indexOf(whisperUser), 1, whisper)
        } else {
          state.whisperUsers.push(whisper)
        }
      } else {
        state.whisperUsers.push(whisper)
      }
    },
    addDialog ({ state, commit, rootState }, chat) {
      if (chat.user1 != rootState.users.user.email) {
        state.dialogsList.push(chat)
      }
      // сортировка
      state.dialogsList.sort(( a, b ) =>  b.last_send - a.last_send)
    },
    updateDialogList ({ state, commit }, payload) {

      for (let i = 0; i < state.dialogsList.length; i++) {
        if (state.dialogsList[i] && state.dialogsList[i].id == payload.dialog_id) {
          state.dialogsList[i].last_send = payload.send_time
          // сортировка
          state.dialogsList.sort(( a, b ) =>  b.last_send - a.last_send)
          //console.log('обновление списка диалогов');
          //console.log(state.dialogsList)
        }
      }

    },
    async createDialogUser ({commit}, dialog) {
      try {
        commit('clearError')
        commit('setLoading', true)
        const success = await axios.post('/api/dialog/create', dialog)
        if (success.status == 200) {
          // commit('setDialogsUser', success.data)
          commit('setLoading', false)
        }
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async readDialogList ({commit}, email) {
      try {
        commit('clearError')
        commit('setLoading', true)
        const success = await axios.post('/api/dialog/readdialoglist', {email})
        if (success.status == 200) {
          commit('setDialogsList', success.data)
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
    getDialogId (state) {
      return state.dialogId
    },
    getDialogsList (state) {
      return state.dialogsList
    },
    getWhisperUsers (state) {
      return state.whisperUsers
    }
  }
}
