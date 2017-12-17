<template>
    <div class="shrink-sub-menu-wrapper">
        <ul>
            <li class="first-item main-item" 
                :class="{'on-active': localSource.onActive }" 
                @click.stop="handleMenuClick">
                <span>{{localSource.text}}</span>
            </li>
            
            <li v-for="node in localSource.children" 
                :key="node.id" class="sub-item" 
                :class="{'on-active': node.onActive}" 
                @click.stop="handleSubMenuClick(node)">

                <i class="icon-default"></i>
                <span>{{node.text}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'shrink-sub-menu',
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
                this.localSource = source;
            },
        },
    },
    methods: {
        handleMenuClick() {
            // 如果有子菜单，不激活
            if (this.localSource.children.length > 0) {
                return;
            }
            this.$emit('menu-click', this.localSource);
        },
        handleSubMenuClick(node) {
            // this.$emit('menu-click', [this.localSource, node]);
            this.$emit('menu-click', node);
        },
    },
};
</script>

