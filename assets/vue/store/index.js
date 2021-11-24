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
        annee: 2021,
        overlay: false,
        idProjetTut:'',
        headers: [],
        ecs: [],
        promo: [],
        type: [],
        cours: [],
        copieCours: [],
        enseignants: [],
        ecModifie: null,
        coursAPost: [],
        connexion: {
            connecte: false,
            login: '',
        },
        loading: true,
        placement: false,
        coursPlaces: [],
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
            ec.annee = parseInt(ec.annee)
            ApiSf().put('ecs/' + ec.id, ec).then(() => {
                console.log('axios put ec')
            }).then(() => {
                state.overlay = false
            }).catch(error => {
                console.log(error)
            })
        },
        updateCoursApi: (state, data) => {
            const cours = {...data.cours}
            if (cours.ec.nom === 'Projet Tut') {
                cours.ec = null
            } else {
                cours.ec = cours.ec['@id']
                cours.prof = cours.prof['@id']
            }
            cours.duree = parseFloat(cours.duree)
            cours.groupe = parseInt(cours.groupe)
            ApiSf().put('cours/' + cours.id, cours).then(() => {
                console.log('axios put cours')
            }).then(() => {
                state.overlay = false
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
            ec.annee = parseInt(ec.annee)
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
            let cours = {...data}
            if (state.ecModifie !== null) {
                cours.ec = state.ecModifie.ec['@id'] ? state.ecModifie.ec['@id'] : '/api/ecs/' + state.ecModifie.ec.id
                cours.groupe = parseInt(cours.groupe)
            }
            else {
                cours = cours.cours
                state.cours.push(cours)
            }
            ApiSf().post('cours', cours).then((reponse) => {
                console.log('axios post cours')
                const indice = state.cours.findIndex(c => c.id === cours.id)
                // on parcours les cours avec comme index l'id du cours.
                state.cours[indice] = reponse.data
            }).then(() => {
                // on supprime l'overlay
            }).catch(error => {
                console.log(error)
            })

        },
        deleteCours: (state, data) => {
            let cours = {...data.cours}
            state.cours = state.cours.filter( c => c.id !== cours.id )
            ApiSf().delete('cours/'+cours.id).then((reponse) => {
                console.log('axios delete cours')
            }).then(() => {
                // on supprime l'overlay
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
            state.ecs = data['hydra:member'].filter(ec => ec.nom !== "Projets Tut")
            const projetTut = data['hydra:member'].filter(ec => ec.nom === "Projets Tut")[0]
            state.idProjetTut = projetTut['@id']
            state.loading = false
        },
        setDataEnseignants(state, data) {
            state.enseignants = data['hydra:member']
        },
        setDataType(state, data) {
            state.type = data['hydra:member']
        },
        setDataPromo(state, data) {
            state.promo = data['hydra:member']
        },
        setDataCours(state, data) {
            state.cours = data['hydra:member']
            state.cours=state.cours.map(c =>
                c.ec === undefined ? { ...c, ec: {nom: 'Projet Tut', color: '#999', type: { nom: ''}, promo: {nom: ''}} } : c
            )
            //console.log(state.cours)
        },
        setCoursPlaces(state, data) {
            state.coursPlaces = data['hydra:member']
        },
        modificationCours(state, {data, getters}) {
            state.cours = getters.modifsCours(data)
        },
        // state et API
        suppCoursAll(state, getters) {
            const coursASuprrimer = getters.coursTousByEcId(state.ecModifie)
            coursASuprrimer.forEach((c)=>{
                console.log("on supprime le cours "+ c.ec.nom)
                ApiSf().delete('cours/'+ c.id).then(() => {
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
        },
        triEcs(state, data) {
            state.ecs.sort((a, b) => {
                let retour = 0
                if (a.nom < b.nom)
                    retour =  -1
                if (a.nom > b.nom)
                    retour = 1
                if (data.order)
                    return retour
                else return retour * -1

            })
        },
    },
    actions: {
        triEcsAction(context, data) {
          context.commit('triEcs', data)
        },
        initialiseStoreAction(context) {
          context.commit('initialiseStore')
        },
        createEcsApiAction(context, data) {
            context.commit('createEcsApi', data)
        },
        changeAnneeAction(context,annee) {
            context.state.annee = annee
            context.dispatch('getDataAction')
        },
        updateEcsAction({state, commit, getters}, data) {
            state.overlay = true
            commit('saveCours', data)
            // TODO: A tester : il ne faudrait pas supprimer les cours existants si on augmente les horaires.
            // c'est plus compliqué que cela car le fait de tout supprimer permet de recréer tout et pas seulement les cours en plus...
            // if (data.nbHeuresAncien > data.nbHeures) {
            commit('suppCoursAll', getters)
            console.log(0)
            //}
            if (data.nbHeures !== -1) {
                commit('updateEcs', data)
            }
            console.log(1)
            commit('modificationCours', {data, getters})
            console.log(2)
            state.coursAPost.forEach(c => commit('createCoursApi', c))
            console.log(3)
            state.coursAPost = []
            commit('updateEcsApi', data.ec)
            console.log(4)
            state.ecModifie = null
        },
        deleteCoursAction(context,data) {
            context.commit('deleteCours', data)
        },
        updateCoursAction(context, data) {
            context.commit('updateCours', data)
        },
        updateCoursApiAction(context, data) {
            if (data.cours.ec === context.state.idProjetTut) {
                context.commit('createCoursApi', data)
            } else {
                context.commit('updateCoursApi', data)
            }
        },
        saveEcsAction(context) {
            context.commit('saveEcs')
        },
        getCoursPlacesAction(context) {
            return ApiSf().get('cours?place='+1)
                .then(response => response.data)
                .then(response => {
                    context.commit("setCoursPlaces", response)
                })
        },
        getDataAction(context) {
            context.state.overlay = true
            ApiSf().get('headers')
                .then(response => response.data)
                .then(q => {
                    context.commit("setDataHeaders", q)
                })
                .catch(error => {
                    if (error.response.status === 401) {
                        sessionStorage.removeItem('token')
                        context.state.connexion.connecte = false
                    }
                })
            ApiSf().get('ecs?annee='+context.state.annee)
                .then(response => response.data)
                .then(q => {
                    context.commit("setDataEcs", q)
                })
            ApiSf().get('utilisateurs?cours.ec.annee='+context.state.annee)
                .then(response => response.data)
                .then(q => {
                    context.commit("setDataEnseignants", q)
                })
            ApiSf().get('type_cours')
                .then(response => response.data)
                .then(q => {
                    context.commit("setDataType", q)
                })
            return ApiSf().get('promos')
                .then(response => response.data)
                .then(q => {
                    context.commit("setDataPromo", q)
                    context.state.overlay = false
                })
        },
    },
    getters: {
        modifsCours: (state, getters) => (ecModifie) => {
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
                                    nom: ec.nom,
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
                                duree: ec.duree,
                                semaine: ecModifie.semaine,
                                place: false
                            }
                            if (ec.promo.nom === 'DFS' || ec.promo.nom === 'AP') {
                                cours.groupe = i + 2
                            } else {
                                cours.groupe = i
                            }
                            if (ec.promo.nom === 'AP' && ec.type.nom === 'TD') {
                                cours.groupe = 3
                            }
                            if (ec.promo.nom === 'DFS' && ec.type.nom === 'TD') {
                                cours.groupe = 3
                            }
                            nouveauxCours.push(cours)
                            //console.log("on ajoute le cours "+ cours.ec.nom)
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
        },
        // getNbHeuresEffectives: (state) => (ec, semaine) => {
        //     return 0
        // }
    },
    modules: {},
})
