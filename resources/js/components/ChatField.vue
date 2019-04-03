<template>
  <div>
    <div class="dialog-box">

      <div class="dialog-box-field" ref="dialogfield">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="getMessageClass(message.author)"
        >

          <div class="dialog-box-message">

          <div>{{ message.author }}</div>
          <v-divider></v-divider>
          <div class="dialog-box-message-text">
            <div v-html="formatMessage(message.message)"></div>
            <div v-if="message.attachment_type == 'image/jpeg'
              || message.attachment_type == 'image/gif'
              || message.attachment_type == 'image/png'">
              <img :src="getFileLink(message.attachment)" class="dialog-box-message-img">
            </div>
            <div v-else>
              <div v-if="message.attachment_type">
                <a :href="getFileLink(message.attachment)" download>{{ message.attachment }}</a>
              </div>
            </div>
          </div>
          <div class="dialog-box-message-status">{{ formatDate(message.send_time) }}</div>
          <div class="dialog-box-message-status" v-if="message.author == user.email">{{ formatStatus(message.status) }}</div>

          </div>

        </div>
      </div>

      <div class="dialog-box-whisper" v-html="whisperUser"></div>

      <div class="dialog-box-input">
        <div class="dialog-box-input-icon2">
          <!-- input file -->
          <input id="file" type="file" class="input-file" v-on:change="newFile()">
          <label for="file" class="input-label js-labelFile">
            <div class="preview-icon-pos">
              <v-icon :color="getFileColor(file)" class="preview-icon">attach_file</v-icon>
            </div>
          </label>
        </div>
        <div class="dialog-box-input-text">
          <textarea
            v-model="newMessage"
            class="dialog-box-input-text2"
            type="text"
            @blur="sendTypingEvent(dialogId, 'none')"
            @keyup="sendTypingEvent(dialogId, $event)">
          ></textarea>
        </div>
        <div>
          <v-btn
            flat
            fab
            small
            class="dialog-box-input-icon"
            @click="sendMessage()"
            :disabled="validateSendMessage"
          >
            <v-icon :color="getSendColor(validateSendMessage)" large>send</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'dialogId'
  ],
  data () {
    return {
      newMessage: '',
      file: '',
      sizeError: false
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    user () {
      return this.$store.getters.getUser
    },
    domains () {
      return this.$store.getters.getDomains
    },
    messages () {
      return this.$store.getters.getMessages[this.dialogId]
    },
    validateSendMessage () {
      if (this.newMessage == '' && this.file == '') return true
      if (this.sizeError) return true
      return false
    },
    whisperUser () {
      let dialog_id = this.dialogId
      let user = this.user
      let whisper = this.$store.getters.getWhisperUsers.filter(item => item.dialog_id == dialog_id && item.email != user.email)
      if (whisper[0] && whisper[0].action == 'print') return whisper[0].email + ' печатает сообщение'
      if (whisper[0] && whisper[0].action == 'erases') return whisper[0].email + ' стирает сообщение'
      if (whisper[0] && whisper[0].action == 'none') return '&nbsp;'
      return '&nbsp;'
    }
  },
  watch: {
    dialogId: function (val) {
      this.newMessage = ''
      this.file = ''
      this.sizeError = false
    }
  },
  methods: {
    // TEMPLATE
    getSendColor (validateSendMessage) {
      if (!validateSendMessage) return '#1565C0'
      return '#E3F2FD'
    },
    getFileColor (file) {
      if (file == '') return '#000000'
      return '#FF0000'
    },
    getMessageClass (author) {
      if (author == this.user.email) return 'message-my'
      return 'message-other'
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
    getFileLink (attachment) {
      return document.location.protocol + '//' + document.location.host + '/' + attachment.replace('public', 'storage')
    },
    // MESSAGE
    // добавляем новый файл
    newFile () {
      // файл добавлен в форму
      let file = document.getElementById('file').files[0]
      if (file) {
        // файл соответствует критериям
        if (this.checkFile(file)) {
          this.file = file
        }
      }
    },
    // проверка размера файла
    checkFile (file) {
      if (file.size < 1000000) {
        this.sizeError = false
        return true // лимит 1 Mb
      }
      else {
        this.sizeError = true
        this.$store.dispatch('setError', 'Превышен размер файла (1 Мб)')
      }
    },
    // превью файла
    previewFile (file) {
      // загрузка файла
      let reader = new FileReader()
      // обработка после загрузки файла
      reader.onload = function () {
        switch (file.type) {
          case 'image/jpeg':
            this.filePreview = reader.result
            break
          case 'image/gif':
            this.filePreview = reader.result
            break
          case 'image/png':
            this.filePreview = reader.result
            break
        }
      }
      // загрузка файла
      reader.readAsDataURL(document.getElementById('file').files[0])
    },
    // отправляем сообщение
    sendMessage () {
      let str = this.newMessage

      /*
        разборка URL
      */
      this.domains.forEach(function (item) {

        if (str.indexOf(item) >= 0) {

          let dotIndex = str.indexOf(item)
          let startIndex = 0
          //console.log(dotIndex)

          for (let i = dotIndex; ;i--) {
            if (i == 0 || str[i] == ' ' || str[i] == '\n') {
              if (i == 0) {
                startIndex = i
                //console.log('начало url: ' + startIndex)
              } else {
                startIndex = i + 1
                //console.log('начало url: ' + startIndex)
              }
              let endIndex = dotIndex + item.length
              //console.log('конец url: ' + endIndex)

              /*
                выбираем строку startIndex, endIndex и заменяем на url
              */
              let urlStr = str.slice(startIndex, endIndex)
              // удаляем грязный домен из строки
              str = str.replace(urlStr, '')

              urlStr = urlStr.replace('https', '')
              urlStr = urlStr.replace('http', '')
              urlStr = urlStr.replace(':', '')

              let pos = 0
              let foundPos = ''
              while (true) {
                foundPos = urlStr.indexOf('/', pos)
                if (foundPos != -1) urlStr = urlStr.replace('/', '')
                if (foundPos == -1) break
                pos = foundPos // продолжить поиск со следующей
              }

              // формируем строку с чистым доменом
              let ssF = str.substring(0, startIndex) // символы впереди
              let ssB = str.substring(startIndex) // символы сзади
              if (ssB[0] == '/') ssB = ssB.slice(1) // убираем '/' в начале строки
              str = ssF + urlStr + ssB
              str = str.replace(urlStr, '<a href="http://' + urlStr + '" target="_blank">' + urlStr + '</a>')
              break
            }
          }

        }

      })

      // return

      const message = {
        dialog_id: this.dialogId,
        author: this.user.email,
        message: JSON.stringify(str),
        attachment: '',
        attachment_type: this.file.type,
        file: this.file,
        status: 'sending',
        send_time: new Date().getTime()
      }

      this.sendTypingEvent(this.dialogId, 'none')

      this.$store.dispatch('addMessage', message)

      this.$store.dispatch('sendMessages', message)
        .then(() => {
          this.newMessage = ''
          this.file = ''
          this.sizeError = false
        })
        .catch(() => {})

    },
    // WHISPER
    sendTypingEvent(id, event) {
      // пусто
      if (event == 'none') {
        const whisper = {
          dialog_id: id,
          email: this.user.email,
          action: 'none'
        }
        Echo.join(`dialog.${id}`)
          .whisper('typing', whisper)
      // перенос на новую строку
      } else if (event.key == 'Enter' && event.ctrlKey) {
        this.newMessage = this.newMessage + '\n'
      // отправка сообщения
      } else if (event.key == 'Enter') {
        this.sendMessage()
      // стирает
      } else if (event.key == 'Backspace' || event.key == 'Delete') {
        const whisper = {
          dialog_id: id,
          email: this.user.email,
          action: 'erases'
        }
        Echo.join(`dialog.${id}`)
          .whisper('typing', whisper)
      // печатает
      } else {
        const whisper = {
          dialog_id: id,
          email: this.user.email,
          action: 'print'
        }
        Echo.join(`dialog.${id}`)
          .whisper('typing', whisper)
      }
    }
  },
  updated () {
    let elem = this.$refs.dialogfield
    elem.scrollTop = elem.scrollHeight
  }
}
</script>

<style scoped>
/* DIALOG BOX */
.dialog-box {
  position: relative;
  padding: 10px;
  border-left: 1px solid #c3c3c3;
}

.dialog-box-field {
  /*background-color: #ECEFF1;*/
  border-radius: 3px;
  height: 60vh;
  padding: 10px;
  margin-bottom: 5px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.message-my {
  width: 300px;
  margin: 0 0 0 auto;
}

.message-other {
  width: 300px;
  margin: 0 auto 0 0;
}

.dialog-box-message {
  background-color: #ECEFF1;
  padding: 20px;
  border-radius: 5px;
  margin: 10px;
}

.dialog-box-message-status {
  font-size: 12px;
  text-align: right;
}

.dialog-box-whisper {
  padding: 10px;
  color: #c3c3c3;
}

.dialog-box-input {
  display: flex;
  background-color: #CFD8DC;
  padding: 10px;
  margin: 0 10px;
  border-radius: 3px;
}

.dialog-box-input-text {
  position: relative;
  width: 100%;
  padding: 0 10px;
  background-color: #FFFFFF;
  border-radius: 3px;
}

.dialog-box-message-img {
  width: 100%;
  height: auto;
}

.dialog-box-input-text2 {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 5px;
  width: 100%;
}

/* --- FILE --- */
.dialog-box-input-icon {
  position: relative;
  width: 40px;
  height: 40px;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: cover;
  text-align: center;
  color: #90A4AE;
  cursor: pointer;
}

.dialog-box-input-icon2 {
  position: relative;
  width: 70px;
  height: 40px;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: cover;
  text-align: center;
  color: #90A4AE;
  cursor: pointer;
}

.preview-icon-pos {
  position: relative;
  top: 5px;
}

.preview-icon {
  font-size: 42px;
}

.input-label {
  color: #90A4AE;
  padding: 0;
  line-height: 59px;
  width: 59px;
  margin: auto;
  display: block;
  text-align: center;
}

.input-label:hover, .input-label:focus {
  color: #B0BEC5;
  border-color: #B0BEC5;
}

.input-file {
  width: .1px;
  height: .1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.input-file + .js-labelFile {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0px;
  cursor: pointer;
}
</style>
