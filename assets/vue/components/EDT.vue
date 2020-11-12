<template>
  <v-app>
    <h2>Cours à placer
      <router-link :to="{name: 'Planning'}">Planning</router-link>
    </h2>
    <drop-list :items="cours" @insert="retireCours">
      <template v-slot:item="{item}">
        <drag :key="item.id" class="chip" :data="item">
          <v-chip :color="item.ec.color" outlined @click="showCours(item)">{{ item.ec.type.nom }}:{{ item.ec.name }}&#45;&#45;{{ item.groupe }}&#45;&#45;{{ item.ec.duree }}h</v-chip>
        </drag>
      </template>
      <template v-slot:feedback="{data}">
        <div class="chip" :key="data.id">
          <v-chip color="primary" outlined>
            {{ data.type }}:{{ data.name }}&#45;&#45;{{ data.groupe }}&#45;&#45;{{ data.duree / 60 }}h
          </v-chip>
        </div>
      </template>
    </drop-list>
    <v-simple-table dense>
      <template v-slot:default>
        <thead>
        <tr>
          <th class="text-center"><span class="prev" @click="prevWeek">&lt;</span> Semaine {{ numSemaine }} <span
              class="next" @click="nextWeek">&gt;</span></th>
          <th v-for="index in 5" :key="index" class="text-center jour">{{ dateEnFrancais(getDay(index - 1)) }}</th>
        </tr>
        </thead>
        <tbody class="container">
        <tr v-for="index in (fin-debut)*60/ecart" :key="index">
          <th v-if="(index-1)%(60/ecart)===0" class="time"><span>{{ afficheHeure(index - 1) }}</span></th>
          <th v-else></th>
          <td v-for="jour in 5" :key="jour" :class="['jour-'+jour ,'heure-'+index]">
            <drop @drop="placeCours" class="places relative" :accepts-data="verifPlacement">
              <template v-for="creneau in places">
                <drag v-if="creneau.posLeft===jour && creneau.posTop===index" :key="creneau.id" class="chip"
                      :data="creneau">
                  <div :class="getCoursClass(creneau)"
                       :style="{'background': creneau.ec.color, 'height': calcHauteur(creneau.ec.duree),   }"
                       @click="showPlaces(creneau)">
                    <p class="titre">{{ creneau.ec.type.nom }} - {{ creneau.ec.name }}</p>
                    <p>{{ creneau.ec.promo.nom }}</p>
                    <p>{{ creneau.enseignant }} - {{ creneau.salle }}</p>
                    <p>{{ creneau.remarque }}</p>
                  </div>
                </drag>
              </template>
            </drop>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
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
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Annuler</v-btn>
          <v-btn color="blue darken-1" text @click="save">Sauvegarder</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>

import {Drag, Drop, DropList} from "vue-easy-dnd"

