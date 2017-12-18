<template>
  <div id="app">
    <accordion-menu :source="source" @menu-click="onMenuClick" :activeMenu="defaultMenu" />
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
      return {
          source: [
              {
                  id: 'beijing',
                  text: '北京',
                  icon: 'icon-city',
                  children: [
                      {
                          id: 'dongcheng',
                          text: '东城区',
                          children: []
                      },
                      {
                          id: 'xicheng',
                          text: '西城区',
                          children: []
                      },
                      {
                          id: 'chaoyang',
                          text: '朝阳区',
                          children: []
                      },
                      {
                          id: 'fengtai',
                          text: '丰台区',
                          children: []
                      },
                      {
                          id: 'shijingshan',
                          text: '石景山区',
                          children: []
                      }
                  ]
              },
              {
                  id: 'shanghai',
                  text: '上海',
                  icon: 'icon-city2',
                  children: [
                      {
                          id: 'huangpu',
                          text: '黄浦区',
                          children: []
                      },
                      {
                          id: 'xuhui',
                          text: '徐汇区',
                          children: []
                      },
                      {
                          id: 'changning',
                          text: '长宁区',
                          children: []
                      },
                      {
                          id: 'jingan',
                          text: '静安区',
                          children: []
                      },
                      {
                          id: 'putuo',
                          text: '普陀区',
                          children: []
                      },
                      {
                          id: 'hongkou',
                          text: '虹口区',
                          children: []
                      }
                  ]
              },
              {
                  id: 'tianjin',
                  text: '天津',
                  icon: 'icon-city3',
                  children: [
                      {
                          id: 'nankai',
                          text: '南开区',
                          children: []
                      },
                      {
                          id: 'heping',
                          text: '和平区',
                          children: []
                      },
                      {
                          id: 'wuqing',
                          text: '武清区',
                          children: []
                      },
                      {
                          id: 'jinnan',
                          text: '津南区',
                          children: []
                      }
                  ]
              },
              {
                  id: 'chongqing',
                  text: '重庆',
                  icon: 'icon-city5',
                  children: [
                      {
                          id: 'yuzhong',
                          text: '渝中区',
                          children: []
                      },
                      {
                          id: 'dadukou',
                          text: '大渡口区',
                          children: []
                      },
                      {
                          id: 'jiangbei',
                          text: '江北区',
                          children: []
                      },
                      {
                          id: 'shapingba',
                          text: '沙坪坝区',
                          children: []
                      },{
                          id: 'jiulongpo',
                          text: '九龙坡区',
                          children: []
                      }
                  ]
              }
          ],
          defaultMenu: 'shapingba'
      }
  },
  methods: {
      onMenuClick(node) {
          console.log('on menu click', node);
      }
  },
  mounted() {
      setTimeout(() => {
          this.defaultMenu = 'jingan'
      }, 2000);
  }
}
</script>

<style lang="scss">
html, body {
    margin: 0;
    height: 100%;
}

#app {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

</style>
