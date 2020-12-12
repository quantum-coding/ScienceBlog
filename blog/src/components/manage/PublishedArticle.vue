<template>
  <div class="container">
    <div
      class="showArticle"
      v-for="item in this.articleList"
      :key="item.id"
      @click="articleDetail(item._id)"
    >
      <h1>{{ item.title }}</h1>
      <span>{{ item.author }} | {{ item.publishDate }}</span>
      <img :src="item.coverImg" alt="" />
      <div
        class="content"
        v-html="$options.filters.ellipsis(item.content)"
      ></div>
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
      articleList: []
    }
  },
  created() {
    this.getArticles()
  },
  methods: {
    async getArticles() {
      const { data } = await this.$http.get('/article')
      this.articleList = data
      console.log(this.articleList)
    },
    articleDetail(id) {
      this.$router.push('/articleDetail/' + id)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 700px;
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
    position: relative;
    display: block;
    font-size: 30px;
    margin-left: 20px;
    margin-bottom: 20px;
  }

  span {
    margin-left: 20px;
  }

  img {
    z-index: 999;
    position: absolute;
    float: right;
    margin-top: -40px;
    margin-left: 350px;
    background-color: #000;
    width: 150px;
    height: 100px;
    border-radius: 10px;
    border: 0;
  }

  .content {
    width: 450px;
    height: 30px;
    margin-top: 30px;
    margin-left: 20px;
    text-overflow: ellipsis;
  }
}

.showArticle:hover {
  background-color: rgba(0, 0, 0, 0.2);
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
