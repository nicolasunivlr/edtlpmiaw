import ApiSf from "../api/apiSf";

const state = () => ({
    annee: 2020,
    overlay: false,
    headers: [],
    promo: [],
    type: [],
    cours: [],
    copieCours: [],
    coursAPost: [],
    connexion: {
        connecte: false,
        login: 'aaa',
    },
    loading: true,
    placement: false,
})

const mutations = {
    initialiseStore(state) {
        if(sessionStorage.getItem('store') && sessionStorage.getItem('token')) {
            Object.assign(state.connexion, JSON.parse(sessionStorage.getItem('store')))
        }
    },
    connect(state,login) {
        state.connexion.connecte=true
        state.connexion.login=login
    },
    updateCoursApi: (state, data) => {
        const cours = {...data.cours}
        if (cours.ec.nom === 'Projet Tut') {
            cours.ec = null
        } else {
            cours.ec = cours.ec['@id']
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
    createCoursApi: (state, data) => {
        let cours = {...data}
        if (state.ecModifie !== null) {
            cours.ec = state.ecModifie.ec['@id'] ? state.ecModifie.ec['@id'] : '/api/ecs/' + state.ecModifie.ec.id
            cours.groupe = parseInt(cours.groupe)
        }
        else {
            cours = cours.cours
        }
        ApiSf().post('cours', cours).then((reponse) => {
            console.log('axios post cours')
            const indice = state.cours.findIndex(c => c.id === cours.id)
            // on parcours les cours avec comme index l'id du cours
            state.cours[indice].id = reponse.data.id
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
    setDataType(state, data) {
        state.type = data['hydra:member']
    },
    setDataPromo(state, data) {
        state.promo = data['hydra:member']
    },
    setDataCours(state, data) {
        state.cours = data['hydra:member']
        state.cours=state.cours.map(c =>
            c.ec === undefined ? { ...c, ec: {nom: 'Projet Tut', color: '#ddd', type: { nom: ''}, promo: {nom: ''}} } : c
        )
        //console.log(state.cours)
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
}

const actions = {
    initialiseStoreAction(context) {
        context.commit('initialiseStore')
    },
    deleteCoursAction(context,data) {
        context.commit('deleteCours', data)
    },
    updateCoursAction(context, data) {
        context.commit('updateCours', data)
    },
    updateCoursApiAction(context, data) {
        //console.log(data)
        if (data.cours.ec === undefined)
            context.commit('createCoursApi', data)
        else
            context.commit('updateCoursApi', data)
    },
    getDataAction(context) {
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
        ApiSf().get('type_cours')
            .then(response => response.data)
            .then(q => {
                context.commit("setDataType", q)
            })
        ApiSf().get('promos')
            .then(response => response.data)
            .then(q => {
                context.commit("setDataPromo", q)
            })
    },
}

const getters = {
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
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}