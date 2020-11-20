<template>
  <el-container>
    <el-header>
      <div>
        <span>ScienceTalk</span>
      </div>
      <div class="user">
        <span class="login" @click="login" v-show="this.$store.state.showLoginbtn">登录</span>
        <el-dropdown v-show="this.$store.state.showUser">
          <span>
            {{this.$store.state.userInfo.username}}
            <el-avatar>
              <img src="../assets/logo.png" alt="">
            </el-avatar>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    login() {
      // 隐藏登陆显示按钮
      this.$store.state.isLogin = false
      this.$router.push('/login')
    },
    logout() {
      window.sessionStorage.removeItem('token')
      this.$store.state.showLoginbtn = true
      this.$store.state.showUser = false
      this.$router.push('home')
      }
    
  }
}
</script>

<style lang="less" scoped>
.el-container {
  width: 100%;
  height: 100%;
}
.el-header {
  width: 100%;
  height: 60px !important;
  line-height: 60px;
  display: flex;
  padding: 0 20px;
  background-color: #4e6ef2;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
  }
  img {
    height: 50px;
    width: 50px;
  }
  span {
    font-size: 30px;
    font-weight: 900;
    font-family: 'Courier New', Courier, monospace;
    color: #ffffff;
    margin-left: 10px;
  }
  .user span{
    display: flex;
    align-items: center;
  }
  .login {
    font-size: 20px;
    cursor: pointer;
  }
  .el-dropdown span {
    font-size: 15px;
    font-weight: 500;
    font-family: 'Microsoft Yahei';
  }
}
.el-footer {
  background-color: #282b2d;
}
</style>
