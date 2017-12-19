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

                    <i class="menu-icon iconfont" :class="node.iconClass || (node.level > 0 && 'icon-default')">
                        <!-- 常态图标 -->
                        <img v-if="node.iconUrl" 
                             v-show="!node.onActive && !node.onHover" 
                             :src="node.iconUrl" />
                        <!-- 激活态图标 -->
                        <img v-if="node.activeIconUrl" 
                             v-show="node.onActive" 
                             :src="node.activeIconUrl" />
                        <!-- 悬停态图标 -->
                        <img v-if="node.hoverIconUrl || node.iconUrl" 
                             v-show="!node.onActive && node.onHover" 
                             :src="node.hoverIconUrl || node.iconUrl" />
                    </i>
                    <span class="menu-text">{{node.text}}</span>
                    <i class="menu-arrow" 
                       :class="{'arrow-up': node.onExpand}" 
                       v-if="node.children.length > 0">
                       <i class="iconfont icon-arrow"></i>
                    </i>
                </li>
                
                <li class="sub-wrapper" 
                    :class="{off: !node.onExpand}" 
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
                        return Object.assign({
                            onActive: false,
                            onHover: false,
                            onExpand: false
                        }, item)
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
                    if (node.children.length === 0) {
                        this.$emit('menu-click', node);
                    } else {
                        this.$emit('menu-toggle', node);
                    }
                }
            },
            handleSubMenuClick(node) {
                this.$emit('menu-click', node);
            },
        }
    };
</script>

