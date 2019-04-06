import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home/Home.vue'
import Index from './views/Home/Index.vue'
import User from './views/Home/User.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component: Home,
            redirect: '/index',
            children:[
                {
                    path: '/index',
                    component: Index
                },
                {
                    path: '/user',
                    component: User
                }
            ]
        },

        {
            path: '/about',
            component: () => import('./views/About.vue')
        },
        {
            path: '/list',
            component: () => import('./views/List.vue')
        },
        {
            path: '/content',
            component: () => import('./views/Content.vue')
        },
    ]
})
