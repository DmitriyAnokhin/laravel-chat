<template>
  <div>
    <v-container fluid>
      <v-layout row>
        <v-flex xs2>

          <!-- ПАНЕЛЬ ДИАЛОГОВ -->
          <div class="profile">
            <div>
              <div>
                Текущий пользователь
              </div>
              <div>
                {{ user.email }}
              </div>
            </div>
            <div class="ml-3">

              <!-- СПИСОК ПОЛЬЗОВАТЕЛЕЙ -->
              <v-menu
                transition="slide-y-transition"
                bottom
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="#455A64"
                    dark
                    fab
                    v-on="on"
                    @click="getUsers()"
                  ><v-icon>person_add</v-icon></v-btn>
                </template>
                <v-list>
                  <v-list-tile
                    v-for="(user, i) in users"
                    :key="i"
                    @click="newDialog(user.email)"
                    :disabled="loading || user.email == 'пусто'"
                  >
                    <v-list-tile-title>{{ user.email }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>

            </div>
          </div>

          <v-divider class="divider"></v-divider>

          <!-- СПИСОК ДИАЛОГОВ -->
          <div
            v-for="(dialog, index) in dialogsList"
            :key="index"
            :class="getDialogsListClass(dialog.id)"
            @click="selectDialog(dialog.id)"
          >
            <div v-if="user.email == dialog.user1">
              {{ dialog.user2 }}
            </div>
            <div v-if="user.email == dialog.user2">
              {{ dialog.user1 }}
            </div>
            <div v-if="getOnline(dialog, usersInChat) == 'on'">
              <div class="dialog-user-status dialog-user-status-online"></div> онлайн
            </div>
            <div v-if="getOnline(dialog, usersInChat) == 'off'">
              <div class="dialog-user-status dialog-user-status-offline"></div> оффлайн
            </div>
            <!--
            <div v-if="getOnline(dialog, usersInChat) == '15'">
              <div class="dialog-user-status dialog-user-status-15"></div> был в сети 15 минут назад
            </div>
            -->
            <div class="dialog-list-message">
              <div v-html="getLastAuthor(dialog.id)"></div>
              <v-divider></v-divider>
              <div v-html="getLastMessage(dialog.id)"></div>
              <v-divider></v-divider>
              <div v-html="getLastTime(dialog.id)"></div>
              <v-divider></v-divider>
              <div v-html="getLastStatus(dialog.id)"></div>
            </div>
          </div>

        </v-flex>

        <!-- ПОЛЕ ДИАЛОГА -->
        <v-flex xs10>

          <app-chat-field
            v-if="dialogId"
            :dialog-id="dialogId"
          ></app-chat-field>

        </v-flex>

      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    dialogId () {
      return this.$store.getters.getDialogId
    },
    user () {
      return this.$store.getters.getUser
    },
    usersInChat () {
      return this.$store.getters.getUsersInChat
    },
    users () {
      if (this.$store.getters.getUsersList.length == 0) return [ {email: 'пусто'} ]
      return this.$store.getters.getUsersList
    },
    dialogsList () {
      return this.$store.getters.getDialogsList
    },
    messages () {
      return this.$store.getters.getMessages
    }
  },
  methods: {
    // TEMPLATE
    getDialogsListClass (id) {
      if (id == this.dialogId) return 'dialog-list dialog-list-active'
      return 'dialog-list'
    },
    getOnline (dialog, users) {
      let check = 'off'
      if (dialog.user1 != this.user.email) {
        let otherUser = dialog.user1
        users.forEach(function (item) {
          if (item.email == otherUser) check = 'on'
        })
        return check
      }
      if (dialog.user2 != this.user.email) {
        let otherUser = dialog.user2
        users.forEach(function (item) {
          if (item.email == otherUser) check = 'on'
        })
        return check
      }
    },
    getLastAuthor (id) {
      let messages = this.messages
      if (messages[id] && messages[id].length > 0) return messages[id][messages[id].length - 1].author
    },
    getLastMessage (id) {
      let messages = this.messages
      if (messages[id] && messages[id].length > 0) return this.formatMessage(messages[id][messages[id].length - 1].message)
    },
    getLastTime (id) {
      let messages = this.messages
      if (messages[id] && messages[id].length > 0) return this.formatDate(messages[id][messages[id].length - 1].send_time)
    },
    getLastStatus (id) {
      let messages = this.messages
      if (messages[id] && messages[id].length > 0) return this.formatStatus(messages[id][messages[id].length - 1].status)
    },
    formatMessage (message) {
      let str = JSON.parse(message)
      let pos = 0
      while (true) {
        let foundPos = str.indexOf('\n', pos)
        if (foundPos != -1) str = str.replace('\n', '<br>')
        if (foundPos == -1) break
        pos = foundPos
      }

      return str
    },
    formatDate (date) {
      let messageDate = new Date(new Number(date))
      let currentDate = new Date()
      if (messageDate.getDate() == currentDate.getDate()
        && messageDate.getMonth() == currentDate.getMonth()
        && messageDate.getFullYear() == currentDate.getFullYear()) {
          let options = {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          }
          return 'сегодня в ' + messageDate.toLocaleString("ru", options)
      }
      let daysLag = Math.ceil(Math.abs(currentDate.getTime() - messageDate.getTime()) / (1000 * 3600 * 24))
      //console.log('разница в днях')
      //console.log(daysLag)
      if (daysLag == 1) {
          let options = {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          }
          return 'вчера в ' + messageDate.toLocaleString("ru", options)
      }
      if (daysLag <= 7 && daysLag > 1) {
          let options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          }
          return messageDate.toLocaleString("ru", options)
      }
      if (daysLag > 7) {
          return 'на прошлой неделе'
      }
    },
    formatStatus (status) {
      if (status == 'sending') return 'Отправлено'
      if (status == 'delivered') return 'Доставлено'
      if (status == 'seen') return 'Просмотрено'
      return status
    },
    // CRUD
    getUsers () {
      this.$store.dispatch('readUsersList')
        .then(() => {})
        .catch(() => {})
    },
    selectDialog (id) {
      //this.dialogId = id
      this.$store.commit('setDialogId', id)
      this.$store.dispatch('massUpdateMessages')
    },
    newDialog (email) {
      const dialog = {
        user1: this.user.email,
        user2: email
      }
      this.$store.dispatch('createDialogUser', dialog)
        .then(() => {
          this.$store.dispatch('readDialogList', this.user.email)
            .then(() => {

              // установка id диалога
              this.$store.commit('setDialogId', this.dialogsList[0].id)

              // подписка на новый канал
              /*
                last_send пишем время активации канала
              */
              this.subscribeСhannel(this.dialogsList[0].id)

              let dialogsIds = []
              for (let i = 0; i < this.dialogsList.length; i++) {
                // массив id диалогов
                dialogsIds.push(this.dialogsList[i].id)
              }

              // чтение сообщений
              this.$store.dispatch('readMessages', dialogsIds)
                .then(() => {})
                .catch(() => {})

            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    // ECHO
    subscribeСhannel (id) {
      Echo.join(`dialog.${id}`)
        .here((users) => {
            //console.log('пользователи в чате')
            //this.$store.commit('setUsersInChat', users)
        })
        .joining((user) => {
            //console.log('присоединился к чату')
            //this.$store.commit('addUsersInChat', user)
        })
        .leaving((user) => {
            //console.log('вышел из чата')
            //this.$store.commit('removeUsersInChat', user)
        })
        .listen('ChatMessage', (e) => {
          if (!e.message.massread) {
            this.$store.dispatch('addMessage', e.message).then(() => {
              this.$store.dispatch('updateDialogList', e.message)
            })
          } else {
            this.$store.dispatch('massReadMessages', e.message)
          }
        })
        .listenForWhisper('typing', (whisper) => {
          this.$store.dispatch('setWhisperUsers', whisper)
        })
    },
    subscribeNewСhat () {
      Echo.join('chat')
        .here((users) => {
          // console.log('пользователи в системе')
          // console.log(users)
          this.$store.commit('setUsersInChat', users)
        })
        .joining((user) => {
          //console.log('присоединился к системе')
          //console.log(user)
          this.$store.commit('addUsersInChat', user)
        })
        .leaving((user) => {
          //console.log('вышел из системы')
          //console.log(user)
          this.$store.commit('removeUsersInChat', user)
        })
        .listen('NewChat', (e) => {
          if (e.chat.user2 == this.user.email) {
            this.$store.dispatch('readDialogList', this.user.email)
              .then(() => {

                // установка id диалога
                this.$store.commit('setDialogId', this.dialogsList[0].id)

                // подписка на новый канал
                /*
                  last_send пишем время активации канала
                */
                this.subscribeСhannel(this.dialogsList[0].id)

                let dialogsIds = []
                for (let i = 0; i < this.dialogsList.length; i++) {
                  // массив id диалогов
                  dialogsIds.push(this.dialogsList[i].id)
                }

                // чтение сообщений
                this.$store.dispatch('readMessages', dialogsIds)
                  .then(() => {})
                  .catch(() => {})

              })
              .catch(() => {})
          }
          //
        })
    }
  },
  mounted () {
    // подписка на оповещения новых чатов
    this.subscribeNewСhat()

    this.$store.dispatch('readUser')
      .then(() => {
        this.$store.dispatch('readDialogList', this.user.email)
          .then(() => {

            // установка id диалога
            this.$store.commit('setDialogId', this.dialogsList[0].id)

            // подписка на свои каналы
            let dialogsIds = []
            for (let i = 0; i < this.dialogsList.length; i++) {
              // подписка на свои каналы
              this.subscribeСhannel(this.dialogsList[i].id)
              // массив id диалогов
              dialogsIds.push(this.dialogsList[i].id)
            }

            // чтение сообщений
            this.$store.dispatch('readMessages', dialogsIds)
              .then(() => {
                this.$store.dispatch('massUpdateMessages')
              })
              .catch(() => {})

          })
          .catch(() => {})
      })
      .catch(() => {
        this.$router.push('/login')
        this.$store.commit('setAuth', 'false')
      })
  }
}
</script>

<style scoped>
.profile {
  display: flex;
  margin: 10px;
}

.divider {
  margin: 10px;
}

.dialog-list {
  border-radius: 3px;
  background-color: #CFD8DC;
  margin: 10px;
  padding: 15px;
}

.dialog-list-active {
  background-color: #90A4AE;
}

.dialog-user-status {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 10px;
}

.dialog-user-status-online {
  background-color: green;
}

.dialog-user-status-offline {
  background-color: red;
}

.dialog-user-status-15 {
  background-color: yellow;
}

.dialog-list-message {
  border-radius: 3px;
  background-color: #FFFFFF;
  padding: 3px;
}

</style>
