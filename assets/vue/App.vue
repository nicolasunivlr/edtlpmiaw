<template>
  <v-app>
    <v-app-bar app color="blue-grey" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title class="headline text-uppercase">
        <span class="font-weight-light"> Gestion de l'emploi du temps de la LPMIAW</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-menu offset-y v-if="connecte">
        <template v-slot:activator="{ on }">
          <v-btn  outlined v-on="on">
            <v-icon left>mdi-account-circle</v-icon>{{ login }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="deconnexion"><v-icon left>mdi-exit-to-app</v-icon>Déconnexion</v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <navigation :toggle="drawer" @ferme="drawer = !drawer" @deco="deconnexion"></navigation>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

import Navigation from './components/Navigation.vue'

export default {
  name: 'App',
  components: {
    Navigation
  },
  data() {
    return {
      drawer: false,
    }
  },
  created() {
    this.$store.dispatch('initialiseStoreAction')
    if( this.$store.state.connexion.connecte && this.$store.state.ecs.length === 0) {
      console.log("chargement api")
      this.$store.dispatch('getDataAction')
    }

  },
  computed: {
    connecte()  {
      return this.$store.state.connexion.connecte
    },
    login() {
      return this.$store.state.connexion.login
    }
  },
  watch: {
  },
  methods: {
    deconnexion() {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('store')
      this.$store.state.connexion.connecte=false
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">

</style>
