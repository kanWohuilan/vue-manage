<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>

      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" @clear = 'getUserList' clearable="">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userlist" border="" stripe="">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <el-switch v-model="scope.row.mg_state" @change="userChange(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template #default="scope">
            <el-button type="primary"  icon="el-icon-delete" size="mini" @click="removeUserByID(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-share" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色"  placement="top" :enterable= 'false'>
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="setRights(scope.row)">
               

    
            </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1,2,5,10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <el-dialog
  title="添加用户"
  :visible.sync="addDialog"
  width="30%"
  @close = 'addFormclose'
 >
<el-form :model="addForm" :rules="addFormRules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialog = false">取 消</el-button>
    <el-button type="primary" @click="adduser">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
  title="修改用户"
  :visible.sync="editDialog"
  width="50%"
    @close = 'editFormclose'
  >
 <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="70px" class="demo-ruleForm">
  <el-form-item label="用户名">
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialog = false">取 消</el-button>
    <el-button type="primary" @click="editUserinfo" >确 定</el-button>
  </span>
</el-dialog>
 <el-dialog
  title="分配角色"
  :visible.sync="showroleDialog"
  width="50%"
 @close="closeroleDialog"
  >
  <div >
    <p style="line-height: 25px">当前用户: {{userInfo.username}}</p>
    <p style="line-height: 25px">当前角色:{{userInfo.role_name}}</p>
    <p>分配新角色:   <el-select v-model="selectRoleId" placeholder="请选择">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select></p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showroleDialog = false">取 消</el-button>
    <el-button type="primary" @click="saveRole" >确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
const checkEmail = (rule,value,callback) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

      if(regEmail.test(value)) {
        return  callback()
       
      }
       callback( new Error('请输入合法的邮箱'))
    } 
    const checkMobile = (rule,value,callback) => {
         const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/

      if(regMobile.test(value)) {
        return  callback()
       
      }
       callback( new Error('请输入合法的手机号'))
    } 
export default {
  data() {
    
    return {
      
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      addDialog: false,
      editDialog: false,
      showroleDialog: false,
      addForm:{
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
      
      },
      addFormRules : {
        username:[ {
            required: true, message: "请输入用户名", trigger: "blur" 
        },{min: 3 ,max:10, message: '用户名的长度在3~10个字符之间', trigger: 'blur'}],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {min: 3 ,max:10, message: '密码的长度在3~10个字符之间', trigger: 'blur'}
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {validator: checkMobile, trigger: 'blur'}
        ]
      },
      editFormRules: {
         username:[ {
            required: true, message: "请输入用户名", trigger: "blur" 
        },{min: 3 ,max:10, message: '用户名的长度在3~10个字符之间', trigger: 'blur'}],
      
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {validator: checkMobile, trigger: 'blur'}
        ]
      },
      userInfo: {},
      rolesList: [],
      selectRoleId: ''
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      this.$http.get("users", { params: this.queryInfo }).then((res) => {
        
        if (res.data.meta.status !== 200) {
          this.$message.error("获取用户列表失败");
          return;
        }
        this.userlist = res.data.data.users;
        this.total = res.data.data.total;
      });
    },
    saveRole() {
      if(!this.selectRoleId) {
        return this.$message.error("请选择要分配的角色");
         
      }
       this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId }).then((res) => {
        
        if (res.data.meta.status !== 200) {
          this.$message.error("更新角色列表失败");
          return;
        }
       this.$message.success("更新角色状态成功");
      this.showroleDialog =false
      this.getUserList()
      });
    },
    setRights(user) {
      this.userInfo =  user
       this.$http.get("roles", { params: this.queryInfo }).then((res) => {
        
        if (res.data.meta.status !== 200) {
          this.$message.error("获取角色列表失败");
          return;
        }
        this.rolesList = res.data.data
      
      });
      this.showroleDialog = true
      
    },
    closeroleDialog() {
      this.userInfo = ''
      this.closeroleDialog =''
    },
    handleSizeChange(newPage) {
      this.queryInfo.pagesize = newPage
      this.getUserList();
    },
    handleCurrentChange(newPage){
 this.queryInfo.pagenum = newPage
 this.getUserList();
    },
    userChange(userinfo){
      this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`).then(res => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state 
          this.$message.error("更新用户状态失败");
          return;
        }
         this.$message.success("更新用户状态成功");
      })
      console.log(userinfo);
    },
    addUser() {
      this.addDialog = true
    },
    addFormclose () {
      this.$refs.ruleForm.resetFields()
    },
    adduser() {
      this.$refs.ruleForm.validate(vali => {
        if(!vali) {
          return
        }
        this.$http.post('users',this.addForm).then((res) => {
          console.log(res);
           if (res.data.meta.status !== 201) {
          
          this.$message.error("添加用户失败");
          return;
        }
         this.$message.success("添加用户成功");
         this.addDialog = false
         this.getUserList()
        })
      })
    },
    showEditDialog(id) {
this.editDialog =true
 this.$http.get(`users/${id}`).then((res) => {
          console.log(res);
           if (res.data.meta.status !== 200) {
          
          this.$message.error("查询用户失败");
          return;
        }
      
        this.editForm =res.data.data
        })
    },
    editFormclose() {
       this.$refs.editForm.resetFields()
    },
    
    editUserinfo() {
      this.$refs.editForm.validate(vali => {
         if(!vali) {
          return
        }
         this.$http.put(`users/${this.editForm.id}`,{email: this.editForm.email, mobile: this.editForm.mobile}).then((res) => {
          console.log(res);
           if (res.data.meta.status !== 200) {
          
          this.$message.error("更新用户失败");
          return;
        }
         this.$message.success("更新用户成功");
         this.editDialog = false  
         this.getUserList()
        })
      })
      
    },
    removeUserByID(id) {
     this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`users/${id}`).then(res => {
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
          this.getUserList()
          })
        
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      
    },
   
  },
};
</script>

<style lang="stylus" scoped>
.box-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  margin-top: 10px;
}

.el-table {
  margin-top: 15px;
}
.el-pagination
  margin-top 15px
</style>