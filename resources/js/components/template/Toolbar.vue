<template>
<div>
  <v-progress-linear class="progress-line" color="#616161" v-if="loading" :indeterminate="true"></v-progress-linear>
  <v-toolbar
    app
    fixed
    flat
    color="#fafafa"
    :clipped-right="$vuetify.breakpoint.mdAndUp"
    class="toolbar"
    >
      <v-toolbar-side-icon
        @click="showDrawer()"
      ></v-toolbar-side-icon>
      <v-toolbar-title>
        {{ pageName }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn
          v-if="checkAuth"
          flat
          @click="onLogout"
        >
          <v-icon
            color="#424242"
            medium
          >exit_to_app</v-icon>
        </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</div>
</template>

<script>
export default {
  computed: {
    checkAuth () {
      return this.$store.getters.checkAuth
    },
    loading () {
      return this.$store.getters.loading
    },
    pageName () {
      switch (this.$route.path) {
        case '/': return 'Диалоги'
        case '/login': return 'Логин'
        case '/registration': return 'Регистрация'
      }
    }
  },
  methods: {
    showDrawer () {
      this.$store.commit('showDrawer')
    },
    onLogout () {
      this.$store.dispatch('logoutUser')
        .then(() => {
          Echo.connector.pusher.config.auth.headers['Authorization'] = 'Bearer ' + null
          this.$router.push('/login')
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.toolbar {
  /* border-bottom: 1px solid #000000 !important; */
}

.progress-line {
  position: absolute;
  width: 100%;
  height: 2px !important;
  z-index: 100;
  margin: 0;
  padding: 0;
}

.pointer {
  cursor: pointer;
}
</style>
