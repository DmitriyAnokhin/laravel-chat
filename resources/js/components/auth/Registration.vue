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
                <div class="empty"></div>
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
                <v-text-field
                  v-model.trim="passwordConfirmation"
                  :error-messages="passwordConfirmationErrors"
                  :counter="true"
                  label="Подтверждение пароля"
                  type="password"
                  required
                  @blur="$v.passwordConfirmation.$touch()"
                ></v-text-field>
                <span class="caption grey--text text--darken-1">
                  Введите пароль вашего аккаунта и его подтверждение
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
              @click="onRegister"
              :loading="loading"
              :disabled="!checkValidate || loading"
            >Зарегистрироваться</v-btn>
          </v-card-actions>
        </v-card>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      step: 1,
      email: '',
      password: '',
      passwordConfirmation: ''
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
    },
    passwordConfirmation: {
      required,
      sameAs: sameAs('password')
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    currentTitle () {
      switch (this.step) {
        case 1: return 'Создание аккаунта'
        case 2: return 'Создание аккаунта'
      }
    },
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.required && errors.push('Поле "Email" обязательно')
      !this.$v.email.email && errors.push('Введите правильный Email')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Поле "Пароль" обязательно')
      !this.$v.password.minLength && errors.push('Пароль не может быть менее 8 символов')
      return errors
    },
    passwordConfirmationErrors () {
      const errors = []
      if (!this.$v.passwordConfirmation.$dirty) return errors
      !this.$v.passwordConfirmation.required && errors.push('Подтверждение "Пароля" обязательно')
      !this.$v.passwordConfirmation.sameAs && errors.push('Пароли не совпадают')
      return errors
    },
    checkValidateEmail () {
      if (this.$v.email.email && this.$v.email.required) return true
      return false
    },
    checkValidate () {
      if (this.$v.email.required && this.$v.email.email
        && this.$v.password.required && this.$v.password.minLength
        && this.$v.passwordConfirmation.required && this.$v.passwordConfirmation.sameAs) return true
      return false
    }
  },
  methods: {
    onRegister () {
      const user = {
        'email': this.email,
        'password': this.password,
        'password_confirmation': this.passwordConfirmation
      }
      this.$store.dispatch('registerUser', user)
      .then(() => {
        /* загрузка данных пользователя */
        this.$router.push('/login')
      })
      .catch(() => {})
    }
  }
}
</script>

<style scoped>
.empty {
  height: 68px;
}
</style>
