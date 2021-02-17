<template>
  <div class="register_container">
    <div class="register_box">
      <el-form
        :model="registerForm"
        :rules="registerFormRules"
        ref="registerFormRef"
        label-width="100px"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="registerForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      registerForm: {
        email: '',
        username: '',
        password: ''
      },
      registerFormRules: {
        email: [
          { required: true, message: '邮箱不能为空' },
          {
            pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            message: '邮箱格式错误'
          }
        ],
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
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
    register() {
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) return
        // 提交register表单数据
        const { data: res } = await this.$http.post(
          'register',
          this.registerForm
        )
        if (res.status !== 200) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.register_container {
  display: flex;
  flex-direction: row;
  height: 500px;
  position: relative;
}

.register_box {
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
  box-sizing: border-box;
  -webkit-animation: fade-in 1s;
}

.el-form {
  position: absolute;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding-right: 40px;
  padding-top: 40px;
}

.el-button {
  width: 100%;
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

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
