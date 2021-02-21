<template>
  <div class="container">
    <div class="manage_box">
      <el-menu
        active-text-color="#409EFF"
        :unique-opened="true"
        router
        :default-active="activePath"
        :mode="mode"
      >
        <el-submenu :index="item.id" v-for="item in menulist" :key="item.id">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{ item.title }}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item
            :index="'/' + subItem.path"
            v-for="subItem in item.children"
            :key="subItem.id"
            @click="savNavPath('/' + subItem.path)"
          >
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{ subItem.title }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="showbox">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  data() {
    return {
      mode: 'vertical',
      screenWidth: document.body.clientWidth,
      /* 菜单的选项
      此处的menulist也可以存储在后台数据库中，可自行修改 */
      menulist: [
        {
          title: '创作管理',
          id: '1',
          children: [{ title: '写新文章', id: '1-1', path: 'newArticle' }]
        },
        {
          title: '文章管理',
          id: '2',
          children: [
            { title: '已发布的文章', id: '2-1', path: 'publishedArticle' },
            { title: '草稿箱', id: '2-2', path: 'draftBox' }
          ]
        },
        {
          title: '用户管理',
          id: '3',
          children: [{ title: '评论管理', id: '3-1', path: 'commentManage' }]
        }
      ],
      // 用户在菜单的选中项
      activePath: '',
      // 是否隐藏通知红点
      hide: true
    }
  },
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  mounted() {
    const that = this
    window.addEventListener('resize', function() {
      if (document.body.clientWidth >= 500) {
        that.mode = 'vertical'
        $('.manage_box').width(200)
      } else {
        that.mode = 'horizontal'
        $('.manage_box').width('100%')
      }
    })
  },
  methods: {
    savNavPath(activePath, index) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
      console.log(this.index)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
}

.manage_box {
  position: relative;
  margin-left: 0;
  border: 1px solid #eee;
  border-radius: 1%;
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

.showbox {
  position: relative;
  margin-top: 50px;
  height: 800px;
}

@media (min-width: 500px) {
  .container {
    display: flex;
    flex-direction: row;
  }

  .showbox {
    margin-top: 0;
    margin-left: 50px;
    width: 100%;
  }

}
</style>
