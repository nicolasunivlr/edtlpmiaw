<template>
    <v-navigation-drawer v-model="toggle" fixed app>
        <v-list>
            <v-list-item link v-for="route in routes" :key="route.name" @click="action(route)">
                <v-list-item-action>
                    <v-icon>{{ route.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>{{ route.texte }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="connecte" @click="deconnexion">
                <v-list-item-action>
                    <v-icon>mdi-exit-to-app</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title >Déconnexion</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
    export default {
        name: "Navigation",
        props: {
            toggle: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        computed: {
          connecte() {
              return this.$store.state.connexion.connecte
          },
          routes() {
            if (this.connecte)
              return this.$router.options.routes.filter(r => r.name !== 'login')
            else
              return this.$router.options.routes.filter(r => r.name === 'login')
          }
        },
        methods: {
            action(route) {
              this.fermetureMenu()
              if (route.name === 'Edt')
                this.$router.push({ name: 'edt', params : {annee: this.$store.state.annee}})
              else
                this.$router.push(route.path)
            },
            fermetureMenu() {
                this.$emit('ferme')
            },
            deconnexion() {
                this.fermetureMenu()
                this.$emit('deco')
            }
        },
    }
</script>

<style scoped>

</style>
