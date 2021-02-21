<template>
  <div
    class="container"
    v-infinite-scroll="debounce"
    infinite-scroll-disabled="false"
    :infinite-scroll-distance="distance"
  >
    <ul>
      <li
        class="showArticle"
        v-for="item in this.articleList"
        :key="item.id"
        @click="articleDetail(item._id)"
      >
        <h1>{{ item.title }}</h1>
        <span>{{ item.publishDate }}</span>
      </li>
    </ul>
    <div v-if="loading" class="show">
      <div class="loading"><img src="../../assets/loading.gif" />加载中...</div>
    </div>
    <div v-if="noMore" class="show">
      <div class="noMore">没有更多了</div>
    </div>
  </div>
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
      loading: false,
      noMore: false,
      // 当前的页码
      currentPage: 1,
      totalPages: 1,
      authorId: '',
      timer: '',
      distance: 0
    }
  },
  created() {
    this.getArticles()
  },
  watch: {
    articleList: function() {
      const that = this
      that.$nextTick(function() {
        that.timer = '1'
      })
    }
  },
  methods: {
    debounce() {
      if (this.timer) {
        clearTimeout(this.timer)
        return (this.timer = setTimeout(() => {
          this.load()
        }, 2000))
      }
    },
    load() {
      this.loading = true
      if (this.currentPage < this.totalPages) {
        setTimeout(async () => {
          this.currentPage += 1
          await this.$http
            .post(`/article/${this.authorId}`, {
              currentPage: this.currentPage
            })
            .then(res => {
              this.articleList = this.articleList.concat(res.data.records)
              console.log(this.articleList)
            })
        }, 500)
      } else {
        this.loading = false
        this.noMore = true
        this.timer = ''
      }
    },
    async getArticles() {
      // 获取用户Id
      this.authorId = window.sessionStorage.getItem('userId')
      const { data } = await this.$http.post(`/article/${this.authorId}`, {
        currentPage: this.currentPage
      })
      console.log(data)
      this.articleList = data.records
      if (data.size >= 3) {
        this.loading = true
      }
      this.totalPages = data.pages
      if (this.articleList.length == 0 || this.articleList.length < 3) {
        this.loading = false
        this.noMore = true
      }
    },
    articleDetail(id) {
      this.$router.push('/articleDetail/' + id)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 600px;
  width: 100%;
  overflow: auto;
}

ul {
  width: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  li {
    margin-left: 0;
  }
}
.showArticle {
  position: relative;
  height: 150px;
  width: 100%;
  border: 1px solid #eee;
  padding: 0;
  background-color: #fff;
  cursor: pointer;

  h1 {
    position: relative;
    display: block;
    font-size: 25px;
    margin-left: 20px;
    margin-bottom: 20px;
  }

  span {
    position: absolute;
    margin: 20px 20px;
  }
}

.showArticle:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.show {
  background-color: #fbfbfb;
  box-sizing: border-box;
  width: 100%;
}

.loading,
.noMore {
  width: 100px;
  display: flex;
  align-items: center;
  height: 50px;
  margin: 0 auto;
}

.loading > img {
  width: 40px;
  height: 40px;
}
</style>
