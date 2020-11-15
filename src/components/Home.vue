<template>
  <el-container style="height: 100%; border: 1px solid #eee">
 
      <el-header style="text-align: right; font-size: 12px">
     
      <div class="left"> 
        <img src="../assets/aaa.jpg" alt="" width="50" height="50">
        <h1 class="title" style="display: inline-block; color: #fff; font-size: 20px ">后台管理系统</h1>
      </div>
      <el-button type="info" style="height: 10px" @click="quit"> 退出</el-button>
    </el-header>
    
  <el-container>
   
    <el-aside :width ="isflod ? '64px' : '200px'" >     
      <div class="flod" @click="flod" >|||</div>
      <el-menu
      :unique-opened="true"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#409bFF"
      :collapse = 'isflod'
      :collapse-transition = "false"  
      router
      :default-active="activePath"
      >
      <el-submenu :index="index+''" v-for="(item,index) in menulist" :key="index">
        <template slot="title">
          <i :class="icon[index]"></i>
          <span>{{item.authName}}</span>
        </template>
        <el-menu-item-group>
        
          <el-menu-item :index="'/'+subitem.path" v-for="(subitem,index) in item.children" :key="index" @click="saveNavState('/'+subitem.path)">
            <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subitem.authName}}</span>
        </template>
          </el-menu-item>
          
        </el-menu-item-group>
     
      </el-submenu>
     
    </el-menu></el-aside>
    <el-main>
   <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
 
    data() {
      
     return{
       menulist: [],
       icon: [
         'iconfont icon-user',
         'iconfont icon-tijikongjian',
         'iconfont icon-shangpin',
         'iconfont icon-danju',
         'iconfont icon-baobiao'
       ] ,
       isflod: false,
       activePath: ''
     }
    },
    created() {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
      quit() {
        window.sessionStorage.clear()
        this.$router.push({
          path:'/login'
        })
      },
      getMenuList() {
        this.$http.get('menus').then(res => {
          if(res.data.meta.status !== 200) {
            this.$message.error(res.data.meta.msg)
            console.log(res);
            return
          }
          this.menulist = res.data.data
          console.log(res);
        })
      },
      flod() {
        this.isflod = !this.isflod
        
      },
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath = activePath
      }
    }

}
</script>

<style lang="stylus" scoped>
 .el-header 
    background-color: #373d41;
    color: #333;
    line-height: 60px;
    display flex
    justify-content space-between
    align-items center

  .el-main 
    background #eaedf1
  .el-aside 
    color: #333;
    background #333744
    .flod
      background-color #4a5064
      height 30px
      text-align center
      line-height 30px
      letter-spacing 0.2em
      font-weight normal
      color #fff
    .el-menu
      border-right none
  
  .iconfont 
    margin-right 10px
  
</style>