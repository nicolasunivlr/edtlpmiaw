import ApiSf from "../api/apiSf";

const state = () => ({
    ecs: [],
    ecModifie: null,
})

const mutations = {
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
            console.log('axios put ec')
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
    setDataEcs(state, data) {
        state.ecs = data['hydra:member']
        state.loading = false
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
    }
}

const actions = {
    getDataEcsAction(context) {
        ApiSf().get('ecs')
            .then(response => response.data)
            .then(q => {
                context.context.commit("setDataEcs", q)
            })
    },
    triEcsAction(context, data) {
        context.commit('triEcs', data)
    },
    createEcsApiAction(context, data) {
        context.commit('createEcsApi', data)
    },
    updateEcsAction({state, commit, getters}, data) {
        state.overlay = true
        commit('saveCours', data)
        commit('suppCoursAll', getters)
        if (data.nbHeures !== -1) {
            commit('updateEcs', data)
        }
        commit('modificationCours', {data, getters})
        state.coursAPost.forEach(c => commit('createCoursApi', c))
        state.coursAPost = []
        commit('updateEcsApi', data.ec)
        state.ecModifie = null
    },
    saveEcsAction(context) {
        context.commit('saveEcs')
    },
}

export default {
    namespaced: true,
    state,
    // getters,
    actions,
    mutations
}