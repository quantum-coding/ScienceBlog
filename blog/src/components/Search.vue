<template>
  <el-container>
    <div class="container">
      <div
        class="showArticle"
        v-for="item in this.articleList"
        :key="item.id"
        @click="articleDetail(item._id)"
      >
        <h1>{{ item.title }}</h1>
        <span>{{ item.author.username }} | {{ item.publishDate }}</span>
        <img :src="item.coverImg" alt="" />
        <div
          class="content"
          v-html="$options.filters.ellipsis(item.content)"
        ></div>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-count="pageCount"
        @current-change="change"
        :current-page.sync="currentPage"
      >
      </el-pagination>
    </div>
  </el-container>
</template>

<script>
export default {
  filters: {
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 50) {
        return value.slice(0, 50) + '...'
      }
      return value
    }
  },
  data() {
    return {
      articleList: [],
      // 总页数
      pageCount: 1,
      // 当前页码
      currentPage: 1,
      // 查找条件
      searchParams: {
        searchContent: '',
        searchPage: 1
      }
    }
  },
  created() {
    this.getArticles()
  },
  methods: {
    async getArticles() {
      this.searchParams.searchContent = this.$route.params.searchContent
      this.searchParams.searchPage = this.currentPage
      console.log(this.searchParams)
      const { data } = await this.$http.post(
        '/article/getSearchedArticles',
        this.searchParams
      )
      console.log(data)
      this.articleList = data.records
      this.pageCount = data.pages
    },
    async change() {
      this.searchParams.searchContent = this.$route.params.searchContent
      this.searchParams.searchPage = this.currentPage
      console.log(this.currentPage)
      const { data } = await this.$http.post(
        '/article/getSearchedArticles',
        this.searchParams
      )
      this.articleList = data.records
    },
    articleDetail(id) {
      this.$router.push('/articleDetail/' + id)
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  position: relative;
}
.container {
  position: relative;
  margin-left: 100px;
}
.showArticle {
  position: relative;
  height: 200px;
  width: 700px;
  overflow: hidden;
  margin-left: 10px;
  border: 1px solid #eee;
  border-radius: 2%;
  padding: 0;
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;
  -webkit-animation: fade-in 1s;
  cursor: pointer;
  margin: 10px 0;

  h1 {
    width: 470px;
    position: relative;
    display: block;
    font-size: 30px;
    margin-left: 20px;
    margin-bottom: 20px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  span {
    position: absolute;
    margin-left: 20px;
    margin-bottom: 10px;
  }

  img {
    z-index: 999;
    position: absolute;
    float: right;
    margin-top: -40px;
    margin-left: 520px;
    background-color: #000;
    width: 150px;
    height: 100px;
    border-radius: 10px;
    border: 0;
  }

  .content {
    position: absolute;
    width: 450px;
    height: 30px;
    margin-top: 40px;
    margin-left: 20px;
    text-overflow: ellipsis;
  }
}

.showArticle:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.el-pagination {
  margin-top: 50px;
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
