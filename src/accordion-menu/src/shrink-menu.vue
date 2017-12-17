<template>
    <div class="shrink-menu-wrapper">
        <ul class="top-wrapper">
            <li v-for="(menu, $index) in localSource" 
                :key="menu.id" 
                :class="{ 'first-item': $index === 0, 'on-active': menu.onActive }" 
                @click="handleMenuClick(menu)" 
                @mouseenter="handleHover(menu)" 
                @mouseleave="handleHoverOff(menu)">

                <i class="menu-icon iconfont" :class="menu.icon"></i>
                <shrink-sub-menu :source="menu" 
                                 v-if="menu.onHover"   
                                 @menu-click="handleSubMenuClick" 
                                 @mouseover="handleHover(menu)" 
                                 @mouseout="handleHoverOff(menu)" />
            </li>
        </ul>
    </div>
</template>

<script>
    import ShrinkSubMenu from './shrink-sub-menu.vue';

    export default {
        name: 'shrink-menu',
        components: { ShrinkSubMenu },
        props: ['source'],
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
            handleMenuClick(node) {
                if (node.children.length > 0) {
                    return;
                }
                this.$emit('menu-click', node);
            },
            handleSubMenuClick(node) {
                this.$emit('menu-click', node);
            },
            handleHover(node) {
                node.onHover = true;
            },
            handleHoverOff(node) {
                node.onHover = false;
            },
        },
    };
</script>