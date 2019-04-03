<template>
  <v-container>
    <v-layout row justify-center>
      <v-flex xs12 sm8 md4>

        <v-card
          class="mx-auto"
          max-width="500"
        >
          <v-card-title class="title font-weight-regular justify-space-between">
            <span>{{ currentTitle }}</span>
            <v-avatar
              color="#ff9e95"
              class="subheading white--text"
              size="24"
              v-text="step"
            ></v-avatar>
          </v-card-title>

          <v-window v-model="step">
            <v-window-item :value="1">
              <v-card-text>
                <div class="text-xs-center">
                  <h3 class="title font-weight-light mb-2">Чат</h3>
                </div>
                <v-text-field
                  v-model.trim="email"
                  :error-messages="emailErrors"
                  label="Email"
                  required
                  @blur="$v.email.$touch()"
                ></v-text-field>
                <span class="caption grey--text text--darken-1">
                  Введите логин вашего аккаунта
                </span>
              </v-card-text>
            </v-window-item>

            <v-window-item :value="2">
              <v-card-text>
                <div class="text-xs-center">
                  <h3 class="title font-weight-light mb-2">Чат</h3>
                </div>
                <v-text-field
                  v-model.trim="password"
                  :error-messages="passwordErrors"
                  :counter="true"
                  label="Пароль"
                  type="password"
                  required
                  @blur="$v.password.$touch()"
                ></v-text-field>
                <span class="caption grey--text text--darken-1">
                  Введите пароль вашего аккаунта
                </span>
              </v-card-text>
            </v-window-item>
          </v-window>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn
              :disabled="step === 1"
              flat
              @click="step--"
            >
              Back
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              v-if="step === 1"
              :disabled="!checkValidateEmail || loading"
              color="success"
              @click="step++"
            >
              Далее
            </v-btn>
            <v-btn
              v-if="step === 2"
              color="success"
              @click="onLogin"
              :loading="loading"
              :disabled="!checkValidate || loading"
            >Войти</v-btn>
          </v-card-actions>
        </v-card>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      step: 1,
      email: '',
      password: ''
    }
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(8)
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    currentTitle () {
      switch (this.step) {
        case 1: return 'Вход в аккаунт'
        case 2: return 'Вход в аккаунт'
      }
    },
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Введите правильный Email')
      !this.$v.email.required && errors.push('Поле "Email" обязательно')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.minLength && errors.push('Пароль не может быть менее 8 символов')
      !this.$v.password.required && errors.push('Поле "Пароль" обязательно')
      return errors
    },
    checkValidateEmail () {
      if (this.$v.email.email && this.$v.email.required) return true
      return false
    },
    checkValidate () {
      if (this.$v.email.email && this.$v.email.required
        && this.$v.password.minLength && this.$v.password.required) return true
      return false
    }
  },
  methods: {
    onLogin () {
      const user = {
        'email': this.email,
        'password': this.password
      }
      this.$store.dispatch('loginUser', user)
        .then(() => {
          /* Авторизация в Pusher-js */
          Echo.connector.pusher.config.auth.headers['Authorization'] = 'Bearer ' + localStorage.getItem('authToken')
          this.$router.push('/')
        })
        .catch(() => {})
    }
  },
  created () {
    if (this.$route.query['loginError']) {
      this.$store.dispatch('setError', 'Пожалуйста залогиньтесь!')
    }
  }
}
</script>

<style scoped>

</style>
