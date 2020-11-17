import Vue from 'vue'
import Vuex from 'vuex'
import ApiSf from "../api/apiSf";

ApiSf()

const MAJ = store => {
    // subscribe est appelé quand le store est modifié...
    store.subscribe((mutation, state) => {
        sessionStorage.setItem('store', JSON.stringify(state.connexion));
    })
}

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        headers: [],
        ecs: [],
        promo: [],
        types: [],
        cours: [],
        copieCours: [],
        ecModifie: null,
        coursAPost: [],
        connexion: {
            connecte: false,
            login: '',
        },
        loading: true,
    },
    plugins: [
        MAJ
    ],
    mutations: {
        initialiseStore(state) {
            if(sessionStorage.getItem('store') && sessionStorage.getItem('token')) {
                Object.assign(state.connexion, JSON.parse(sessionStorage.getItem('store')))
            }
        },
        connect(state,login) {
            state.connexion.connecte=true
            state.connexion.login=login
        },
        updateEcs: (state, data) => {
            const {ec, semaine, nbHeures} = data
            // converti semaines en objet si tableau vide : tableau par défaut pour le type json pour apiplatform
            if (ec.semaines.length === 0)
                ec.semaines = {}
            if (nbHeures === '')
                delete ec.semaines[semaine]
            else
                ec.semaines[semaine] = nbHeures
        },
        updateEcsApi: (state, data) => {
            const ec = {...data}
            ec.promo=ec.promo['@id']
            ec.type=ec.type['@id']
            ec.vol = parseFloat(ec.vol)
            ec.duree = parseFloat(ec.duree)
            ec.nbGroupes = parseInt(ec.nbGroupes)
            ApiSf().put('ecs/' + ec.id, ec).then(() => {
                // on affiche le snack pour dire sauvegarde en cours
                console.log('axios put ec')
            }).then(() => {
                // on supprime le snack
            }).catch(error => {
                console.log(error)
            })
        },
        updateCoursApi: (state, data) => {
            const cours = {...data.cours}
            cours.ec =cours.ec['@id']
            cours.groupe = parseInt(cours.groupe)
            ApiSf().put('cours/' + cours.id, cours).then(() => {
                // on affiche le snack pour dire sauvegarde en cours
                console.log('axios put cours')
            }).then(() => {
                // on supprime le snack
            }).catch(error => {
                console.log(error)
            })
        },
        createEcsApi: (state, data) => {
            const ec = {...data}
            ec.promo=ec.promo['@id']
            ec.type=ec.type['@id']
            ec.vol = parseFloat(ec.vol)
            ec.duree = parseFloat(ec.duree)
            ec.nbGroupes = parseInt(ec.nbGroupes)
            ApiSf().post('ecs', ec).then((reponse) => {
                // on affiche le snack pour dire sauvegarde en cours
                console.log('axios post ec '+ reponse.data.id)
                data.id = reponse.data.id
            }).then(() => {
                // on supprime le snack
            }).catch(error => {
                console.log(error)
            })
        },
        createCoursApi: (state, data) => {
            const cours = {...data}
            cours.ec =state.ecModifie.ec['@id'] ? state.ecModifie.ec['@id'] : '/api/ecs/'+state.ecModifie.ec.id
            cours.groupe = parseInt(cours.groupe)
            ApiSf().post('cours', cours).then((reponse) => {
                // on affiche le snack pour dire sauvegarde en cours
                console.log('axios post cours')
                const indice = state.cours.findIndex(c => c.id === cours.id)
                state.cours[indice].id = reponse.data.id
            }).then(() => {
                // on supprime le snack
            }).catch(error => {
                console.log(error)
            })

        },
        updateCours: (state, data) => {
            const cours = data.cours
            const indice = state.cours.findIndex(c => c.id === cours.id)
            state.cours[indice].place = data.place
        },
        saveCours: (state, data) => {
            state.copieCours = [...state.cours]
            state.ecModifie = data
        },
        setDataHeaders(state, data) {
            state.headers = data['hydra:member']
        },
        setDataEcs(state, data) {
            state.ecs = data['hydra:member']
            state.loading = false
        },
        setDataTypes(state, data) {
            state.types = data['hydra:member']
        },
        setDataPromo(state, data) {
            state.promo = data['hydra:member']
        },
        setDataCours(state, data) {
            state.cours = data['hydra:member']
        },
        modificationCours(state, {data, getters}) {
            state.cours = getters.modifsCours(data)
            //console.log(state.cours)
        },
        // state et API
        suppCoursAll(state, getters) {
            const coursASuprrimer = getters.coursTousByEcId(state.ecModifie)
            coursASuprrimer.forEach((c)=>{
                console.log("on supprime le cours "+ c.name)
                ApiSf().delete('cours/'+ c.id).then(() => {
                    // on affiche le snack pour dire sauvegarde en cours
                    console.log('axios delete cours')
                    state.cours = state.cours.filter((item) => {
                        return item.id !== c.id
                    })
                }).then(() => {
                    // on supprime le snack
                }).catch(error => {
                    console.log(error)
                })
            })
        }
    },
    actions: {
        initialiseStoreAction(context) {
          context.commit('initialiseStore')
        },
        createEcsApiAction(context, data) {
            context.commit('createEcsApi', data)
        },
        updateEcsAction({state, commit, getters}, data) {
            commit('saveCours', data)
            commit('suppCoursAll', getters)
            if (data.nbHeures !== -1) {
                commit('updateEcs', data)
            }
            commit('modificationCours', {data, getters})
            state.coursAPost.forEach(c => commit('createCoursApi', c))
            state.coursAPost = []
            commit('updateEcsApi', data.ec)

        },
        updateCoursAction(context, data) {
            context.commit('updateCours', data)
        },
        updateCoursApiAction(context, data) {
            context.commit('updateCoursApi', data)
        },
        saveEcsAction(context) {
            context.commit('saveEcs')
        },
        getDataAction(context) {
            ApiSf().get('headers')
                .then(response => response.data)
                .then(q => {
                    context.commit("setDataHeaders", q)
                })
            ApiSf().get('ecs')
                .then(response => response.data)
                .then(q => {
                    context.commit("setDataEcs", q)
                })
            ApiSf().get('type_cours')
                .then(response => response.data)
                .then(q => {
                    context.commit("setDataTypes", q)
                })
            ApiSf().get('promos')
                .then(response => response.data)
                .then(q => {
                    context.commit("setDataPromo", q)
                })
        },
    },
    getters: {
        modifsCours: (state, getters) => (ecModifie) => {
            //let ecs=state.ecs
            //getters
            let cours
            let nouveauxCours = []
            nouveauxCours = getters.coursTousSaufByEcId(ecModifie)
            //console.log(nouveauxCours)
            let nbHeures = ecModifie.nbHeures
            if (nbHeures > 0) {
                //console.log("nb heure reconnu")
                let ec = ecModifie.ec
                if (ec.nbGroupes) {
                    //console.log("nb groupe reconnu")
                    for (let i = 1; i <= ec.nbGroupes; i++) {
                        let nbCreneaux = nbHeures / ec.duree
                        //console.log("on passe pour les groupes")
                        for (let j = 1; j <= nbCreneaux; j++) {
                            //console.log("on passe pour les créneaux")
                            cours = {
                                ec: {
                                    id: ec.id,
                                    name: ec.name,
                                    color: ec.color,
                                    duree: ec.duree,
                                    promo: {
                                        id: ec.promo.id,
                                        nom: ec.promo.nom
                                    },
                                    type: {
                                        id: ec.type.id,
                                        nom: ec.type.nom
                                    },
                                },
                                semaine: ecModifie.semaine,
                                place: false,
                                posTop: 0,
                                posLeft: 0,
                            }
                            if (ec.promo.nom === 'DFS' || ec.promo.nom === 'AP') {
                                cours.groupe = i + 2
                            } else {
                                cours.groupe = i
                            }
                            if (ec.promo.nom === 'AP' && ec.type.nom === 'TD') {
                                cours.groupe = 3
                            }
                            nouveauxCours.push(cours)
                            //console.log("on ajoute le cours "+ cours.ec.name)
                            state.coursAPost.push(cours)
                        }
                    }
                }
            }
            return nouveauxCours
        },
        coursTousSaufByEcId: (state) => (ecModifie) => {
            // cours qui ne sont pas impactés par la modifcation du planning
            return state.copieCours.filter(c => c.ec.id !== ecModifie.ec.id || c.semaine !== ecModifie.semaine)
        },
        coursTousByEcId: (state) => (ecModifie) => {
            // cours qui sont impactés par la modifcation du planning
            return state.copieCours.filter(c => c.ec.id === ecModifie.ec.id && c.semaine === ecModifie.semaine)
        }
    },
    modules: {},
})
