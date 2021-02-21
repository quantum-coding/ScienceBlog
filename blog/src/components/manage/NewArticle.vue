<template>
  <div class="show_box">
    <p>每天博客写一篇，技术提升棒棒哒!</p>
    <el-button type='primary' @click="writeArticle">编辑新文章</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    writeArticle() {
      this.$router.push('/write')
    }
  }
}
</script>

<style lang="less" scoped>
.show_box {
  position: absolute;
  height: 800px;
  width: 100%;
  border: 1px solid #eee;
  border-radius: 2%;
  padding: 0;
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;
  -webkit-animation: fade-in 1s;
  p {
    font-weight: 700;
    font-size: 40px;
    padding-left: 40px;
    margin-top: 30px
  }
  .el-button {
    margin-left: 40px;
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
</style>
