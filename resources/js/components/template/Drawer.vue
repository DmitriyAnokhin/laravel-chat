<template>
  <v-navigation-drawer
    id="app-drawer"
    app
    dark
    temporary
    width="260"
    v-model="drawer"
  >
    <v-img
      :src="image"
      height="100%"
      class="drawer-img"
    >
      <v-layout
        class="fill-height"
        tag="v-list"
        column
      >
        <v-list-tile
          v-for="(link, i) in links"
          :key="i"
          :to="link.to"
          active-class="success"
          avatar
          class="v-list-item"
        >
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title
            v-text="link.text"
          />
        </v-list-tile>
      </v-layout>
    </v-img>
  </v-navigation-drawer>
</template>

<script>
export default {
  data () {
    return {
      logo: '../img/logo.jpg',
      image: '../img/drawer-back.jpg'
    }
  },
  computed: {
    checkAuth () {
      return this.$store.getters.checkAuth
    },
    drawer: {
      get () {
        return this.$store.state.drawer
      },
      set (drawer) {
        this.$store.state.drawer = drawer // записываем новое значение drawer в store
      }
    },
    links () {
      if (this.checkAuth) return [
        {
          to: '/',
          icon: 'dashboard',
          text: 'Диалоги'
        }
      ]
      else return [
        {
          to: '/login',
          icon: 'lock',
          text: 'Логин'
        },
        {
          to: '/registration',
          icon: 'person_add',
          text: 'Регистрация'
        }
      ]
    }
  },
  methods: {
    onLogout () {
      this.$store.dispatch('logoutUser')
        .then(() => {
          this.$router.push('/')
        })
        .catch(() => {})
    }
  }
}
</script>

<style>
.drawer-img {
  padding: 0 20px 0 20px;
}

#app-drawer .v-list__tile {
  border-radius: 4px;
  margin: 5px 0 5px 0;
}
</style>
