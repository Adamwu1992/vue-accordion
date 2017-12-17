<template>
    <div class="expand-menu-wrapper">
        <ul :class="{'top-wrapper': isTopLevel}">
            <template v-for="node in localSource">
                <li :key="node.id" 
                    class="menu-item" 
                    :class="{
                        'sub-menu-item': node.level > 0,
                        'on-hover': node.onHover,
                        'on-active': node.onActive
                    }" 
                    @click="handleClick(node)"
                    @mouseover="handleHover(node)" 
                    @mouseout="handleHoverOff(node)">

                    <i class="menu-icon iconfont" :class="node.icon"></i>
                    <span class="menu-text">{{node.text}}</span>
                    <i class="menu-arrow" 
                       :class="{'arrow-up': !node.subMenuOff}" 
                       v-if="node.children.length > 0">
                       <i class="iconfont icon-arrow"></i>
                    </i>
                </li>
                
                <li class="sub-wrapper" 
                    :class="{off: node.subMenuOff}" 
                    :style="{height: `${node.children.length * 44}px`}"
                    v-if="node.children.length > 0" 
                    :key="`${node.id}_sub`">

                    <expand-menu :source="node.children" @menu-click="handleSubMenuClick" />
                </li>
            </template>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'expand-menu',
        props: {
            source: {
                type: Array,
                default() {
                    return [];
                },
            },
        },
        computed: {
            isTopLevel() {
                return this.source.length > 0 && this.source[0].level === 0;
            },
        },
        data() {
            return {
                localSource: [],
            };
        },
        watch: {
            source: {
                immediate: true,
                handler(source) {
                    this.localSource = source.map(item => {
                        if (item.onActive) {
                            return {
                                ...item,
                                onHover: false,
                                subMenuOff: false,
                            };
                        }
                        return {
                            ...item,
                            onActive: false,
                            onHover: false,
                            subMenuOff: false,
                        };
                    });
                },
            },
        },
        methods: {
            handleHover(node) {
                if (node) {
                    node.onHover = true;
                }
            },
            handleHoverOff(node) {
                if (node) {
                    node.onHover = false;
                }
            },
            handleClick(node) {
                if (node) {
                    node.subMenuOff = !node.subMenuOff;
                    if (node.children.length === 0) {
                        // this.$dispatch('accordion-menu', 'expand-menu-click', node);
                        this.$emit('menu-click', node);
                    }
                }
            },
            handleSubMenuClick(node) {
                this.$emit('menu-click', node);
            },
        },
        created() {
            this.$on('handle-expand-menu-click', nodes => {
                // 判断节点是否在集合中
                const nodeIncluded = (target, collection) =>
                    collection.some(node => node.id === target.id);
                this.localSource.forEach(source => {
                    if (nodeIncluded(source, nodes)) {
                        source.onActive = true;
                        source.subMenuOff = false;
                    } else {
                        source.onActive = false;
                    }
                });
            });
        },
    };
</script>

