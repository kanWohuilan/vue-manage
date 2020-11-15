<template>
  <div>
     <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>

      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
         <el-table-column label="路径" prop="path"></el-table-column>
          <el-table-column label="权限等级" prop="level">
            <template #default ='scope'> 
                <el-tag v-if="scope.row.level === 0"></el-tag>
                <el-tag type="success" v-else-if="scope.row.level === 1"></el-tag>
                <el-tag type="warning" v-else></el-tag>
            </template>
          </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
data() {
  return {
    rightsList: []
  }
},
created() {
  this.getrightsList()
},
methods: {
  getrightsList() {
    this.$http.get('rights/list').then(res => {
       console.log(res);
           if (res.data.meta.status !== 200) {
          
          this.$message.error("获取权限列表失败");
          return;
        }
         this.$message.success("获取权限列表成功");
       this.rightsList = res.data.data
       
    })
  }
}

}
</script>

<style lang="stylus" scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  margin-top: 10px;
}
</style>