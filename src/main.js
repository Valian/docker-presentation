// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import Eagle from 'eagle.js'
import 'animate.css'
import 'eagle.js/dist/eagle.css'
import 'eagle.js/dist/themes/gourmet/gourmet.css'
import 'eagle.js/dist/themes/agrume/agrume.css'
import VueHighlightJS from 'vue-highlight.js'
import 'highlight.js/styles/github.css'

import router from './router'

Vue.use(Eagle)
Vue.use(VueHighlightJS)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
