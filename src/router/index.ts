import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Dijkstra from '@/views/Dijkstra.vue';
import DB from '@/views/DB.vue';
import Index from '@/views/Index.vue';


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index
        },
        {
            path: '/db',
            name: 'db',
            component: DB
        },
        {
            path: '/dijkstra',
            name: 'dijkstra',
            component: Dijkstra
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue')
        }
    ]
});

export default router;
