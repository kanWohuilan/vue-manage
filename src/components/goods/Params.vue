<template>
  <div>
     <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>

      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert show-icon="" type="warning" title="注意:只允许操作第三级参数" :closable='false'></el-alert>
      <el-row class="cat_opt">
        <el-col >
          <span>选择商品分类:</span>
           <el-cascader
     
   clearable
    v-model="selectedKeys"
    :options="catelist"
    expandTrigger= 'hover'
    :props=" caterProps "
    @change="handleChange"></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="动态参数" name="many">
      <el-button type="primary" size="mini" @click ='rightDialog = true' > 添加属性</el-button>
      <el-table :data="manylist" border="" stripe=""> 
        <el-table-column type="expand"> </el-table-column>
      <el-table-column type="index"> </el-table-column>
      <el-table-column label="参数属性" prop="attr_name"> </el-table-column>
      <el-table-column label="操作" > 
        <template #default ="scope">
         <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)"> 编辑</el-button>
         <el-button type="danger" icon="el-icon-delete" size="mini"> 删除</el-button>
        </template>
      </el-table-column>

      
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only">
      <el-button type="primary" size="mini" @click = 'rightDialog = true'> 添加属性</el-button>
      <el-table :data="onlylist" border="" stripe=""> 
        <el-table-column type="expand"> </el-table-column>
      <el-table-column type="index"> </el-table-column>
      <el-table-column label="属性名称" prop="attr_name"> </el-table-column>
      <el-table-column label="操作" > 
        <template #default ="scope">
         <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)"> 编辑</el-button>
         <el-button type="danger" icon="el-icon-delete" size="mini"> 删除</el-button>
        </template>
      </el-table-column>

      
      </el-table>
    </el-tab-pane>
    
  </el-tabs>
    </el-card>
        <el-dialog
  :title="title"
  :visible.sync="rightDialog"
  width="50%"
 @close='addDialogclose'
  >
 <el-form ref="form" :model="addCateForm" label-width="80px" :rules="addCateFormRules" >
  <el-form-item label="添加属性" prop="attr_name">
    <el-input v-model="addCateForm.attr_name"></el-input>
  </el-form-item>

  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="rightDialog = false">取 消</el-button>
    <el-button type="primary" @click="addparams" >确 定</el-button>
  </span>
</el-dialog>
      <el-dialog
  :title="title"
  :visible.sync="editDialog"
  width="50%"
 @close='addDialogclose2'
  >
 <el-form ref="form2" :model="editCateForm" label-width="80px" :rules="editCateFormRules" >
  <el-form-item label="修改属性" prop="attr_name">
    <el-input v-model="editCateForm.attr_name"></el-input>
  </el-form-item>

  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialog = false">取 消</el-button>
    <el-button type="primary" @click="editparams" >确 定</el-button>
  </span>
</el-dialog>
  </div>           
</template>

<script>
export default {
  data() {
    return{
catelist: [],
caterProps: {
  value: 'cat_id',
  label: 'cat_name',
  children: 'children'
},
selectedKeys: [],
activeName: 'many',
manylist: [],
onlylist: [],
rightDialog: false,
editDialog: false,
addCateForm: {
  attr_name: ''
},
editCateForm: {
  attr_name: ''
},
addCateFormRules: {
  attr_name: [
                { required: true, message: '请输入参数名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
  ]
},
editCateFormRules: {
  attr_name: [
                { required: true, message: '请输入参数名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
  ]
}
    }
    
  },
  computed: {
    cateId() {

      if(this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    title() {
      if(this.activeName === 'many') {
        return '添加动态属性'
      }else {
        return '添加静态属性'
      }
    }
  },
created() {
  this.getCate()
  },
  methods: {
    getCate() {
       this.$http.get('categories').then(res => {
       console.log(res);
           if (res.data.meta.status !== 200) {
          
          this.$message.error("获取父级列表失败");
          return;
        }
         this.$message.success("获取父级列表成功");
       this.catelist = res.data.data  
       
    })
    },
    handleChange() {
      console.log(this.selectedKeys);
     this.getlist()
    },
    getlist() {
      
       this.$http.get(`categories/${this.cateId}/attributes`,{params: {
       
        sel:this.activeName
      }}).then(res => {
       console.log(res);
           if (res.data.meta.status !== 200) {
          
          this.$message.error("获取列表失败");
          return;
        }
         this.$message.success("获取列表成功");
       if (this.activeName === 'many') {
         this.manylist = res.data.data
       } else {
         this.onlylist = res.data.data
       }
       
    })
    },
    handleClick() {
    this.getlist()
    },
    addDialogclose() {
      this.$refs.form.resetFields()
    },
    addDialogclose2() {
 this.$refs.form2.resetFields()
    },
    addparams() {
      this.$refs.form.validate(valid => {
        if(!valid) {
          return
        }
         this.$http.post(`categories/${this.cateId}/attributes`,{attr_name:this.addCateForm.attr_name, attr_sel: this.activeName}).then(res => {
       console.log(res);
           if (res.data.meta.status !== 201) {
          
          this.$message.error("添加失败");
          return;
        }
         this.$message.success("添加成功");
      this. rightDialog = false
       this.getlist()
    })
      })
    },
    editparams() {
      this.$refs.form2.validate(valid => {
        if(!valid) {
          console.log('验证成功')
          return ;
        }
         this.$http.put(`categories/${this.cateId}/attributes/${this.editCateForm.attr_id}`,{attr_name:this.editCateForm.attr_name, attr_sel: this.activeName}).then(res => {
       console.log(res);
           if (res.data.meta.status !== 200) {
          
          this.$message.error("修改失败");
          return;
        }
         this.$message.success("修改成功");
      this. rightDialog = false
       this.getlist()
    })
      })
    },
    showEditDialog(id) {
this.editDialog =true
this.$http.get(`categories/${this.cateId}/attributes/${id}`,{params: {
  attr_sel: this.activeName
}}).then(res => {
       console.log(res);
           if (res.data.meta.status !== 200) {
          
          this.$message.error("添加失败");
          return;
        }
         this.$message.success("添加成功");
      this.editCateForm = res.data.data
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
.cat_opt{
  margin 15px 0
}
</style>