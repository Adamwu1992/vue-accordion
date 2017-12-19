<template>
    <div class="shrink-menu-wrapper">
        <ul class="top-wrapper">
            <li v-for="(menu, $index) in localSource" 
                :key="menu.id" 
                :class="{ 'first-item': $index === 0, 'on-active': menu.onActive }" 
                @click="handleMenuClick(menu)" 
                @mouseenter="handleHover(menu)" 
                @mouseleave="handleHoverOff(menu)">

                <i class="menu-icon iconfont" :class="menu.iconClass || (menu.level > 0 && 'icon-default')">
                    <!-- 常态图标 -->
                    <img v-if="menu.iconUrl" 
                         v-show="!menu.onActive && !menu.onHover" 
                         :src="menu.iconUrl" />
                    <!-- 激活态图标 -->
                    <img v-if="menu.activeIconUrl" 
                         v-show="menu.onActive" 
                         :src="menu.activeIconUrl" />
                    <!-- 悬停态图标 -->
                    <img v-if="menu.hoverIconUrl || menu.iconUrl" 
                         v-show="!menu.onActive && menu.onHover" 
                         :src="menu.hoverIconUrl || menu.iconUrl" />
                </i>

                <shrink-sub-menu :source="menu" 
                                 v-show="menu.onHover"   
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
                        return Object.assign({
                            onActive: false,
                            onHover: false
                        }, item)
                    });
                },
            },
        },
        methods: {
            handleMenuClick(node) {
                console.log('asdasdasd', node);
                if (node.children.length > 0) {
                    return;
                }
                console.log('lllll');
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