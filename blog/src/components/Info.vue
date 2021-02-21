<template>
  <el-container>
    <div class="uploadAvatar">
      <el-avatar :size="200">
        <img :src="imgCode.base64" alt="" />
      </el-avatar>
      <el-upload
        action="#"
        :on-change="upLoad"
        :auto-upload="false"
        accept=".jpg,.jpeg,.png,.JPG,.JPEG"
        :file-list="fileList"
        :show-file-list="false"
      >
        <el-button class="uploadbtn" size="large" type="primary"
          >更改用户头像</el-button
        >
      </el-upload>
    </div>
    <div class="infoBox">
      <p>个人信息</p>
      <el-form
        status-icon
        label-width="80px"
        :model="userInfo"
        :disabled="disabled"
        :rules="infoFormRules"
        style="padding-right: 5px;"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="borndate">
          <el-col :span="20">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
              v-model="userInfo.borndate"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="userInfo.age"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="userInfo.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="爱好" prop="hobbies">
          <el-input
            type="textarea"
            v-model="userInfo.hobbies"
            placeholder="快写下你的爱好吧"
          ></el-input>
        </el-form-item>
        <el-form-item label="个人格言" prop="motto">
          <el-input
            type="textarea"
            v-model="userInfo.motto"
            placeholder="这个人很懒什么也没有留下"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form class="btns" style="margin: 0 auto">
        <el-form-item>
          <el-button type="primary" @click="change">修改</el-button>
          <el-button @click="save">保存并提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="60%">
      <span>是否确定修改？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      circleUrl:
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      imgbase: '',
      fileList: [],
      // 用户的图片文件
      imgCode: { base64: '' },
      userId: '',
      infoFormRules: {
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
      },
      // 用户信息填写对象
      userInfo: {
        email: '',
        username: '',
        borndate: '',
        age: '',
        sex: '',
        hobbies: '',
        motto: ''
      },
      disabled: true,
      dialogVisible: false
    }
  },
  created() {
    this.imgCode.base64 = window.sessionStorage.getItem('avatar')
    // 获取用户的id
    this.userId = window.sessionStorage.getItem('userId')
    // 获取用户的个人信息
    this.getuserInfo()
  },
  methods: {
    change() {
      this.disabled = false
    },
    save() {
      this.dialogVisible = true
    },
    async getuserInfo() {
      // 根据用户id更新后台用户的头像
      const { data: res } = await this.$http.get(`userInfo/${this.userId}`)
      this.userInfo.email = res.email
      this.userInfo.username = res.username
      this.userInfo.borndate = res.borndate
      this.userInfo.age = res.age
      this.userInfo.sex = res.sex
      this.userInfo.hobbies = res.hobbies
      this.userInfo.motto = res.motto
    },
    async upLoad(file) {
      await this.getBase64(file.raw).then(async parserResult => {
        this.imgCode.base64 = parserResult
        // 将更新后的图片存浏览器缓存中
        window.sessionStorage.setItem('avatar', this.imgCode.base64)
        // 实时更新用户头像
        this.$store.state.userInfo.avatar = window.sessionStorage.getItem(
          'avatar'
        )
      })
      // 根据用户id更新后台用户的头像
      const { data: res } = await this.$http.post(
        `avatar/${this.userId}`,
        this.imgCode
      )
      console.log(await this.$http.post(
        `avatar/${this.userId}`,
        this.imgCode
      ))
      if (res.status !== 200) {
        return this.$message({ message: res.msg, type: 'error', offset: 80 })
      }
      this.$message({ message: res.msg, type: 'success', offset: 80 })
    },
    async submit() {
      // 提交信息
      this.dialogVisible = false
      this.disabled = true
      window.sessionStorage.setItem('username', this.userInfo.username)
      this.$store.state.userInfo.username = window.sessionStorage.getItem(
        'username'
      )
      const { data: res } = await this.$http.post(
        `userInfo/${this.userId}`,
        this.userInfo
      )
      if (res.status !== 200) {
        return this.$message({ message: res.msg, type: 'error', offset: 80 })
      }
      this.$message({ message: res.msg, type: 'success', offset: 80 })
    },
    getBase64(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        let imgResult = ''
        // 将图片转化为base64编码
        reader.readAsDataURL(file)
        reader.onload = function() {
          imgResult = reader.result
        }
        reader.onerror = function(error) {
          reject(error)
        }
        reader.onloadend = function() {
          resolve(imgResult)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
}
.uploadAvatar {
  display: flex;
  flex: 1;
  position: relative;
  height: 300px;
  border: 1px solid #eee;
  border-radius: 5%;
  padding: 0;
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;
  -webkit-animation: fade-in 1s;
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
.el-avatar {
  margin: 0 auto;
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -65%);
}
.uploadbtn {
  margin-top: 220px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}
.el-avatar > img {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}
.infoBox {
  display: flex;
  flex: 1;
  flex-direction: column;
  position: relative;
  height: 750px;
  border: 1px solid #eee;
  border-radius: 2%;
  padding: 0 !important;
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;
  margin-top: 50px;
  -webkit-animation: fade-in 1s;
  box-sizing: border-box;
  padding-top: 40px;
  padding-right: 40px;
  p {
    margin-top: 20px;
    margin-left: 20px;
    font-size: 30px;
  }
}
.el-form {
  width: 100%;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: center;
}

@media (min-width: 500px) {
  .el-container {
    flex-direction: row;
  }
  .uploadAvatar {
    flex: 40%;
  }
  .infoBox {
    flex: 60%;
    margin-top: 0;
    margin-left: 50px;
  }
}
</style>
