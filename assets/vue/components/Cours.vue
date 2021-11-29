<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Détail du cours</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-autocomplete v-model="editedCours.prof" label="Nom de l'enseignant" :items="enseignants" item-text="nomComplet" item-value="nomComplet" single-line return-object></v-autocomplete>
          </v-row>
          <v-row>
            <v-text-field v-model="editedCours.salle" label="Salle"></v-text-field>
          </v-row>
          <v-row>
            <v-text-field v-model="editedCours.remarque" label="Remarque"></v-text-field>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-menu v-model="changeDate" :close-on-content-click="false" transition="scale-transition">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field :value="dateTextField" label="Date du cours" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="dateSansHeure" @input="changeDate = false" first-day-of-week="1" :min="premierJour" :max="dernierJour" no-title></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="6">
              <v-menu v-model="changeHeure" :close-on-content-click="false" transition="scale-transition" :return-value.sync="dateAvecHeure" ref="heureCours">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field :value="heureTextField" label="Heure du cours" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-time-picker v-if="changeHeure" v-model="dateAvecHeure" format="24hr" :allowed-minutes="par15min"
                               @click:minute="$refs.heureCours.save(dateAvecHeure)" :allowed-hours="de8a20" min="08:00" max="20:00"></v-time-picker>
              </v-menu>
            </v-col>
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
import moment from "moment"

export default {
  name: "Cours",
  props: {
    editedCours: Object,
    dialog: Boolean,
  },
  data() {
    return {
      changeDate: false,
      changeHeure: false,
    }
  },
  computed: {
    premierJour() {
      return moment(this.editedCours.date).day(1).format("YYYY-MM-DD")
    },
    dernierJour() {
      return moment(this.editedCours.date).day(5).format("YYYY-MM-DD")
    },
    enseignants() {
      return this.$store.state.enseignants
    },
    dateSansHeure: {
      get() {
        return this.editedCours.date
          ? moment(this.editedCours.date).format("YYYY-MM-DD")
          : "";
      },
      set(date) {
        const decoupDate = date.split('-')
        this.editedCours.date = moment(this.editedCours.date).set({'year': parseInt(decoupDate[0]), 'month': parseInt(decoupDate[1])-1, 'date': parseInt(decoupDate[2])}).toISOString(true)
      }
    },
    dateAvecHeure: {
      get() {
        return this.editedCours.date
            ? moment(this.editedCours.date).format("HH:mm")
            : "";
      },
      set(heure) {
        const decoupHeure = heure.split(':')
        this.editedCours.date=moment(this.editedCours.date).set({'hour': decoupHeure[0], 'minute': decoupHeure[1]}).toISOString(true)
      }
    },
    dateTextField () {
      return this.editedCours.date ? moment(this.editedCours.date).format('Do MMMM YYYY') : ''
    },
    heureTextField () {
      return this.editedCours.date ? moment(this.editedCours.date).format('HH:mm') : ''
    },
  },
  methods: {
    par15min: m => m % 15 === 0,
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