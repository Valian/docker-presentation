import Vue from 'vue'
import Router from 'vue-router'

import Slideshow from './Slideshow'

Vue.use(Router)

const routes = [
  { path: '*', component: Slideshow }
]

export default new Router({
  mode: 'history',
  routes
})
