import Vue from 'vue'
import App from './App.vue'
import Accordtion from './accordion-menu/index.js';
import './assets/font/iconfont.css'

Vue.use(Accordtion);

new Vue({
  el: '#app',
  render: h => h(App)
})
