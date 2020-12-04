<template>
  <v-app>
    <v-app-bar app color="blue-grey" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title class="headline text-uppercase">
        <span class="font-weight-light"> Gestion de l'emploi du temps de la LPMIAW</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
        <template v-slot:activator="{ on, attrs }">
          <v-btn outlined v-bind="attrs" v-on="on">
            <v-icon left>mdi-cog</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-action>
                <v-switch v-model="placement"></v-switch>
              </v-list-item-action>
              <v-list-item-title>Contrôle du placement (béta)</v-list-item-title>
            </v-list-item>
          </v-list>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="menu = false">Valider</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
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
      menu: false,
      hints: true,
    }
  },
  created() {
    this.$store.dispatch('initialiseStoreAction')
    if (this.connecte) {
      console.log("chargement api")
      this.$store.dispatch('getCoursPlacesAction')
      this.$store.dispatch('getDataAction')
          .catch(() => {
        this.deconnexion()
      })
    }
  },
  computed: {
    placement: {
      get() {
        return this.$store.state.placement
      },
      set(value) {
        this.$store.state.placement = value
      }
    },
    connecte()  {
      return this.$store.state.connexion.connecte
    },
    login() {
      return this.$store.state.connexion.login
    }
  },
  watch: {
    connecte() {
      if (this.connecte === false) {
        this.$router.push('/login')
      }
    }
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
