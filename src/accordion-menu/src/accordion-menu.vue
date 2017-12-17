<template>
    <div class="accordtion-menu-wrapper">
       <div class="accordion-body" :class="{expand: isWrapperExpand}">
            <transition name="fade" 
                        @before-enter="onBeforeEnter" 
                        @after-leave="onAfterLeave">
                <div class="accrodion-contents" v-show="expandMenu">
                    <expand-menu :source="localSource" @menu-click="handleMenuClick" />
                </div>
            </transition>
            <div class="accrodion-icons" v-show="expandIconMenu">
                <shrink-menu :source="localSource" @menu-click="handleMenuClick"/>
            </div>
       </div>

        <div class="accordion-trigger-wrapper">
            <div class="accordion-trigger" 
                :class="{'is-shrink': !isWrapperExpand}" 
                @click="handleTriggerClick"></div>
        </div>
    </div>
</template>

<script>
    import ExpandMenu from './expand-menu.vue';
    import ShrinkMenu from './shrink-menu.vue';
    import traverse from './util/traverse.js';

    const deepCopy = (tree, targetNodes = []) => {
        /* eslint no-underscore-dangle: 0 */
        const res = [];
        const map = {};
        let targetPointer = null;
        const nodeIncludes = node => targetNodes.some(target => target.id === node.id);
        traverse(tree, {
            enter(node) {
                // console.log('enter\t', node.text);
                let _node;
                if (nodeIncludes(node)) {
                    _node = { ...node, onActive: true, children: [] };
                } else {
                    _node = { ...node, children: [] };
                }
                if (targetPointer === null) {
                    res.push(_node);
                    map[_node.id] = _node;
                    targetPointer = _node;
                } else {
                    targetPointer.children.push(_node);
                    map[_node.id] = _node;
                    targetPointer = _node;
                }
            },

            exit(node, stack) {
                // console.log('exit\t', node.text);
                const l = stack.length;
                if (l > 0) {
                    targetPointer = map[stack[l - 1].id];
                } else {
                    targetPointer = null;
                }
            },
        });
        return res;
    };

    export default {
        name: 'accordion-menu',
        components: {
            ExpandMenu,
            ShrinkMenu,
        },
        props: {
            source: {
                type: Array,
                default() {
                    return [];
                },
            },
            activeMenu: {
                type: [String, Object],
            },
        },
        data() {
            return {
                // 是否展开大菜单
                expandMenu: false,
                // 是否展开图标菜单
                expandIconMenu: true,
                // 将外部数据源本地化
                localSource: [],
            };
        },
        computed: {
            isWrapperExpand() {
                return this.expandMenu && !this.expandIconMenu;
            },
        },
        watch: {
            /**
             * 从外部打开指定菜单
             */
            activeMenu: {
                immediate: true,
                handler(val) {
                    console.log('in watch ', val);
                    const nodeShouldOnActive = this.findParentChain(this.activeMenu);
                    if (nodeShouldOnActive.length > 0) {
                        this.handleMenuClick(nodeShouldOnActive);
                        // this.$nextTick(() => this.$broadcast(
                        //     'expand-menu',
                        //     'handle-expand-menu-click',
                        //     nodeShouldOnActive));
                    }
                },
            },
        },
        methods: {
            handleTriggerClick() {
                console.log('click');
                this.expandMenu = !this.expandMenu;
            },
            onBeforeEnter() {
                console.log('before enter');
                this.expandIconMenu = false;
            },
            onAfterLeave() {
                console.log('after leave');
                this.expandIconMenu = true;
            },
            /**
             * 找出节点所有的父节点
             */
            findParentChain(target) {
                if (!target) return [];
                const targetId = typeof target === 'object' ? target.id : target;
                let parentChain = [];
                traverse(this.localSource, {
                    enter(node, stack) {
                        if (node.id === targetId) {
                            parentChain = stack.map(item => item);
                        }
                    },
                });
                return parentChain;
            },
            /**
             * 菜单节点被点击
             */
            handleMenuClick(node) {
                let nodes;
                if (node instanceof Array) {
                    nodes = node;
                } else {
                    nodes = this.findParentChain(node);
                }
                const newTreeNodes = deepCopy(this.source, nodes);
                this.localSource = newTreeNodes;
                this.$emit('menu-click', node);
            },
        },
        mounted() {
            // 监听子菜单点击事件
            this.$on('expand-menu-click', targetNode => {
                console.log('expand-menu-click', targetNode);
                this.$broadcast('expand-menu', 'handle-expand-menu-click', this.findParentChain(targetNode));
            });
        },
        created() {
            this.localSource = deepCopy(this.source);
        },
    };
</script>