export default {
  name: "EDT",
  components: {
    Drag,
    DropList,
    Drop
  },
  data() {
    return {
      dialog: false,
      paramSemaine: parseInt(this.$route.params.semaine),
      numSemaine: this.getNumSemaine(),
      ecart: 15,
      debut: 8,
      fin: 20,
      editedCours: {
        enseignant: '',
        remarque: '',
        salle: ''
      },
      defaultCours: {
        enseignant: '',
        remarque: '',
        salle: ''
      },
      editedIndex: -1,
      editCours: false,
    }
  },
  computed: {
    numSemString() {
      return 's' + this.numSemaine
    },
    firstTime() {
      const year = 2020;
      const firstDayOfYear = new Date(year, 0, 1).getDay()
      const d = new Date("Jan 01, " + year + " 01:00:00");
      return d.getTime() - (3600000 * 24 * (firstDayOfYear - 1)) + 604800000 * (this.numSemaine - 1)
    },
    places() {
      return this.$store.state.cours.filter(c => c.semaine == this.numSemString && c.place)
    },
    cours() {
      return this.$store.state.cours.filter(c => c.semaine == this.numSemString && !c.place)
    },
  },
  methods: {
    showCours(cours) {
      this.editCours = true
      this.show(cours)
    },
    showPlaces(cours) {
      this.editCours = false
      this.show(cours)
    },
    show(cours) {
      if (this.editCours) {
        this.editedIndex = this.cours.indexOf(cours)
        this.editedCours = Object.assign({}, cours)
      } else {
        this.editedIndex = this.places.indexOf(cours)
        this.editedCours = Object.assign({}, cours)
      }
      this.dialog = true
    },
    save() {
      if (this.editCours) {
        this.$set(this.cours[this.editedIndex], 'enseignant', this.editedCours.enseignant)
        Object.assign(this.cours[this.editedIndex], this.editedCours)
      } else {
        this.$set(this.places[this.editedIndex], 'enseignant', this.editedCours.enseignant)
        Object.assign(this.places[this.editedIndex], this.editedCours)
      }
      this.$store.dispatch('updateCoursApiAction', {
        cours: this.editedCours
      })
      this.close()
    },
    close() {
      this.$nextTick(() => {
        this.editedCours = Object.assign({}, this.defaultCours)
        this.editedIndex = -1
      })
      this.dialog = false
    },
    verifPlacement() {
      // TODO: vérifier qu'on peut drop le cours ici...
      return true
    },
    getCoursClass(cours) {
      let tabClass = ['creneau']
      if (cours.ec.type.nom == 'CM' || cours.ec.type.nom == 'Autre') {
        if (cours.ec.promo.nom == 'Tous') {
          tabClass.push('cm')
        } else {
          tabClass.push('cmdemi')
        }
      } else if (cours.ec.type.nom == 'TD') {
        tabClass.push('cmdemi')
      } else {
        tabClass.push('matiere')
      }
      if (cours.ec.type.nom == 'TD') {
        tabClass.push(cours.groupe + 'td')
      } else {
        tabClass.push(cours.groupe)
      }
      return tabClass
    },
    getNumSemaine() {
      if (Number.isInteger(parseInt(this.$route.params.semaine))) {
        return parseInt(this.$route.params.semaine)
      } else {
        const d = new Date();
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
      }
    },
    getDay(inc) {
      return new Date(this.firstTime + 86400000 * inc);
    },
    dateEnFrancais(date) {
      const options = {
        weekday: 'long',
        month: "long",
        day: "numeric"
      };
      return date.toLocaleDateString('fr-FR', options)
    },
    prevWeek() {
      if (this.numSemaine == 1)
        this.numSemaine = 52
      else
        this.numSemaine--
      this.$router.push({name: 'Edt', params: {semaine: this.numSemaine}})
    },
    nextWeek() {
      if (this.numSemaine == 52)
        this.numSemaine = 1
      else
        this.numSemaine++
      this.$router.push({name: 'Edt', params: {semaine: this.numSemaine}})
    },
    calcHauteur(duree) {
      let haut = 17 * duree * 60 / this.ecart
      return haut + 'px'
    },
    placeCours(c) {
      // TODO: vérifier qu'un cours n'est pas déjà placé pour ce groupe sur ce créneau
      c.data.posLeft = parseInt(c.top.$el.parentNode.classList[0].split('-')[1])
      c.data.posTop = parseInt(c.top.$el.parentNode.classList[1].split('-')[1])
      this.$nextTick(() => {
        this.$store.dispatch('updateCoursAction', {
          cours: c.data,
          place: true
        })
        this.$store.dispatch('updateCoursApiAction', {
          cours: c.data
        })
      })
    },
    afficheHeure(index) {
      let heure = this.debut + index / (60 / this.ecart)
      if (heure < 10) {
        heure = '0' + heure
      }
      heure = heure + ':00'
      return heure
    },
    remove() {
      // on ne fait rien mais corrige le bug avec dnd ... ???
    },
    retireCours(c) {
      this.$store.dispatch('updateCoursAction', {
        cours: c.data,
        place: false
      })
      this.$store.dispatch('updateCoursApiAction', {
        cours: c.data,
      })
    },
  }
}
</script>

<style scoped>

.prev, .next {
  font-size: 24px;
}

.creneau {
  margin: 0;
  padding: 0;
  font-size: 0.75rem;
}

.creneau p {
  margin: 0.1rem;
  padding: 0;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.drop-list {
  display: flex;
  min-height: 32px;
  flex-wrap: wrap;
}

.chip {
  margin: 0 10px;
}

th:first-of-type {
  width: calc(100vw / 12)
}

th, td {
  border-left: thin solid rgba(0, 0, 0, 0.12);
  padding: 0;
  width: calc(100vw / 6);
  height: 16px !important;
}

tr > th, tr > td {
  padding: 0 !important;
}

.places {
  min-height: 16px;
}

.time {
  text-align: right !important;
  font-size: 70% !important;
  color: #70757a !important;
  padding-right: 2px !important;
  vertical-align: top !important;
}

.time span {
  display: block;
  position: relative;
  top: -8px;
  background: white;
}

.relative {
  position: relative;
}

.cm {
  position: absolute;
  text-align: center;
  width: calc(100vw / 6);
  background: olivedrab;
}

.cmdemi {
  position: absolute;
  text-align: center;
  width: calc(100vw / 6 / 2);
  background: olivedrab;
}

.matiere {
  position: absolute;
  text-align: center;
  width: calc(100vw / 6 / 4);
  background: olivedrab;
}

.groupe1, .groupe1td {
  left: 0;
  border: thin solid coral;
}

.groupe2 {
  left: 25%;
  border: thin solid bisque;
}

.groupe3, .groupe2td {
  border: thin solid aqua;
  left: 50%;
}

.groupe4 {
  left: 75%;
  border: thin solid blueviolet;
}

.titre {
  font-weight: bolder;
}
</style>
