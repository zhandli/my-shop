<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="0px" class="login-form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">login</el-button>
          <el-button type="info" @click="reset">reset</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3 ~ 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6 ~ 15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        sessionStorage.setItem('token', res.data.token)
        // 通过编程式导航跳转到后台主页， 路由为/home
        this.$router.push('/home')
      })
    },
    reset () {
      // 表单实例对象下得方法，ui框架form组件提供的
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scope>
  .login-container {
    // position: relative;
    height: 100%;
    background-color: #2b4b6b;
  }

  .login-box {
    position: absolute;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar-box {
    position: absolute;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background-color: #fff;
    padding: 10px;
    border: 1px solid #eee;
    box-shadow: 0 0 10px #ddd;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;

    }
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }

  .login-form {
    position: absolute;
    padding: 0 20px;
    width: 100%;
    bottom: 0;
    box-sizing: border-box;
  }
</style>
