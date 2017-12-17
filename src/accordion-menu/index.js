import AccordionMenu from './src/accordion-menu.vue';
import './src/style.scss';
import './src/font/iconfont.css';

AccordionMenu.install = Vue => {
    Vue.component(AccordionMenu.name, AccordionMenu);
};

export default AccordionMenu;
