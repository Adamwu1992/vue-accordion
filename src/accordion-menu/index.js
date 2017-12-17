import AccordionMenu from './src/accordion-menu.vue';
import EventBroadcast from './src/util/vue.broadcast.js';
import EventDispatch from './src/util/vue.dispatch.js';
import './src/style.scss';
import './src/font/iconfont.css';

AccordionMenu.install = Vue => {
    Vue.component(AccordionMenu.name, AccordionMenu);
    Vue.use(EventBroadcast);
    Vue.use(EventDispatch);
};

export default AccordionMenu;
