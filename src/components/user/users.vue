<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getUserList">
        <el-button slot="append" icon="el-icon-search" @click="serch"></el-button>
      </el-input>
      <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
      <el-table
        :data="userList"
        style="width: 100%"
        border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteDialog(scope.row.id)"></el-button>
            <!-- 分配角色 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
         <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
         <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
         <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose">
      <el-form :model="addEditForm" :rules="addFormRules" ref="addEditForm" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="addEditForm.username" disabled></el-input>
        </el-form-item>
         <el-form-item label="邮箱" prop="email">
          <el-input v-model="addEditForm.email"></el-input>
        </el-form-item>
         <el-form-item label="手机" prop="mobile">
          <el-input v-model="addEditForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getUserList()
  },
  data () {
    // 验证邮箱的自定义规则
    var checkEmail = (rule, value, callback) => {
      // console.log(rule)
      const regEmail = /^([a-z0-9_-]+)@([\da-z-]+)\.([a-z]{2,6})$/
      if (!regEmail.test(value)) {
        return callback(new Error('请输入合法的邮箱'))
      }
      callback()
    }
    // 验证手机号的自定义规则
    var checkMobile = (rule, value, callback) => {
      // console.log(rule)
      const regMobile = /^1[3|4|5|7|8|]\d{9}$/s
      if (!regMobile.test(value)) {
        return callback(new Error('请输入合法的手机号'))
      }
      callback()
    }
    return {
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前页面显示多少条数据
        pagesize: 2
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      editDialogVisible: false,
      // 添加用户得表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addEditForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      addDeleteForm: {
        id: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { max: 10, min: 3, message: '用户名得长度在 3~10 个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { max: 15, min: 6, message: '密码的长度在 6~15 个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('请求用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    serch () {
      this.queryInfo.pagenum = 1
      this.getUserList()
    },
    async userStateChange (userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    dialogClose () {
      this.$refs.addForm.resetFields()
    },
    addUser () {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        this.getUserList()
        this.dialogVisible = false
      })
    },
    editDialog (rowInfo) {
      this.addEditForm.id = rowInfo.id
      this.addEditForm.username = rowInfo.username
      this.addEditForm.email = rowInfo.email
      this.addEditForm.mobile = rowInfo.mobile
      this.editDialogVisible = true
    },
    editUser () {
      this.$refs.addEditForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`users/${this.addEditForm.id}`, {
          email: this.addEditForm.email,
          mobile: this.addEditForm.mobile
        })
        if (res.meta.status !== 200) return this.$message.error('修改用户信息失败')
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('修改用户成功')
      })
    },
    editDialogClose () {
      this.$refs.addEditForm.resetFields()
    },
    async deleteDialog (id) {
      const confirmOrNot = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(res => res)
      if (confirmOrNot !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.success(res.meta.msg)
      this.total--
      var restItem = this.total - this.queryInfo.pagesize * (this.queryInfo.pagenum - 1)
      if (restItem === 0 && this.total !== 0) {
        this.queryInfo.pagenum = this.queryInfo.pagenum - 1
      }
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>form
  .el-input {
    width: 350px;
  }
  .input-with-select {
    width: 263px;
    margin-right: 45px;
    background-color: #fff;
  }
</style>
