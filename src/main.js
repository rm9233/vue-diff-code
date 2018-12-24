// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {Button, Input, Option, Select, Tabs, TabPane, Split, Table, Icon, Modal} from 'iview'
import KInput from './common/KInput';
import 'iview/dist/styles/iview.css'

Vue.component('KInput',KInput)
Vue.component('Button', Button)
Vue.component('Input', Input)
Vue.component('Option', Option)
Vue.component('Select', Select)
Vue.component('Tabs', Tabs)
Vue.component('TabPane', TabPane)
Vue.component('Split', Split)
Vue.component('Table', Table)
Vue.component('Icon', Icon)
Vue.component('Modal',Modal)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
