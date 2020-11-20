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
import $ from 'jquery'
export default {
  data() {
    return {
      loginForm: {
        email: '1746128609@qq.com',
        password: '123456'
      },
      loginFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        password: [
          { min: 6, max: 15, message: '密码应在6-15位之间', trigger: 'blur' },
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.status !== 200) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        // 存储token值
        window.sessionStorage.setItem('token', res.token)
        // 显示用户名称以及头像
        this.$store.state.showUser = true
        this.$store.state.userInfo.username = res.username
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
  height: 100%;
  position: relative;
}

.login_box {
  width: 450px;
  height: 300px;
  position: absolute;
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
