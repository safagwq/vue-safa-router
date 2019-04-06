import Vue from 'vue'
import App from './App.vue'
import router from './router'

import VueSafaRouter from 'vue-safa-router'
VueSafaRouter.use(router)


import HeaderTemp from './components/HeaderTemp.vue'
Vue.component('HeaderTemp',HeaderTemp)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
