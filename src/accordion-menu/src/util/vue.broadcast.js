/* eslint no-shadow: 0 */
/* eslint no-underscore-dangle: 0 */
function broadcast(componentName, eventName, params) {
    function _broadcast(componentName, eventName, params) {
        this.$children.forEach(child => {
            const name = child.$options.name;
            if (name === componentName) {
                child.$emit(...[eventName].concat([params]));
            }
            broadcast.apply(child, [componentName, eventName].concat([params]));
        });
    }
    _broadcast.call(this, componentName, eventName, params);
}

export default {
    install(Vue) {
        Vue.prototype.$broadcast = broadcast;
    },
};
