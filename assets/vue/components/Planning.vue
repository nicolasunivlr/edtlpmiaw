<template>
  <v-app>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="256">
        <h2 class="text-center">Mise à jour des enseignements...</h2>
      </v-progress-circular>
    </v-overlay>
    <p></p>
    <v-data-table :headers="$store.state.headers" :items="$store.state.ecs" dense locale="fr-FR" hide-default-footer
                  disable-sort :search="recherche" :custom-filter="filterEc" :loading="loading"
                  disable-pagination hide-default-header no-data-text="Aucun enseignement n'a été créé...">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Planning de l'année {{ annee }}-{{ annee +1 }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field v-model="recherche" label="Recherche EC..."></v-text-field>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nouveau EC</v-btn>
            </template>
            <NewEC :edited-ec="editedEc" :promo="promo" :type="type" @save="saveNew" @close="closeNew"></NewEC>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:header="{ props: { headers } }">
        <thead>
        <tr>
          <th v-for="header in headers" :key="header.value" role="columnheader" scope="col" :aria-label="header.texte" class="text-center">
            <v-tooltip bottom v-if="header.texte.startsWith('S')">
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on"><router-link :to="{name: 'Edt', params: {semaine: parseInt(header.texte.substr(1),10)}}">{{ header.texte }}</router-link></span>
              </template>
              <div>WDI: {{ getNbHeuresSemaine(header.value, 'WDI')}}h</div>
              <div>DFS: {{ getNbHeuresSemaine(header.value, 'DFS')}}h</div>
            </v-tooltip>
            <span v-else-if="header.texte === 'Action'">&nbsp;</span>
            <span v-else-if="header.value === 'nom'" @click="changeSort()">{{ header.texte }}<v-icon small>{{getFleche()}}</v-icon></span>
            <span v-else>{{ header.texte }}</span>
          </th>
        </tr>
        </thead>
      </template>
      <template v-slot:item="items">
        <tr>
          <td v-for="col in items.headers" :key="col.value" :set="colValue = getProp(items.item,col.value)" class="text-center">
            <v-icon v-if="col.value==='action'" small class="mr-2" @click="editItem(items.item)">mdi-pencil</v-icon>
            <v-edit-dialog v-else-if="col.value !== 'total' && col.value !== 'nom' && col.value !== 'promo'"
                           :return-value.sync="colValue" @save="save()" @cancel="cancel" @open="open" @close="close">
              <template v-if="getNbHeures(items.item, col.value)===''"><div>&nbsp;</div></template>
              <template v-else-if="getNbHeures(items.item, col.value) == getNbHeuresEffectives(items.item, col.value)">
                <div class="vert">{{getNbHeures(items.item, col.value)}}</div>
              </template>
              <template v-else-if="getNbHeures(items.item, col.value) < getNbHeuresEffectives(items.item, col.value)">
                <div class="rouge">{{getNbHeuresEffectives(items.item, col.value)}}({{getNbHeures(items.item, col.value)}})</div>
              </template>
              <template v-else>{{getNbHeuresEffectives(items.item, col.value)}}({{getNbHeures(items.item, col.value)}})</template>
              <template v-slot:input>
                <div class="mt-4 title">{{ items.item.nom }}-{{ items.item.type.nom }} : {{ col.value }}</div>
                <!-- :value et @input remplacent le v-model -->
                <v-text-field :value="getNbHeures(items.item,col.value)" @change="updateProp(items.item,col.value,$event)"
                              label="Nb heures" single-line autofocus></v-text-field>
              </template>
            </v-edit-dialog>
            <v-chip v-else-if="col.value === 'total'" :color="getColor(getNbHeuresEffectivesEc(items.item),items.item.vol)">
              {{ getNbHeuresEffectivesEc(items.item) }}h
            </v-chip>
            <v-tooltip v-else-if="col.value === 'nom'" right>
              <template v-slot:activator="{ on, attrs }">
                <!-- colValue n'a pas de valeur dans ce slot ??? on utilise la fonction getProp -->
                <div :style="'color:' + items.item.color" v-bind="attrs" v-on="on">{{ getProp(items.item,col.value) }}-{{items.item.type.nom}}</div>
              </template>
              <span>{{items.item.nbGroupes}} groupe{{items.item.nbGroupes>1 ? 's': ''}} pour {{items.item.duree}}h. Vol : {{items.item.vol}}h</span>
            </v-tooltip>
            <div v-else>{{items.item.promo.nom}}</div>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
    </v-snackbar>
  </v-app>
</template>

<script>

import { mapState } from 'vuex'
import NewEC from "./NewEC"

