<template>
  <div class="home-container">
    <el-container>
      <el-header>
        <div>
          <img src="../assets/logo2.png">
          <span>administrator</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="controlFold" @click="toggleCollapse">|||</div>
          <el-menu
            :default-active="activePathFn"
            :unique-opened='true'
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            class="el-menu-vertical-demo"
            background-color="#000"
            text-color="#A8A8A8"
            active-text-color="#fff">
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
              <!-- 一级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconList[item.id]"></i>
                <!-- 字体 -->
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                 <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{ subItem.authName}}</span>
                  </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  created () {
    this.getMenuList()
  },
  data () {
    return {
      menuList: [],
      iconList: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  methods: {
    logout () {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) this.$message.error(res.meta.msg)
      this.menuList = res.data
      // console.log(res)
      // console.log(this.menuList)
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  },
  computed: {
　  activePathFn () {
　　　return this.$route.path
　　}
  }
}
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }
  .el-container {
    height: 100%;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #352B28;
    padding-left: 0;
    color: #FFF;
    > div {
      display: flex;
      align-items: center;
      img {
        width: 80px;
        height: 100%;
      }
      span {
        display: block;
        // padding-left: 1px;
        font-weight: 700;
        padding-right: 9px;
        background-color: #000;
        height: 60px;
        line-height: 60px;
      }
    }
  }
  .el-aside {
    background-color: #000000;
    .el-menu {
      border-right: none;
    }
    .controlFold {
      color: #FFF;
      font-size: 14px;
      line-height: 26px;
      background-color: #151413;
      letter-spacing: 0.2em;
      text-align: center;
      cursor: pointer;
    }
  }

  .el-menu-item.is-active {
    background-color: #282828 !important;
  }

  .iconfont {
    margin-right: 10px;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }
</style>
