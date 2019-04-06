import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home/Home.vue'
import Index from './views/Home/Index.vue'
import User from './views/Home/User.vue'

import About from './views/About.vue'
import List from './views/List.vue'
import Content from './views/Content.vue'

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
            component: About
        },
        {
            path: '/list',
            component: List
        },
        {
            path: '/content',
            component: Content
        },
    ]
})
