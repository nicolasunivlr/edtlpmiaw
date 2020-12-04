<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Projet tuteuré</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-text-field v-model="projetTut.duree" label="Nombre d'heures"></v-text-field>
          </v-row>
<!--          <v-row>-->
<!--            <v-select :items="promo" item-text="nom" item-value="nom" label="Type" v-model="projetTut.remarque" return-object></v-select>-->
<!--          </v-row>-->
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="active" color="error" depressed @click="supp">Supprimer</v-btn>
        <v-btn color="blue darken-1" text @click="close">Annuler</v-btn>
        <v-btn color="blue darken-1" text @click="save">Sauvegarder</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "ProjetTut",
  props: {
    projetTut: Object,
    dialog: Boolean,
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState([
      'promo'
    ]),
    active() {
      return this.projetTut.id !== undefined
    }
  },
  methods: {
    save() {
      this.$emit('save')
    },
    close() {
      this.$emit('close')
    },
    supp() {
      this.$store.dispatch('deleteCoursAction', {cours: this.projetTut})
      this.close()
    }
  }
}
</script>

<style scoped>

</style>