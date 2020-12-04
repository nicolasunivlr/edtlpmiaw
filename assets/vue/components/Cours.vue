<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Détail du cours</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-text-field v-model="editedCours.enseignant" label="Nom de l'enseignant"></v-text-field>
          </v-row>
          <v-row>
            <v-text-field v-model="editedCours.salle" label="Salle"></v-text-field>
          </v-row>
          <v-row>
            <v-text-field v-model="editedCours.remarque" label="Remarque"></v-text-field>
          </v-row>
          <v-row>
            <v-text-field v-model="editedCours.duree" label="Nombre d'heures"></v-text-field>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Annuler</v-btn>
        <v-btn color="blue darken-1" text @click="save">Sauvegarder</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: "Cours",
  props: {
    editedCours: Object,
    dialog: Boolean,
  },
  data() {
    return {

    }
  },
  computed: {
  },
  methods: {
    save() {
      this.$emit('save')
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>