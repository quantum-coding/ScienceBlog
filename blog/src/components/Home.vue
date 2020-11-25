<template>
  <el-container>
    <el-header>
      <div>
        <span>ScienceTalk</span>
      </div>
      <div class="user">
        <span
          class="login"
          @click="login"
          v-show="this.$store.state.showLoginbtn"
          >登录</span
        >
        <el-dropdown v-show="this.$store.state.showUser">
          <span>
            <span class='username'>{{ this.$store.state.userInfo.username }}</span>
            <el-avatar>
              <img class='pic' :src="this.$store.state.userInfo.avatar" alt="" />
            </el-avatar>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="showInfo"
              >个人中心</el-dropdown-item
            >
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
      username: '',
      defaultUrl:
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  },
  created() {
    if (!window.sessionStorage.getItem('token')) {
      this.$store.state.showLoginbtn = true
      this.$store.state.showUser = false
    } else {
      // 如果登录了保存用户的登陆状态
      this.$store.state.showLoginbtn = false
      this.$store.state.showUser = true
      this.$store.state.userInfo.username = window.sessionStorage.getItem('username')
    }
    this.$store.state.userInfo.avatar = window.sessionStorage.getItem('avatar')
  },
  methods: {
    login() {
      // 隐藏登陆显示按钮
      this.$store.state.showLoginbtn = false
      this.$router.push('/login')
    },
    logout() {
      // 清除缓存改变登录的显示状态
      window.sessionStorage.clear()
      this.$store.state.showLoginbtn = true
      this.$store.state.showUser = false
      this.$router.push('/home')
    },
    showInfo() {
      this.$router.push('/info')
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
    font-weight: 700;
    font-family: 'Courier New', Courier, monospace;
    color: #ffffff;
    margin-left: 10px;
  }
  .user span {
    display: flex;
    align-items: center;
  }
  .login {
    font-size: 20px;
    cursor: pointer;
  }
  .username {
    margin-right: 50px;
  }
  .el-avatar {
    position: absolute;
    margin-left: 65px;
  }
  .el-avatar > img {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
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
