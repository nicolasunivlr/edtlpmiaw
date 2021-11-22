<template>
<v-app>
  <v-overlay :value="overlay">
    <v-progress-circular indeterminate size="256">
      <h2 class="text-center">Chargements des données...</h2>
    </v-progress-circular>
  </v-overlay>
  <p></p>
  <v-data-table :headers="entetes" :items="enseignants" :single-expand="true" :expanded.sync="expanded"
                item-key="enseignant" show-expand class="elevation-1" hide-default-footer disable-pagination
                :custom-filter="filterEc" :search="recherche">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Heures de l'année
          <v-select v-model="anneeSelect" :items="annees" item-text="texte" item-value="annee" single-line return-object></v-select>
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field v-model="recherche" label="Recherche Enseignant..."></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-btn color="primary" large @click="$router.push({name: 'planning'})">Planning</v-btn>
      </v-toolbar>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <v-simple-table fixed-header dark>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">&nbsp;</th>
              <th class="text-left">Total</th>
              <th class="text-left">CM</th>
              <th class="text-left">TD</th>
              <th class="text-left">TP</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(d, nomCours, index) in item.cours" :key="index">
              <td>{{ nomCours }}</td>
              <td>{{ d.total }}</td>
              <td>{{ d.CM }}</td>
              <td>{{ d.TD }}</td>
              <td>{{ d.TP }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </td>
    </template>
  </v-data-table>
</v-app>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "StatsEnseignants",
  data() {
    return {
      annees: [{'texte': '2020-2021','annee':2020}, {'texte': '2021-2022','annee':2021}],
      recherche: '',
      expanded: [],
      entetes: [
        {
          text: 'Enseignant',
          align: 'start',
          sortable: true,
          value: 'enseignant',
        },
        { text: 'Total (h)', value: 'total' },
        { text: 'CM', value: 'CM' },
        { text: 'TD', value: 'TD' },
        { text: 'TP', value: 'TP' },
        { text: '', value: 'data-table-expand' },
      ]

    }
  },
  computed: {
    ...mapState([
      'loading', 'overlay', 'annee'
    ]),
    anneeSelect: {
      get() {
        return {'texte': this.annee+'-'+this.annee+1,'annee':this.annee}
      },
      set(obj) {
        this.$store.state.annee=obj.annee
      }
    },
    enseignantsBruts() {
      return this.$store.state.enseignants
    },
    enseignants() {
      const ens=[]
      this.enseignantsBruts.forEach(e => {
        const coursEffectues = { 'enseignant': '', 'CM': 0, 'TD':0, 'TP':0, 'total':0 }
        coursEffectues.enseignant = e.nomComplet
        coursEffectues.cours={}
        e.cours.forEach(c=> {
          if(c.place) {
            coursEffectues[c.ec.type.nom] += c.duree
            coursEffectues.total+=c.duree
            if(typeof coursEffectues.cours[c.ec.nom] === "undefined") {
              coursEffectues.cours[c.ec.nom]= {'CM':0, 'TD':0, 'TP':0, 'total':0}
            }
            coursEffectues.cours[c.ec.nom][c.ec.type.nom] += c.duree
            coursEffectues.cours[c.ec.nom].total += c.duree
          }
        })
        ens.push( coursEffectues)
      })
      return ens
    }
  },
  methods: {
    filterEc (value, search, item) {
      return value != null &&
          search != null &&
          typeof value === 'string' && value.toString().toLowerCase().indexOf(search) !== -1
    },
  },
  watch: {
    anneeSelect(newVal) {
      this.$store.dispatch('changeAnneeAction',newVal.annee)
    }
  },
}
</script>

<style scoped>
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td, .v-data-table > .v-data-table__wrapper > table > tbody > tr > th, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > th, .v-data-table > .v-data-table__wrapper > table > thead > tr > td, .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  padding: 0 0;
}
</style>