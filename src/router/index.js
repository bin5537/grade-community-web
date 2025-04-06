import {
    createRouter,
    createWebHistory
} from 'vue-router'

import HomeView from '../views/HomeView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/LoginPage',
        name: 'LoginPage',
        component: () => import('../views/LoginPage.vue')
    },
    {
        path: '/SignUpPage',
        name: 'SignUpPage',
        component: () => import('../views/SignUpPage.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