export default {
  name: 'Planning',
  components: {
    NewEC
  },
  data() {
    return {
      recherche: '',
      dialog: false,
      snack: false,
      snackColor: '',
      snackText: '',
      editedIndex: -1,
      editedEc: {
        nom: '',
        type: {nom: ''},
        vol: 0,
        promo: {nom: ''},
        color: '',
        duree: 0,
        nbGroupes: 1,
        semaines: {}
      },
      defaultEc: {
        nom: '',
        type: {nom: ''},
        vol: 0,
        promo: {nom: ''},
        color: '',
        duree: 0,
        nbGroupes: 1,
        semaines: {}
      },
      asc: null,
    }
  },
  computed: {
    ...mapState([
        'ecs', 'headers', 'promo', 'type', 'loading', 'overlay', 'annee'
             ]),
  },
  created() {

  },
  methods: {
    getFleche() {
      if (this.asc === null)
        return ""
      if (this.asc)
        return "mdi-arrow-up"
      else
        return "mdi-arrow-down"
    },
    changeSort() {
      if (this.asc === null)
        this.asc = true
      this.$store.dispatch('triEcsAction', {order: this.asc})
      this.asc = !this.asc
    },
    filterEc (value, search, item) {
      return value != null &&
          search != null &&
          typeof value === 'string' && value.toString().toLowerCase().indexOf(search) !== -1
    },
    getColor(fait, afaire) {
      if (fait === 0) return 'white'
      if (fait > afaire) return 'red'
      else if (fait < afaire) return 'yellow'
      else return 'green'
    },
    updateProp(ec, semaine, nbHeures) {
        this.$nextTick(() => {
          // permet de mettre à jour de manière réactive l'elément
          this.$set(ec.semaines, semaine, nbHeures)
          this.$store.dispatch('updateEcsAction', {
            ec: ec,
            semaine: semaine,
            nbHeures: nbHeures
          })
        })
    },
    getProp(elem, key) {
      return elem[key]
    },
    getNbHeures(ec, semaine) {
      return ec.semaines[semaine] ? ec.semaines[semaine] : ''
    },
    getNbHeuresEffectivesEc(ec) {
      let nbHeures = 0
      // c.ec !== undefined car les projet tut n'ont pas d'ec...
      const coursSemaineEcPlaces = this.$store.state.coursPlaces.filter(c => c.ec !== undefined && c.ec.id === ec.id)
      coursSemaineEcPlaces.forEach(c=> nbHeures = nbHeures + c.duree)
      return nbHeures/ec.nbGroupes
    },
    getNbHeuresEffectives(ec,semaine) {
      if (this.getNbHeures(ec, semaine) === '') {
        return ''
      } else {
        let nbHeures = 0
        // c.ec !== undefined car les projet tut n'ont pas d'ec...
        const coursSemaineEcPlaces = this.$store.state.coursPlaces.filter(c => c.ec !== undefined && c.semaine === semaine && c.ec.id === ec.id)
        coursSemaineEcPlaces.forEach(c=> nbHeures = nbHeures + c.duree)
        return nbHeures/ec.nbGroupes
      }
    },
    getHeuresTotales(ec) {
      let total = 0
      if(ec.semaines) {
        for (const [s, nb] of Object.entries(ec.semaines)) {
          s
          total = total + parseFloat(nb)
        }
      }
      return total
    },
    getNbHeuresSemaine(s, promo) {
      // ne va pas car ne tient pas compte des filières WDI/ DFS, AP, non-AP
      let nb = 0
      this.$store.state.ecs.forEach((ec) => {
        if (this.getNbHeures(ec,s) !== '' && (ec.promo.nom === 'Tous' || ec.promo.nom === promo)) {
          nb += parseFloat(this.getNbHeures(ec,s))
        }
      })
      return nb
    },
    save() {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Nb Heures modifié'
    },
    cancel() {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Annuler'
    },
    open() {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = "Ajout d'heures"
    },
    close() {
    },
    closeNew() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedEc = Object.assign({}, this.defaultEc)
        this.editedIndex = -1
      })
    },
    saveNew() {
      if (this.editedIndex > -1) {
        Object.assign(this.ecs[this.editedIndex], this.editedEc)
        this.$store.dispatch('updateEcsAction', {
          ec: this.editedEc,
          nbHeures: -1
        })
      } else {
        this.ecs.push(this.editedEc)
        this.$store.dispatch('createEcsApiAction', this.editedEc)
      }
      this.closeNew()
    },
    editItem(item) {
      this.editedIndex = this.ecs.indexOf(item)
      this.editedEc = Object.assign({}, item)
      this.dialog = true
    },
  },
  watch: {
    dialog(val) {
      val || this.closeNew()
    },
  },
}
</script>

<style scoped>

.vert {
  color: darkgreen;
  font-weight: bold;
}

.rouge {
  color: darkred;
  font-weight: bold;
}

.drop-list {
  flex-wrap: wrap;
}

.chip {
  padding-bottom: 10px;
}

td {
  border-left: thin solid rgba(0,0,0,0.12);
  box-sizing: border-box;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td, .v-data-table > .v-data-table__wrapper > table > tbody > tr > th, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > th, .v-data-table > .v-data-table__wrapper > table > thead > tr > td, .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  padding: 0 0;
}

</style>
