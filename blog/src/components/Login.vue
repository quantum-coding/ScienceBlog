<template>
  <div class="login_container">
    <div class="login_box">
      <el-form
        label-width="100px"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="loginForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        email: '1746128605@qq.com',
        password: '123456'
      },
      loginFormRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        password: [
          { min: 6, max: 15, message: '密码应在6-15位之间', trigger: 'blur' },
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$store.state.showLoginbtn = false
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.status !== 200) {
          return this.$message({ message: res.msg, type: 'error', offset: 70 })
        }
        this.$message.success(res.msg)
        // 存储token值
        window.sessionStorage.setItem('token', res.token)
        // 显示用户名称以及头像
        this.$store.state.showUser = true
        // 存储用户的用户名并显示在页面上
        window.sessionStorage.setItem('username', res.username)
        this.$store.state.userInfo.username = window.sessionStorage.getItem(
          'username'
        )
        // 存储用户的头像图片并显示在页面上
        window.sessionStorage.setItem('avatar', res.avatar)
        this.$store.state.userInfo.avatar = window.sessionStorage.getItem(
          'avatar'
        )
        // 存储用户的Id
        window.sessionStorage.setItem('userId', res.userId)
        this.$router.push('/home')
      })
    },
    register() {
      this.$router.push('/register')
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 400px;
  position: relative;
}

.login_box {
  width: 30rem;
  height: 300px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #eee;
  border-radius: 5%;
  padding: 0;
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;
  -webkit-animation: fade-in 1s;
}

.el-form {
  position: absolute;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding-right: 40px;
  padding-top: 70px;
}

.el-footer {
  margin-top: 0;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

</style>
