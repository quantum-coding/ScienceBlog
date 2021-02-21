<template>
  <div class="articleContainer">
    <div class="article">
      <h1>{{ article.title }}</h1>
      <div class="describe">
        <span class="author">{{ article.author.username }}</span>
        <span class="publishDate">{{ article.publishDate }}</span>
        <div>
          <span class="variety"
            >文章分类:
            <el-tag>{{ article.variety }}</el-tag>
          </span>
          <span class="tags"
            >文章标签:
            <el-tag v-for="tag in article.tags" :key="tag">{{ tag }}</el-tag>
          </span>
        </div>
      </div>
      <div class="content" v-html="article.content"></div>
    </div>
    <div class="tool_box">
      <ul>
        <li @click="likeCount" class="like">
          <i class="iconfont icon-dianzan"></i> 点赞<span v-show="isVisible">{{
            count
          }}</span>
        </li>
        <li @click="scrollTocommit">
          <i class="iconfont icon-pinglun"></i> 评论<span
            v-show="showCommentCount"
            >{{ commentsCount }}</span
          >
        </li>
        <li @click="collect" class="collect">
          <i class="iconfont icon-shoucang"></i> 收藏<span
            v-show="showCollectCount"
            >{{ collectCount }}</span
          >
        </li>
      </ul>
    </div>
    <div class="commit_box">
      <div class="write_commit">
        <el-avatar>
          <img :src="avatar" alt="" />
        </el-avatar>
        <div class="wirteCommit">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="文章写得好就快来评论吧"
            v-model="comContent"
          >
          </el-input>
        </div>
        <el-button type="primary" @click="publishComment">评论</el-button>
      </div>
      <div class="showCommit">
        <ul>
          <li v-for="item in this.commentList" :key="item.id">
            <div class="commentUserInfo">
              <el-avatar>
                <img :src="item.uid.avatar_img" alt="" />
              </el-avatar>
              <span>{{ item.uid.username }}:</span>
            </div>
            <span style="margin-left: 5px"
              >{{ item.content }}
              <p>发表于{{ item.time | formatDate }}</p></span
            >
          </li>
        </ul>
      </div>
    </div>
    <el-backtop
      target=".el-main"
      :bottom="100"
      :visibility-height="200"
      :right="150"
      ><i class="el-icon-caret-top"></i
    ></el-backtop>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  filters: {
    formatDate(value) {
      const myDate = new Date(value)
      const yy = myDate.getFullYear()
      const mm = (myDate.getMonth() + 1 + '').padStart(2, '0')
      const dd = (myDate.getDate() + '').padStart(2, '0')
      return `${yy}-${mm}-${dd}`
    }
  },
  data() {
    return {
      // 获取文章的信息
      article: {
        author: {
          username: ''
        }
      },
      // 判断用户是否点赞
      isLike: false,
      // 判断用户是否收藏
      isCollected: false,
      count: '',
      // 获取点赞的相关信息
      countInfo: {
        totalCount: '',
        likeUsers: ''
      },
      // 获取收藏用户的相关信息
      collectInfo: {
        totalCount: '',
        collectUsers: ''
      },
      isVisible: false,
      // 显示收藏人数
      showCollectCount: false,
      // 显示收藏的人数
      collectCount: '0',
      avatar: '',
      // 获取评论的内容
      comContent: '',
      // 用于上传评论信息的用户对象
      commentUser: {
        aid: '',
        uid: '',
        content: ''
      },
      commentList: [],
      // 显示评论数的变量
      commentsCount: '',
      // 是否显示评论数的变量
      showCommentCount: false,
      // 告知用户有新评论的消息对象
      commentMsg: {
        aid: '',
        uid: '',
        content: '',
        authorId: ''
      }
    }
  },
  mounted() {
    // 获取页面携带的id
    const id = this.$route.params.id
    // 监听页面滚动事件
    window.addEventListener(
      'scroll',
      this.debounce(this.handleScroll, 300),
      true
    )
    this.avatar = window.sessionStorage.getItem('avatar')
    // 获取文章的详细信息
    this.getArticleDetail(id)
  },
  // 监听文章内容是否渲染完毕，如果完成进行判断，考虑到图片加载较慢，应先用定时器加载
  watch: {
    'article.content': function() {
      this.$nextTick(function() {
        setTimeout(function() {
          if (
            $('.el-main').scrollTop() <=
            $('.article').innerHeight() +
              parseInt($('.el-main').css('paddingTop')) +
              $('.el-header').height() +
              $('.tool_box').height() -
              $(window).height()
          ) {
            $('.tool_box').addClass('fixtool_box')
          }
        }, 300)
      })
    }
  },
  methods: {
    debounce(fn, delay) {
      let timer
      return function() {
        clearTimeout(timer)
        timer = setTimeout(fn, delay)
      }
    },
    // 点击收藏按钮时触发的事件
    async collect() {
      this.isCollected = !this.isCollected
      // 如果用户未选中就改变文字颜色，如果选中就不改变
      if (this.isCollected) {
        $('.collect').css('color', '#4E6EF2')
        this.collectCount = parseInt(this.collectCount) + 1
        this.showCollectCount = true
        // 更新收藏总人数
        this.collectInfo.totalCount = this.collectCount
        // 获取收藏用户的Id
        this.collectInfo.collectUsers = window.sessionStorage.getItem('userId')
        const data = await this.$http.post(
          `/article/articleDetail/addCollectCount/${this.$route.params.id}`,
          this.collectInfo
        )
      } else {
        $('.collect').css('color', '#000000')
        this.collectCount = parseInt(this.collectCount) - 1
        // // 更新点赞总数
        this.collectInfo.totalCount = this.collectCount
        // // 获取取消点赞用户的Id
        this.collectInfo.collectUsers = window.sessionStorage.getItem('userId')
        await this.$http.put(
          `/article/articleDetail/minusCollectCount/${this.$route.params.id}`,
          this.collectInfo
        )
        if (this.collectCount == 0) {
          this.showCollectCount = false
        }
      }
    },
    async publishComment() {
      // 如果用户尚未评论，就提示其写上内容
      if (this.comContent == '') {
        this.$alert('您尚未评论！', '', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${action}`
            })
          }
        })
        return
      }
      // 获取文章id
      this.commentUser.aid = this.$route.params.id
      // 获取用户评论的内容
      this.commentUser.content = this.comContent
      // 获取评论用户的id
      this.commentUser.uid = window.sessionStorage.getItem('userId')
      // 将用户的评论上传至后台
      await this.$http.post('/comment', this.commentUser)

      this.commentMsg.aid = this.$route.params.id

      this.commentMsg.content = this.comContent

      this.commentMsg.uid = window.sessionStorage.getItem('userId')

      this.commentMsg.authorId = this.article.author._id

      this.comContent = ''

      this.getArticleDetail(this.$route.params.id)

      await this.$http.post('/message/commentMsg', this.commentMsg)
    },
    scrollTocommit() {
      // scrollTop 代表的是被选元素垂直滚动条对应的位置
      /*
      要注意innerHeight方法返回的是一个number类型的值，而.css()获得的是一个
      带有px字符类型的单位，两者若进行相加需要先进行类型转换
      */
      $('.el-main').animate(
        {
          scrollTop:
            $('.article').innerHeight() +
            $('.tool_box').height() +
            parseInt($('.el-main').css('paddingTop'))
        },
        1000
      )
    },
    handleScroll(e) {
      if (
        $('.el-main').scrollTop() <=
        80 +
          $('.article').innerHeight() +
          $('.tool_box').height() -
          $(window).height()
      ) {
        $('.tool_box').addClass('fixtool_box')
      } else {
        $('.tool_box').removeClass('fixtool_box')
      }
    },
    async getArticleDetail(articleId) {
      const { data: res } = await this.$http.get(
        `/article/articleDetail/${articleId}`
      )
      this.article = res.article
      console.log(this.article)
      this.commentList = res.comments
      this.count = this.article.totalCount
      this.collectCount = this.article.collectCount
      // 如果获取的收藏的用户为空字符串的话应将其转化为数字类型0
      if (this.collectCount == 0 || this.collectCount == null) {
        this.showCollectCount = false
        if (this.collectCount == null) this.collectCount = 0
      } else {
        this.showCollectCount = true
      }

      if (this.count == 0 || this.count == null) {
        this.isVisible = false
        if (this.count == null) this.count = 0
      } else {
        this.isVisible = true
      }
      // 遍历点赞的用户列表，如果用户点赞过就将样式调整为已点赞的样式
      for (var index in this.article.likeUsers) {
        if (
          window.sessionStorage.getItem('userId') ===
          this.article.likeUsers[index]
        ) {
          $('.like').css('color', '#4E6EF2')
          this.isLike = true
        }
      }

      // 遍历收藏的用户列表，如果用户收藏过就将样式调整为已点赞的样式
      for (var collectIndex in this.article.collectUsers) {
        if (
          window.sessionStorage.getItem('userId') ===
          this.article.collectUsers[collectIndex]
        ) {
          $('.collect').css('color', '#4E6EF2')
          this.isCollected = true
        }
      }

      // 根据获取的评论列表获取点赞数
      this.commentsCount = this.commentList.length
      // 如果没有人评论就隐藏点赞的评论数
      if (this.commentsCount == 0 || this.commentsCount == null) {
        this.showCommentCount = false
      } else {
        this.showCommentCount = true
      }
    },
    async likeCount() {
      this.isLike = !this.isLike
      // 如果用户未选中就改变文字颜色，如果选中就不改变
      if (this.isLike) {
        $('.like').css('color', '#4E6EF2')
        this.count = parseInt(this.count) + 1
        this.isVisible = true
        // 更新点赞总数
        this.countInfo.totalCount = this.count
        // 获取点赞用户的Id
        this.countInfo.likeUsers = window.sessionStorage.getItem('userId')
        const data = await this.$http.post(
          `/article/articleDetail/addCount/${this.$route.params.id}`,
          this.countInfo
        )
      } else {
        $('.like').css('color', '#000000')
        this.count = parseInt(this.count) - 1
        // 更新点赞总数
        this.countInfo.totalCount = this.count
        // 获取取消点赞用户的Id
        this.countInfo.likeUsers = window.sessionStorage.getItem('userId')
        const data = await this.$http.put(
          `/article/articleDetail/minusCount/${this.$route.params.id}`,
          this.countInfo
        )
        if (this.count == 0) {
          this.isVisible = false
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.articleContainer {
  position: relative;
  padding-top: 0;
  width: 100%;
  line-height: 30px;
  margin: 0 auto;
  .article {
    margin-top: 0;
    position: relative;
    background-color: #ffffff;
    padding: 24px 12px 50px 24px;
    box-shadow: 0 0 10px #ddd;
    -webkit-animation: fade-in 1s;
    h1 {
      font-size: 28px;
      font-weight: 600;
      margin-top: 0;
    }
  }
}

.describe {
  width: 100%;
  background-color: #f8f8f8;
  border-radius: 4px;
  padding-bottom: 10px;
}

.author {
  display: block;
  margin-left: 50px;
}
.publishDate {
  margin-left: 50px;
  color: #999aaa;
}

.describe > div {
  padding-left: 50px;
}

.variety {
  color: #999aaa;
}

.el-tag {
  margin-left: 10px;
  line-height: 25px;
  height: 25px;
}

.tags {
  color: #999aaa;
  margin-left: 80px;
}

.tool_box {
  position: relative;
  width: 100%;
  height: 50px;
  background-color: #f8f8f8;
  box-shadow: 0 0 10px #ddd;
}

.fixtool_box {
  position: fixed;
  bottom: 0;
  box-sizing: border-box;
}

ul {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 24px;
  margin: 0;
}

.tool_box ul > li {
  float: left;
  margin-left: 40px;
  list-style-type: none;
  cursor: pointer;
  font-size: 18px;
}

i {
  font-size: 20px;
}

.tool_box ul li:nth-child(1) {
  margin-left: 0;
}

.tool_box ul > li:hover {
  color: #4e6ef2 !important;
}

.commit_box {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  border: 1px solid #eee;
  background-color: #ffffff;
  box-shadow: 0 0 10px #ddd;
  margin-top: 20px;
  -webkit-animation: fade-in 1s;
}

.write_commit {
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
  margin-top: 10px;
  padding-left: 20px;
  box-sizing: border-box;
  .el-avatar > img {
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
  }
}

.el-avatar {
  margin-right: 10px;
}
.wirteCommit {
  display: flex;
  flex: 95%;
  margin-bottom: 10px;
  margin-right: 5px;
}

.el-button {
  display: flex;
  flex: 5%;
  height: 40px;
}

.showCommit {
  position: relative;
  width: 100%;
}

.showCommit ul {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding-right: 10px;
}

.showCommit ul li {
  width: 100%;
  font-size: 15px;
  list-style-type: none;
  border-bottom: 2px solid #ccc;
}

.showCommit ul li:last-child {
  border-bottom: none;
}

.commentUserInfo {
  display: flex;
  align-items: center;
  .el-avatar > img {
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
  }
}

.showCommit .el-avatar {
  margin-bottom: 5px;
  margin-top: 5px;
}

p {
  margin: 0 0;
  display: block;
  font-size: 10px;
  text-align: right;
  margin-right: 30px;
}

.el-backtop {
  height: 60px;
  width: 60px;
  i {
    font-size: 18px;
  }
}

@media (min-width: 760px) {
  .articleContainer {
    width: 760px;
  }
  .fixtool_box {
    width: 760px;
  }
}
</style>
