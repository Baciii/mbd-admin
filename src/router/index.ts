import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    { path: '/', redirect: '/content/user' },
    {
        path: '/login',
        name: 'login',
        meta: {},
        component: () => import('../pages/Login/index.vue')
    },
    {
        path: '/content',
        name: 'content',
        meta: {},
        component: () => import('../pages/Content/index.vue'),
        children: [
            {
                path: 'user',
                name: 'user',
                meta: {},
                component: () => import('../pages/User/index.vue')
            },
            {
                path: 'post',
                name: 'post',
                meta: {},
                component: () => import('../pages/Post/index.vue')
            },
            {
                path: 'question',
                name: 'question',
                meta: {},
                component: () => import('../pages/Question/index.vue')
            },
            {
                path: 'interview',
                name: 'interview',
                meta: {},
                component: () => import('../pages/Interview/index.vue')
            },
            {
                path: 'article',
                name: 'article',
                meta: {},
                component: () => import('../pages/Article/index.vue')
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
