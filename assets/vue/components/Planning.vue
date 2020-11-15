<template>
  <v-app>
    <v-data-table :headers="$store.state.headers" :items="$store.state.ecs" dense locale="fr-FR" hide-default-footer
                  disable-sort :search="recherche" :custom-filter="filterEc" :loading="loading"
                  disable-pagination hide-default-header no-data-text="Aucun enseignement n'a été créé...">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Planning de l'année 2020-2021</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nouveau EC</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Nouveau EC</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedEc.name" label="Nom de l'EC"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select :items="types" item-text="nom" item-value="nom" label="Type" v-model="editedEc.type" return-object></v-select>
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
                      <v-text-field v-model="editedEc.duree" label="Duree"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedEc.vol" label="Volume"></v-text-field>
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
                <v-btn color="blue darken-1" text @click="closeNew">Annuler</v-btn>
                <v-btn color="blue darken-1" text @click="saveNew">Sauvegarder</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-text-field v-model="recherche" label="Recherche EC..." class="mx-4"></v-text-field>
      </template>
      <template v-slot:header="headers">
        <thead>
        <tr>
          <th v-for="header in headers.props.headers" :key="header.value" role="columnheader" scope="col" :aria-label="header" class="text-start">
            <span v-if="header.texte.startsWith('S')">
              <router-link :to="{name: 'Edt', params: {semaine: parseInt(header.texte.substr(1),10)}}">{{ header.texte }}</router-link>
            </span>
            <span v-else>{{ header.texte }}</span>
          </th>
        </tr>
        </thead>
      </template>
      <template v-slot:item="items">
        <tr>
          <td v-for="col in items.headers" :key="col.value" :set="colValue = getProp(items.item,col.value)">
            <v-icon v-if="col.value==='action'" small class="mr-2" @click="editItem(items.item)">mdi-pencil</v-icon>
            <v-edit-dialog v-else-if="col.value !== 'total' && col.value !== 'name' && col.value !== 'type'"
                           :return-value.sync="colValue" @save="save()" @cancel="cancel" @open="open" @close="close">
              <div>{{ getNbHeures(items.item, col.value) }}</div>
              <template v-slot:input>
                <div class="mt-4 title">{{ items.item.name }}-{{ items.item.type.nom }} : {{ col.value }}</div>
                <!-- :value et @input remplacent le v-model -->
                <v-text-field :value="getNbHeures(items.item,col.value)" @change="updateProp(items.item,col.value,$event)"
                              :rules="[entierPositif]" label="Nb heures" single-line autofocus></v-text-field>
              </template>
            </v-edit-dialog>
            <!-- TODO: mettre une info bulle pour présenter les options de chaque ec avec v-tooltip -->
            <v-chip v-else-if="col.value === 'total'" :color="getColor(getHeuresTotales(items.item),items.item.vol)">
              {{ getHeuresTotales(items.item) }}h
            </v-chip>
            <v-tooltip v-else-if="col.value === 'name'" right>
              <template v-slot:activator="{ on, attrs }">
                <!-- colValue n'a pas de valeur dans ce slot ??? on utilise la fonction getProp -->
                <div :style="'color:' + items.item.color" v-bind="attrs" v-on="on">{{ getProp(items.item,col.value) }}</div>
              </template>
              <span>{{items.item.promo.nom}}, {{items.item.nbGroupes}} groupe{{items.item.nbGroupes>1 ? 's': ''}} pour {{items.item.duree}}h</span>
            </v-tooltip>
            <div v-else>{{colValue.nom}}</div>
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

export default {
  name: 'Planning',
  components: {},
  data() {
    return {
      recherche: '',
      compteurUpdate:0,
      dialog: false,
      snack: false,
      snackColor: '',
      snackText: '',
      entierPositif: v => parseInt(v) >= 0 || 'nombre impossible',
      editedIndex: -1,
      editedEc: {
        name: '',
        type: {nom: ''},
        vol: 0,
        promo: {nom: ''},
        color: '',
        duree: 0,
        nbGroupes: 1,
        semaines: {}
      },
      defaultEc: {
        name: '',
        type: {nom: ''},
        vol: 0,
        promo: {nom: 'Tous'},
        color: '',
        duree: 0,
        nbGroupes: 1,
        semaines: {}
      },
    }
  },
  computed: {
    ecs() {
      return this.$store.state.ecs
    },
    headers() {
      return this.$store.state.headers
    },
    promo() {
      return this.$store.state.promo
    },
    types() {
      return this.$store.state.types
    },
    loading() {
      return this.$store.state.loading
    }
  },
  methods: {
    filterEc (value, search, item) {
      return value != null &&
          search != null &&
          typeof value === 'string' && value.toString().toLowerCase().indexOf(search) !== -1
    },
    getColor(fait, afaire) {
      if (fait > afaire) return 'red'
      else if (fait < afaire) return 'yellow'
      else return 'green'
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
    updateProp(ec, semaine, nbHeures) {
      //if (this.compteurUpdate % 2 === 0) {
        this.$nextTick(() => {
          // permet de mettre à jour de manière réactive l'elément
          this.$set(ec.semaines, semaine, nbHeures)
          this.$store.dispatch('updateEcsAction', {
            ec: ec,
            semaine: semaine,
            nbHeures: nbHeures
          })
        })
        this.compteurUpdate++
      //}
    },
    getProp(elem, key) {
      return elem[key]
    },
    getNbHeures(elem, key) {
      return elem.semaines[key] ? elem.semaines[key] : ''
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

.drop-list {
  flex-wrap: wrap;
}

.chip {
  padding-bottom: 10px;
}

</style>
