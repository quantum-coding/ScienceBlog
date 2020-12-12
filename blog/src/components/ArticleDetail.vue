<template>
  <div class="articleContainer">
    <div class="article">
      <h1>{{ article.title }}</h1>
      <div class="describe">
        <span class="author">{{ article.author }}</span>
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
        <li><i class="iconfont icon-pinglun"></i> 评论</li>
        <li><i class="iconfont icon-shoucang"></i> 收藏</li>
      </ul>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  data() {
    return {
      // 获取文章的信息
      article: {},
      // 判断用户是否点赞
      isLike: false,
      count: '',
      // 获取点赞的相关信息
      countInfo: {
        totalCount: '',
        likeUsers: ''
      },
      isVisible: false
    }
  },
  mounted() {
    // 获取页面携带的id
    const id = this.$route.params.id
    // 获取文章的详细信息
    this.getArticleDetail(id)
    // 监听页面滚动事件
    window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    handleScroll(e) {
      if (
        $(window).scrollTop() <=
        $('.articleContainer').offset().top +
          $('.articleContainer').height() +
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
      this.article = res
      this.count = this.article.totalCount
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
  position: absolute;
  width: 760px;
  border: 1px solid #eee;
  background-color: #ffffff;
  box-shadow: 0 0 10px #ddd;
  -webkit-animation: fade-in 1s;
  line-height: 30px;
  .article {
    padding: 0 24px;
    margin-bottom: 50px;
    h1 {
      font-size: 28px;
      font-weight: 600;
    }
  }
}

.describe {
  width: 100%;
  background-color: #f8f8f8;
  border-radius: 4px;
  height: 65px;
}

.author {
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
  margin-left: 80px;
}

.tool_box {
  width: 100%;
  height: 50px;
  background-color: #f8f8f8;
}

.fixtool_box {
  position: fixed;
  width: 760px;
  bottom: 0;
}

ul {
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 24px;
  margin: 0;
}

ul > li {
  float: left;
  margin-left: 40px;
  list-style-type: none;
  cursor: pointer;
  font-size: 18px;
}

i {
  font-size: 20px;
}

li:nth-child(1) {
  margin-left: 0;
}

ul > li:hover {
  color: #4e6ef2 !important;
}
</style>
