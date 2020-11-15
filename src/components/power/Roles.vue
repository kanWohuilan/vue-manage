<template>
  <div>
     <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>

      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col >
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
       <el-table :data="rolesList" border="" stripe=""> 
         <el-table-column type="expand">
           <template #default ='scope'>
             <el-row style="display:flex; align-items: center;" v-for="(item1,index) in scope.row.children" :key="index" class="bdbottom"> 
               <el-col :span="5">
                 <el-tag type="" closable=""  @close="remove(scope.row,item1.id)" >{{item1.authName}}</el-tag>
                 <i class="el-icon-caret-right"></i>
               </el-col>
               <el-col :span="19">
                 <el-row v-for="(item2,index) in item1.children"  :key="index" class="bdbottom1">
                   <el-col :span="5">
                     <el-tag type="success" closable="" @close="remove(scope.row,item2.id)">{{item2.authName}}</el-tag>
                 <i class="el-icon-caret-right"></i>
                   </el-col>
                   <el-col :span="19">
                     
                 
                     <el-tag type="warning" @close="remove(scope.row,item3.id)" closable="" v-for="(item3,index) in item2.children"  :key="index">{{item3.authName}}</el-tag>
              
                   
                   </el-col>
                 </el-row>
               </el-col>
             </el-row>
              </template>
         </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
         <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作">
             <template #default ='scope'> 
             <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
               <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
               <el-button type="warning" icon="el-icon-setting" size="mini" @click="showDialog(scope.row)">分配权限</el-button>
           
              
            </template>
          </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
  title="修改用户"
  :visible.sync="rightDialog"
  width="50%"
  @closed="closeright"
  >
<el-tree :data="rightsList" :props="treeProps" ref="treeRef" show-checkbox node-key="id" :default-expand-all="true" :default-checked-keys="defKeys"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="rightDialog = false">取 消</el-button>
    <el-button type="primary" @click="allotRights" >确 定</el-button>
  </span>
</el-dialog>
  </div>
  
</template>

<script>
export default {
  data() {
  return {
    rolesList: [],
    rightDialog: false,
    rightsList: [],
    treeProps: {
      label: 'authName',
      children: 'children'
    },
    defKeys: [],
    roleId: ''

  }
},
created() {
  this.getrolesList()
},
methods: {
  closeright() {
    this.defKeys = []
  },
  getlefKeys(node,arr) {
    if(!node.children){
      return arr.push(node.id)
    }
    node.children.forEach(item => {
      this.getlefKeys(item,arr)
    });
  },
  showDialog(roles) {
    this.roleId = roles.id
    this.getlefKeys(roles,this.defKeys)
    this.rightDialog =true
    this.$http.get('rights/tree').then(res => {
       console.log(res);
           if (res.data.meta.status !== 200) {
          
          this.$message.error("获取权限数据失败");
          return;
        }
         this.$message.success("获取权限数据成功");
       this.rightsList = res.data.data
       
    })
 
  },
  getrolesList() {
    this.$http.get('roles').then(res => {
       console.log(res);
           if (res.data.meta.status !== 200) {
          
          this.$message.error("获取权限列表失败");
          return;
        }
         this.$message.success("获取权限列表成功");
       this.rolesList = res.data.data
       
    })
  },
  remove(role,id) {
     this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`roles/${role.id}/rights/${id}`).then(res => {
            console.log(res);
             if (res.data.meta.status !== 200) {
          if(res.data.meta.status === 400) {
            this.$message.error(res.data.meta.msg)
            return
          }
          this.$message.error("删除失败");
          return;
        }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
            role.children = res.data.data
          })
        
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
  },
   allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      this.$http.post(`roles/${this.roleId}/rights`,{rids: idStr}).then((res) => {
          console.log(res);
           if (res.data.meta.status !== 200) {
          
          this.$message.error("分配权限失败");
          return;
        }
       this.$message.success("分配权限成功");
        this.getrolesList()
        this.rightDialog = false
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
.el-tag {
  margin 7px
}
// .bdtop
//   border-top 1px solid #eeeeee
.bdbottom
  border-bottom  1px solid #eeeeee
  &:first-child
    border-top  1px solid #eeeeee
.bdbottom1
  border-bottom  1px solid #eeeeee
  &:last-child
    border-bottom   none
</style>