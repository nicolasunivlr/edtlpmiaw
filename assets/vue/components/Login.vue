<template>
    <v-app>
        <v-form>
            <v-text-field v-model="username" prepend-icon="mdi-account" name="username" label="Nom de connexion" @keyup.enter="checkLogin" autofocus></v-text-field>
            <v-text-field v-model="password" prepend-icon="mdi-lock" name="password" label="Mot de passe" type="password" @keyup.enter="checkLogin"></v-text-field>
            <v-card-actions>
                <v-btn primary x-large absolute right @click="checkLogin">Connexion</v-btn>
            </v-card-actions>
        </v-form>
        {{ resultat }}
    </v-app>
</template>

<script>
    import ApiSf from "../api/apiSf";

    ApiSf()

    export default {
        name: "Login",
        data() {
            return {
                username: '',
                password: '',
                token: '',
                resultat: ''
            }
        },
        methods: {
            checkLogin() {
                // A tester pour mettre la gestion de la connexion dans le store
                //this.$store.dispatch('signIn')
                ApiSf().post('login_check',{username:this.username,password:this.password})
                    .then(response =>  {
                        this.token=response.data
                        this.resultat='succès'
                        sessionStorage.setItem('token',this.token.token)
                        this.$store.commit('connect',this.username)
                        this.$store.dispatch('getDataAction')
                        this.$router.push('/planning')
                    })
                    .catch( e => {
                        if (e.response) {
                            console.log(e.response)
                            this.resultat = 'Erreur de connexion'
                            this.password=''
                        }
                    })
            }
        }
    }
</script>

<style scoped>

</style>
