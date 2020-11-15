<template>
  <div>
      <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>

      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
       <el-row>
        <el-col >
          <el-button type="primary" @click="showaddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <treeTable class="treeTable" :data = 'cartList'  :columns = 'columns' :selection-type ='false'
      :expand-type = 'false' show-index index-text='#' border :show-row-hover ='false'
      > 
      <template slot="isok" slot-scope= 'scope'> 
        <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
        <i class="el-icon-error" style="color: red"  v-else></i>
   
      </template>
      <template slot="order" slot-scope="scope"> 
        <el-tag type="" size="mini" v-if="scope.row.cat_level=== 0">一级</el-tag>
        <el-tag type="success" size="mini" v-else-if="scope.row.cat_level=== 1">二级</el-tag>
        <el-tag type="waring" size="mini" v-else>三级</el-tag>
      </template>
      <template slot="opt" > 
        <el-button type="primary" icon="el-icon-edit"  size="mini">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete"  size="mini">删除</el-button>
      </template>
      </treeTable>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3,5,10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <el-dialog
  title="添加分类"
  :visible.sync="addCatedialog"
  width="50%"
  @close="closeDialog"  >
  <el-form ref="form" :model="addCateForm" label-width="80px" :rules="addCateFormRules">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类" >
     <el-cascader
     
   clearable
    v-model="selectedKeys"
    :options="ParentCat"
    expandTrigger= 'hover'
    :props=" cascaderProps "
    @change="handleChange"></el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCatedialog = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
export default {
data() {
  
    return {
        cartList: [],
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
         total: 0,
         columns: [
           {
             label: '分类名称',
             prop: 'cat_name'
           },
           {
             label: '是否有效',
             type: 'template',
             template: 'isok'
           },
            {
             label: '排序',
             type: 'template',
             template: 'order'
           },
           {
             label: '操作',
             type: 'template',
             template: 'opt'
           }
           
         ],
         addCatedialog: false,
         addCateForm: {
           cat_name: '',
           cat_pid: 0,
           cat_level: 0
         },
         addCateFormRules: {
           cat_name: [
                      { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
           ]
         },
         ParentCat: [],
         cascaderProps: {
           value: 'cat_id',
           label: 'cat_name',
           children: 'children'
         },
         selectedKeys: []
    }
    
    },
created(){
  this.getcartList()
},
methods: {
  getcartList() {
     this.$http.get('categories/',{params :this.queryInfo}).then(res => {
       console.log(res);
           if (res.data.meta.status !== 200) {
          
          this.$message.error("获取商品列表失败");
          return;
        }
         this.$message.success("获取商品列表成功");
       this.cartList = res.data.data.result
       this.total = res.data.data.total
    })
  },
   handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getcartList()
  },
  handleCurrentChange(newNum) {
 this.queryInfo.pagenum = newNum
      this.getcartList()
  },
  showaddDialog() {
    this.getParentCate() 
    this.addCatedialog = true
  },
  getParentCate() {
    this.$http.get('categories',{params: {
      type: 2
    }}).then(res => {
       console.log(res);
           if (res.data.meta.status !== 200) {
          
          this.$message.error("获取父级列表失败");
          return;
        }
         this.$message.success("获取父级列表成功");
       this.ParentCat = res.data.data
       
    })
  },
  handleChange() {
    console.log(this.selectedKeys);
    if(this.selectedKeys.length > 1) {

   this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
    this.addCateForm.cat_level = this.selectedKeys.length
    return
    }else {
       this.addCateForm.cat_pid = 0
       this.addCateForm.cat_level = 0
    }
   
  },
  addCate() {
    console.log(this.addCateForm);
    this.$refs.form.validate(valid => {
      if(!valid) {
        return
      }
        this.$http.post('categories',this.addCateForm).then(res => {
       console.log(res);
           if (res.data.meta.status !== 201) {
          
          this.$message.error("添加失败");
          return;
        }
         this.$message.success("添加成功");
     this.getcartList() 
     this.addCatedialog = false
       
    })
    })
  },
  closeDialog() {
    this.$refs.form.resetFields()
    this.selectedKeys = []
    this.addCateForm.cat_pid = 0
       this.addCateForm.cat_level = 0
    
}
}
}
</script>

<style>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  margin-top: 10px;
}
.treeTable{
  margin: 15px 0;
}
</style>