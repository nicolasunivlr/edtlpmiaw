<template>
  <v-app>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-toolbar flat v-if="connecte">
      <v-toolbar-title >Cours à placer</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="grey" large @click="newProjetTut">Projets Tut<v-icon dark right>mdi-plus</v-icon></v-btn>
      <v-spacer></v-spacer>
      <v-btn color="success" large @click="exportPdf">PDF<v-icon right dark>mdi-export-variant</v-icon></v-btn>&nbsp;
      <v-btn color="primary" large @click="$router.push({name: 'planning'})">Planning</v-btn>
    </v-toolbar>
    <drop-list :items="cours" @insert="retireCours" :set="ancienEc=''" v-if="connecte">
      <template v-slot:item="{item}">
        <div :key="item.id+100" class="a-la-ligne" v-if="retourLigne(item.ec.nom, ancienEc)">&nbsp;</div>
        <drag v-if="item.ec" :key="item.id" class="chip" :data="item" :set="ancienEc=item.ec.nom">
          <!-- TODO: Enlever item.ec.type.nom et item.groupe pour les projets tut-->
          <v-chip v-if="item.ec['@id']!== $store.state.idProjetTut" :color="item.ec.color" @click="showCours(item)" label>{{ item.ec.type.nom }}:{{ item.ec.nom }}&#45;&#45;groupe{{ item.groupe }}&#45;&#45;{{ item.duree }}h</v-chip>
          <v-chip v-else :color="item.ec.color" @click="showCours(item)" label>{{ item.ec.nom }}&#45;&#45;{{ item.duree }}h</v-chip>
        </drag>
      </template>
      <template v-slot:feedback="{data}">
        <div class="chip" :key="data.id">
          <v-chip color="primary" outlined>
            {{ data.ec.type.nom }}:{{ data.ec.nom }}&#45;&#45;groupe{{ data.groupe }}&#45;&#45;{{ data.duree }}h
          </v-chip>
        </div>
      </template>
    </drop-list>
    <div id="capture">
    <v-simple-table dense>
      <template v-slot:default>
        <thead>
        <tr>
          <th class="text-center"><span class="prev" @click="prevWeek">&lt;</span> Semaine {{ numSemaine }} <span
              class="next" @click="nextWeek">&gt;</span></th>
          <th v-for="index in 5" :key="index" class="text-center jour">{{ getDay(index) }}</th>
        </tr>
        </thead>
        <tbody class="container">
        <tr v-for="index in (fin-debut)*60/ecart" :key="index">
          <th v-if="(index-1)%(60/ecart)===0" class="time"><span>{{ afficheHeure(index - 1) }}</span></th>
          <th v-else></th>
          <td v-for="jour in 5" :key="jour" :class="['jour-'+jour ,'heure-'+index]">
              <drop @drop="placeCours" class="places relative" :accepts-data="(d) => verifPlacement(d, jour, index)">
                <template v-for="creneau in places">
                  <drag v-if="heureToCreneau(creneau.date).posLeft===jour && heureToCreneau(creneau.date).posTop===index" :key="creneau.id" class="chip" :data="creneau">
                    <transition name="glisse">
                    <div :class="getCoursClass(creneau)"
                         :style="{'background': creneau.ec.color, 'height': calcHauteur(creneau.duree),   }"
                         @click="showPlaces(creneau)">
                      <template v-if="creneau.ec['@id']!== $store.state.idProjetTut">
                      <p class="titre">{{ creneau.ec.type.nom }} - {{ creneau.ec.nom }}</p>
                      <p>{{ creneau.ec.promo.nom }}</p>
                      <p><span v-if="creneau.prof">{{ creneau.prof.nomComplet }}</span> - {{ creneau.salle }}</p>
                      <p>{{ creneau.remarque }}</p>
                      </template>
                      <template v-else>
                        <p class="titre">{{ creneau.ec.nom }}</p>
                        <p>{{ creneau.remarque }}</p>
                      </template>
                    </div>
                    </transition>
                  </drag>
                </template>
              </drop>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
    </div>
    <cours :dialog="dialogCours" :edited-cours="editedCours" @save="saveCours" @close="close"></cours>
    <projet-tut :dialog="dialogProjetTut" :projet-tut="editedCours" @save="saveCours" @close="close"></projet-tut>
  </v-app>
