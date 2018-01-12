import Vue from 'vue'
import App from './App.vue'
// import Accordtion from './accordion-menu/index.js';
import Accordtion from './build/index.js';
import './assets/font/iconfont.css'

Vue.use(Accordtion);

const app = new Vue({
  el: '#app',
  render: h => h(App)
})

window.changeActiveMenu = name => {
    app.$emit('change-active-menu', name)
}
