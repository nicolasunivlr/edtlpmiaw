import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Planning from '../components/Planning'
import  Login from '../components/Login'
import EDT from "../components/EDT";
import StatsEnseignants from "../components/StatsEnseignants";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        texte: 'Accueil',
        icon: 'mdi-home'
    },
    {
        path: "/login",
        name: "login",
        component: Login,
        texte: 'Connexion',
        icon: 'mdi-account'
    },
    {
        path: '/planning',
        name: 'planning',
        component: Planning,
        texte: 'Planning',
        icon: 'mdi-calendar-text'
    },
    {
        path: '/edt/:annee/:semaine?',
        name: 'edt',
        component: EDT,
        texte: 'EDT',
        icon: 'mdi-calendar-week',
        props: (route) => ({ semaine: route.params.semaine || NaN, annee: route.params.annee || NaN })
    },
    {
        path: '/enseignants',
        name: 'enseignants',
        component: StatsEnseignants,
        texte: 'Charge d\'enseignement',
        icon: 'mdi-clock-outline'
    },
    {
        path: '/aide',
        name: 'aide',
        texte: 'Aide',
        icon: 'mdi-help-circle',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Aide.vue')
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router

router.beforeEach((to, from, next) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login', '/about', '/'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = sessionStorage.getItem('token');

    if (authRequired && !loggedIn) {
        return next('/login');
    }
    next();
})
