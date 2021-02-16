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
        :pager-count="5"
        :page-count="pageCount"
        @current-change="change"
        :current-page.sync="currentPage"
      >
      </el-pagination>
    </div>
    <div class="slide">
      <div style="margin-top: 10px" class="search">
        <el-input
          placeholder="请输入内容"
          v-model="searchContent"
          @input="search"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getResult"
          ></el-button>
        </el-input>
        <div class="searchResult" v-show="isSearched">
          <ul>
            <li
              v-for="item in this.searchResult"
              :key="item.id"
              @click="showResult(item)"
            >
              {{ item.title }}
            </li>
          </ul>
        </div>
      </div>
      <div class="hot">
        <h2>热门文章</h2>
        <ul>
          <li
            v-for="item in this.hotArticleList"
            :key="item.id"
            @click="articleDetail(item._id)"
          >
            <h1>{{ item.title }}</h1>
            <img :src="item.coverImg" alt="" />
            <span>{{ item.publishDate }}</span>
          </li>
        </ul>
      </div>
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
      searchContent: '',
      timer: '',
      // 搜索的结果
      searchResult: [],
      isSearched: false,
      // 存储热门文章的列表
      hotArticleList: []
    }
  },
  created() {
    this.getArticles()
    this.getHotArticles()
  },

  methods: {
    async getHotArticles() {
      const { data } = await this.$http.get('/article/hotArticles')
      this.hotArticleList = data
      console.log(this.hotArticleList)
    },
    // 得到输入框搜索展示后的结果
    getResult() {
      this.$router.push(`/search/${this.searchContent}`)
      this.isSearched = false
    },
    // 点击搜索的结果
    showResult(item) {
      this.searchContent = item.title
      this.$router.push(`/search/${this.searchContent}`)
      this.isSearched = false
    },
    // 使用数据防抖防止多次请求
    search: function() {
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        if (this.searchContent == '') {
          this.isSearched = false
          return
        }
        // 根据搜索内容查找数据
        const { data } = await this.$http.get(
          `/article/search/${this.searchContent}`
        )
        console.log(data)
        if (data) {
          this.searchResult = data.records
          this.isSearched = true
        } else {
          this.isSearched = false
        }
      }, 1000)
    },
    async change() {
      const { data } = await this.$http.get(
        `/article/getArticleList/${this.currentPage}`
      )
      this.articleList = data.records
    },
    async getArticles() {
      // 获取用户Id
      const authorId = window.sessionStorage.getItem('userId')
      const { data } = await this.$http.get(
        `/article/getArticleList/${this.currentPage}`
      )
      // console.log(data)

      this.articleList = data.records

      // 确定总页数
      this.pageCount = data.pages

      // console.log(this.articleList)
    },
    articleDetail(id) {
      this.$router.push('/articleDetail/' + id)
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  display: flex;
  flex-direction: column;
  position: relative;
}
.container {
  display: flex;
  flex-direction: column;
  flex: 1 1 60%;
  position: relative;
}
.slide {
  display: flex;
  flex-direction: column;
  flex: 1 1 40%;
}
.showArticle {
  position: relative;
  height: 200px;
  width: 100%;
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
    position: relative;
    display: block;
    font-size: 30px;
    width: 470px;
    margin-left: 20px;
    height: 45px;
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
    display: none;
    position: absolute;
    top: 50px;
    right: 20px;
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
    line-height: 30px;
    margin-top: 30px;
    margin-left: 20px;
  }
}

.showArticle:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.el-pagination {
  margin-top: 50px;
  margin-left: 0;
}

.search {
  width: 100%;
}

.searchResult {
  z-index: 10;
  position: absolute;
  margin-top: 5px;
  width: 100%;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 2%;
  padding: 0;
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;
  ul {
    list-style-type: none;
    padding-left: 0;
    margin: 0;
    cursor: pointer;
  }
  li {
    line-height: 50px;
    height: 50px;
    padding-left: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}

.hot {
  position: relative;
  margin-top: 300px;
  margin-left: 0;
  ul {
    list-style-type: none;
    padding-left: 0;
    margin: 0;
    cursor: pointer;
  }
  li {
    height: 130px;
    padding-left: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;
    h1 {
      width: 180px;
      display: block;
      margin-left: 150px;
      position: absolute;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    img {
      border-radius: 10px;
      margin-top: 20px;
      background-color: #000;
      width: 140px;
      height: 90px;
    }
    span {
      position: absolute;
      margin-top: 60px;
      margin-left: 10px;
    }
  }
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

@media (min-width: 900px) {
  .el-container {
    flex-direction: row;
  }
  .slide {
    margin-left: 50px;
  }
  .hot {
    margin-top: 300px;
  }
}

@media (min-width: 500px) {
  .showArticle > img {
    display: block;
  }
}
</style>
