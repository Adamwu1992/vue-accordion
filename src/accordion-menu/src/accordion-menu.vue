<template>
    <div class="accordtion-menu-wrapper">
       <div class="accordion-body" :class="{expand: isWrapperExpand}">
            <transition name="fade" 
                        @before-enter="onBeforeEnter" 
                        @after-leave="onAfterLeave">
                <div class="accrodion-contents" v-show="expandMenu">
                    <expand-menu :source="localSource" 
                                 @menu-click="handleMenuClick" 
                                 @menu-toggle="handleMenuToggle" />
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
                expandMenu: true,
                // 是否展开图标菜单
                expandIconMenu: false,
                // 将外部数据源本地化
                localSource: null,
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
                    }
                },
            },
        },
        methods: {
            handleTriggerClick() {
                this.expandMenu = !this.expandMenu;
            },
            onBeforeEnter() {
                this.expandIconMenu = false;
            },
            onAfterLeave() {
                this.expandIconMenu = true;
            },
            /**
             * 深拷贝数据源
             */
            deepCopy(callback) {
                /* eslint no-underscore-dangle: 0 */
                const res = [];
                const map = {};
                let targetPointer = null;
                traverse(this.localSource || this.source, {
                    enter(node) {
                        const _node = { ...node, children: [] };
                        if (typeof callback === 'function') {
                            callback(_node);
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
                        const l = stack.length;
                        if (l > 0) {
                            targetPointer = map[stack[l - 1].id];
                        } else {
                            targetPointer = null;
                        }
                    },
                });
                return res;
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
             * 菜单点击
             */
            handleMenuClick(target) {
                // 被点击的菜单及其祖先节点
                let targetNodes;
                if (target instanceof Array) {
                    targetNodes = target;
                } else {
                    targetNodes = this.findParentChain(target);
                }

                const nodeIncludes = node => targetNodes.some(target => target.id === node.id);

                const newTreeNodes = this.deepCopy(node => {
                    if (nodeIncludes(node)) {
                        node.onActive = true;
                    } else {
                        node.onActive = false;
                    }
                });
                this.localSource = newTreeNodes;
                // 通知外部引用者菜单被点击
                this.$emit('menu-click', target);
            },
            /**
             * 菜单展开或关闭
             */
            handleMenuToggle(target) {
                const newTreeNodes = this.deepCopy(node => {
                    if (node.id === target.id) {
                        node.onExpand = !target.onExpand;
                    }
                });
                this.localSource = newTreeNodes;
            }
        },
        created() {
            this.localSource = this.deepCopy();
        },
    };
</script>
