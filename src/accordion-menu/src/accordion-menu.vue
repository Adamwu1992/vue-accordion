<template>
    <div class="accordtion-menu-wrapper" :class="className">
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
            className: {
                type: [String, Array]
            }
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
             * 响应菜单数据变化
             */
            source: {
                immediate: true,
                handler(val) {
                    if (!val && val.length === 0) {
                        this.localSource = [];
                        return;
                    }
                    this.localSource = this.deepCopy(val);
                    if (!this.activeMenu) {
                        this.activeDefaultMenu();
                    }
                }
            },
            /**
             * 从外部打开指定菜单
             */
            activeMenu: {
                immediate: true,
                handler(val) {
                    // 如果没有外部指定激活菜单，默认激活第一个菜单
                    if (!val) {
                        if (this.localSource && this.localSource.length > 0) {
                            this.activeDefaultMenu();
                        }
                        return
                    };
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

                const nodeIncludes = node => targetNodes.some(t => t.id === node.id);

                let activeMenu = null;
                const newTreeNodes = this.deepCopy(this.localSource, node => {
                    if (nodeIncludes(node)) {
                        node.onActive = true;
                        node.onExpand = true;
                        activeMenu = node;
                    } else {
                        node.onActive = false;
                    }
                });
                this.localSource = newTreeNodes;
                // 通知外部引用者菜单被点击
                this.$emit('menu-click', activeMenu);
            },
            /**
             * 菜单展开或关闭
             */
            handleMenuToggle(target) {
                const newTreeNodes = this.deepCopy(this.localSource, node => {
                    if (node.id === target.id) {
                        node.onExpand = !target.onExpand;
                    }
                });
                this.localSource = newTreeNodes;
            },
            /**
             * 深拷贝数据源
             */
            deepCopy(tree, callback) {
                if (typeof callback === 'function') {
                    callback = {
                        enter: callback
                    }
                }
                /* eslint no-underscore-dangle: 0 */
                const res = [];
                const map = {};
                let targetPointer = null;
                traverse(tree, {
                    enter(node) {
                        const _node = { ...node, children: [] };
                        if (callback && typeof callback.enter === 'function') {
                            callback.enter(_node);
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
                        if (callback && typeof callback.exit === 'function') {
                            callback.exit();
                        }
                    },
                });
                return res;
            },
            /**
             * 找出节点所有的父节点
             */
            findParentChain(target) {
                if (!target || !this.localSource) return [];
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
             * 默认激活菜单第一项
             */
            activeDefaultMenu() {
                let firstMenuFinded = false;
                let activeMenu = null;
                const tree = this.deepCopy(this.localSource, {
                    enter(node) {
                        if (!firstMenuFinded) {
                            node.onActive = true;
                            node.onExpand = true;
                            activeMenu = node;
                        }
                    },
                    exit() {
                        firstMenuFinded = true;
                    }
                })
                this.localSource = tree;
                // 通知外部引用者菜单被点击
                this.$emit('menu-click', activeMenu);
            }
            
        },
    };
</script>
