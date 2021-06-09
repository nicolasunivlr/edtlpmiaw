<template>
  <v-card>
    <v-card-title>
      <span class="headline">Nouveau EC</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="editedEc.nom" label="Nom de l'EC"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-select :items="type" item-text="nom" item-value="nom" label="Type" v-model="editedEc.type" return-object></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-select :items="promo" item-text="nom" item-value="nom" label="Promo" v-model="editedEc.promo" return-object></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="editedEc.nbGroupes" label="Nombre de groupes"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="editedEc.duree" label="Duree" :error="rules.bool" :error-messages="rules.message"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="editedEc.vol" label="Volume">0</v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="12" md="12">
            <v-color-picker class="ma-2" hide-inputs v-model="editedEc.color"></v-color-picker>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="close">Annuler</v-btn>
      <v-btn color="blue darken-1" text @click="save">Sauvegarder</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "NewEC",
  props: {
    editedEc: Object,
    type: Array,
    promo: Array
  },
  data() {
    return {
      rules: {
        bool: false,
        message: ""
      }
    }
  },
  methods:{
    close() {
      this.$emit('close')
    },
    save() {
      if (parseInt(this.editedEc.duree)<=0) {
        this.rules.bool = true
        this.rules.message = "supérieur à 1"
      } else {
        this.$emit('save')
      }
    }
  }
}
</script>

<style scoped>

</style>