</template>

<script>

import {Drag, Drop, DropList} from "vue-easy-dnd"
import ApiSf from "../api/apiSf";
import moment from 'moment'
import Cours from "./Cours";
import ProjetTut from "./ProjetTut";
import html2canvas from 'html2canvas'
import { jsPDF } from "jspdf"
moment.locale('fr')

export default {
  name: "EDT",
  components: {
    Drag,
    DropList,
    Drop,
    Cours,
    ProjetTut
  },
  data() {
    return {
      ecart: 15,
      dialogCours: false,
      dialogProjetTut: false,
      paramSemaine: parseInt(this.$route.params.semaine),
      numSemaine: this.getNumSemaine(),
      debut: 8,
      fin: 20,
      editedCours: {
      },
      defaultCours: {
      },
      editedIndex: -1,
      editCours: false,
    }
  },
  created() {
    this.$store.state.annee=parseInt(this.$route.params.annee)
    this.callApi()
  },
  computed: {
    connecte() {
      return this.$store.state.connexion.connecte
    },
    numSemString() {
      let num = this.numSemaine
      if (num < 10) {
        num = '0'+this.numSemaine
      }
      return 's' + num
    },
    annee() {
      if (this.numSemaine > 30) {
        return this.$store.state.annee
      } else {
        return this.$store.state.annee + 1
      }
    },
    overlay() {
      return this.$store.state.overlay
    },
    places() {
      return this.$store.state.cours.filter(c => c.semaine === this.numSemString && c.place)
    },
    cours() {
      return this.$store.state.cours.filter(c => c.semaine === this.numSemString && !c.place).sort(this.compareCours)
    },
  },
  methods: {
    exportPdf() {
      html2canvas(document.querySelector('#capture')).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'px', 'a4', true)
        const imgProps= pdf.getImageProperties(imgData)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0,pdfWidth, pdfHeight,'','FAST')
        pdf.save("edt"+this.numSemString+".pdf")
      })
    },
    retourLigne(ec, ancienEc) {
      return ec !== ancienEc
    },
    newProjetTut() {
      this.dialogProjetTut = true
    },
    compareCours(a,b) {
      if (a.ec === undefined || b.ec === undefined)
        return 0
      if (a.ec.nom < b.ec.nom)
        return -1
      if (a.ec.nom > b.ec.nom)
        return 1
      if (a.ec.type.nom < b.ec.type.nom)
        return -1
      if (a.ec.type.nom > b.ec.type.nom)
        return 1
      if (a.groupe < b.groupe)
        return -1
      if (a.groupe > b.groupe)
        return 1
      return 0
    },
    callApi() {
      this.$store.state.overlay = true
      ApiSf().get('ecs?annee='+parseInt(this.$route.params.annee)+'&nom=Projets Tut')
          .then(response => response.data)
          .then(q => {
            this.$store.state.idProjetTut=q['hydra:member'][0]['@id']
          })
      ApiSf().get('cours?semaine='+this.numSemString+'&ec.annee='+this.$route.params.annee)
          .then(response => response.data)
          .then(q => {
            this.$store.commit("setDataCours", q)
          })
          .then(this.$store.state.overlay = false)
    },
    creneauToHeure(c, jour) {
      let heure = parseInt(8 + (c-1)/(4/(this.ecart/15)))
      let min = this.ecart * ((c - 1) % (4/(this.ecart/15)))
      return moment(this.numSemaine+' '+this.annee+' '+heure+' '+min,'ww gggg hh mm').add({ 'd': jour-1}).format()
    },
    heureToCreneau(h) {
      let posTop = (moment(h).hour()-8)*(4/(this.ecart/15)) + (moment(h).minute()/this.ecart + 1)
      let posLeft = (moment(h).day())
      return {'posTop':posTop, 'posLeft': posLeft }
    },
    showCours(cours) {
      this.editCours = true
      this.show(cours)
    },
    showPlaces(cours) {
      this.editCours = false
      this.show(cours)
    },
    show(cours) {
      console.log(cours)
      if (this.editCours) {
        this.editedIndex = this.cours.indexOf(cours)
        this.editedCours = Object.assign({}, cours)
      } else {
        this.editedIndex = this.places.indexOf(cours)
        this.editedCours = Object.assign({}, cours)
      }
      if (this.editedCours.id === undefined || this.editedCours.ec['@id'] === this.$store.state.idProjetTut) {
        this.dialogProjetTut = true
      } else {
        this.dialogCours = true
      }
    },
    saveCours() {
      if (this.editedCours.id !== undefined) {
        // if (typeof this.editedCours.remarque === 'object')
        //   this.editedCours.remarque = this.editedCours.remarque.nom
        // TODO: Remplacer enseignant par cours.prof.nomComplet !!!!
        if (this.editCours) {
          this.$set(this.cours[this.editedIndex], 'enseignant', this.editedCours.enseignant)
          Object.assign(this.cours[this.editedIndex], this.editedCours)
        } else {
          this.$set(this.places[this.editedIndex], 'enseignant', this.editedCours.enseignant)
          Object.assign(this.places[this.editedIndex], this.editedCours)
        }
      } else {
        console.log("projet tut")
        this.editedCours.ec = this.$store.state.idProjetTut
        this.editedCours.duree = parseFloat(this.editedCours.duree)
        this.editedCours.semaine = this.numSemString
        this.editedCours.place = false
        //this.editedCours.remarque = this.editedCours.remarque.nom
        this.editedCours.groupe = 1
        this.editedCours.id = this.$store.state.cours.length -1
        //this.cours.push(this.editedCours)
        //this.$set(this.cours[this.cours.length -1], 'enseignant', '')
        // if (this.editedCours.remarque === 'DFS' || this.editedCours.remarque === 'AP')
        //   this.editedCours.groupe = 3
      }
      this.$store.dispatch('updateCoursApiAction', {
        cours: this.editedCours
      })
      this.editedCours.ec = {nom: 'Projet Tut', color: '#999', type: { nom: ''}, promo: {nom: ''}}
      this.close()
    },
    close() {
      this.$nextTick(() => {
        this.editedCours = Object.assign({}, this.defaultCours)
        this.editedIndex = -1
      })
      this.dialogCours = false
      this.dialogProjetTut = false
    },
    verifPlacement(cours, jour, index) {
      if (!this.$store.state.placement) {
        return true
      } else {
        // TODO: reste à gérer les cas des TDs des CMs spécifiques...
        let possible = false
        const coursPositionne = this.places.filter((p) =>
            p.id !== cours.id
            // TODO: remplacer posLeft et posTop par la fonction heureToCreneau
            && this.heureToCreneau(p.date).posLeft === jour
            && index > this.heureToCreneau(p.date).posTop - (cours.duree * (60 / this.ecart))
            && index < this.heureToCreneau(p.date).posTop + (p.duree * (60 / this.ecart))
            && (
                p.groupe === cours.groupe
                || (p.ec.type.nom === 'CM' && p.ec.promo.nom === 'Tous')
                || (cours.ec.type.nom === 'CM' && cours.ec.promo.nom === 'Tous')
                || (p.ec.type.nom === 'TD' && parseInt(p.groupe) + 1 === parseInt(cours.groupe))
                || (p.ec.type.nom === 'CM' && parseInt(p.groupe) + 1 === parseInt(cours.groupe))
                || (cours.ec.type.nom === 'CM' && parseInt(cours.groupe) + 1 === parseInt(p.groupe))
            )
        )
        possible = coursPositionne.length === 0
        return possible
      }
    },
    getCoursClass(cours) {
      let tabClass = ['creneau']
      if (cours.ec.type.nom === 'CM' || cours.ec.type.nom === 'Autre' || cours.ec.nom === 'Projet Tut') {
        if (cours.ec.promo.nom === 'Tous' || cours.ec.nom === 'Projet Tut') {
          tabClass.push('cm')
        } else {
          tabClass.push('cmdemi')
        }
      } else if (cours.ec.type.nom === 'TD') {
        tabClass.push('cmdemi')
      } else {
        tabClass.push('matiere')
      }
      if (cours.ec.type.nom === 'TD') {
        tabClass.push('groupe'+cours.groupe + 'td')
      } else {
        tabClass.push('groupe'+cours.groupe)
      }
      if (cours.ec.nom === 'Projet Tut') {
        tabClass.push('arriere')
      }
      return tabClass
    },
    getNumSemaine() {
      if (Number.isInteger(parseInt(this.$route.params.semaine))) {
        return parseInt(this.$route.params.semaine)
      } else {
        return moment().week()
      }
    },
    getDay(inc) {
      return moment(this.numSemaine+' '+this.annee,'ww gggg').add({ 'd': inc-1}).format('dddd D MMMM')
    },
    prevWeek() {
      if (this.numSemaine === 1)
        this.numSemaine = 52
      else
        this.numSemaine--
      this.$router.push({name: 'edt', params: {semaine: this.numSemaine}})
      this.callApi()
    },
    nextWeek() {
      if (this.numSemaine === 52)
        this.numSemaine = 1
      else
        this.numSemaine++
      this.$router.push({name: 'edt', params: {semaine: this.numSemaine}})
      this.callApi()
    },
    calcHauteur(duree) {
      let haut = 17 * duree * 60 / this.ecart
      return haut + 'px'
    },
    placeCours(c) {
      this.$store.state.overlay = true
      let posLeft = parseInt(c.top.$el.parentNode.classList[0].split('-')[1])
      let posTop = parseInt(c.top.$el.parentNode.classList[1].split('-')[1])
      const coursPresent=this.isPresent(c.id,c.data.groupe,posTop,posLeft)
      if(coursPresent) {
        coursPresent.date=c.data.date
      }
      c.data.date=this.creneauToHeure(posTop, posLeft)
      this.$nextTick(() => {
        this.$store.dispatch('updateCoursAction', {
          cours: c.data,
          place: true
        })
        this.$store.dispatch('updateCoursApiAction', {
          cours: c.data
        })
        if (coursPresent) {
          this.$store.dispatch('updateCoursApiAction', {
            cours: coursPresent
          })
        }
      })
    },
    isPresent(id, groupe, top, left) {
      const tabCours =  this.places.filter(c=> c.groupe===groupe && c.date === this.creneauToHeure(top,left) && c.id !== id )
      if (tabCours.length === 0)
        return false
      else
        return tabCours[0]
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
  },
  watch: {
    $route(to) {
      this.numSemaine=to.params.semaine
      this.callApi()
    }
  }
}
</script>

<style scoped>

.v-toolbar {
  flex: 0;
}

.a-la-ligne {
  flex-basis: 100%;
  height: 0;
}

.drop-forbidden {
  background-color: rgba(255, 0, 0, 0.3);
}

.glisse-enter-active, .glisse-leave-active {
  transition: opacity 3s;
}

.glisse-enter, .glisse-leave-to {
  opacity: 0;
}

.prev, .next {
  font-size: 36px;
  position: relative;
  top: 5px;
  padding: 10px;
}

.creneau {
  margin: 0;
  padding: 0;
  font-size: 0.75rem;
  z-index: 10;
}

.creneau p {
  margin: 0.1rem;
  padding: 0;

}

canvas {
  display:none;
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
  margin: 0.5rem;
}

.chip span {
  padding-left: 5px;
  padding-right: 5px;
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

.groupe3, .groupe3td {
  border: thin solid aqua;
  left: 50%;
}

.groupe4 {
  left: 75%;
  border: thin solid blueviolet;
}

.arriere {
  z-index: 1;
}

.titre {
  font-weight: bolder;
}
</style>
