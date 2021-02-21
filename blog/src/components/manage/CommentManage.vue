<template>
  <el-card>
    <el-badge :value="total" class="item" :hidden="hide">
      <el-button size="middle" @click="getNewCommentDetail">评论</el-button>
    </el-badge>
    <div class="showCommentMsg">
      <ul>
        <li v-for="item in this.commentMsgList" :key="item.id">
          <span class="info"
            ><p>{{ item.uid.username }}</p>
            于
            <p>{{ item.time | dateFormat }}</p>
            评论了你的文章:
            <p>{{ item.aid.title }}</p>
            :</span
          >
          <div class="msgContent">{{ item.content }}</div>
        </li>
      </ul>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      commentMsgList: [],
      commentDetail: [],
      total: 0,
      hide: true,
      authorId: ''
    }
  },
  created() {
    this.getNewComment()
  },
  methods: {
    async getNewComment() {
      this.authorId = window.sessionStorage.getItem('userId')
      const { data } = await this.$http.get(
        `message/commentMsg/${this.authorId}`
      )
      this.commentDetail = data
      console.log(this.commentDetail)
      // 查找评论消息中有没有新的消息
      for (var item in this.commentDetail) {
        if (data[item].new === true) {
          this.total += 1
        }
      }
      if (this.total !== 0) {
        this.hide = false
      }
      console.log(this.commentMsgList)
    },
    async getNewCommentDetail() {
      this.hide = true
      this.commentMsgList = this.commentDetail
      // 将新的评论消息设置为已读
      await this.$http.post(`message/hasReadcomMsg/${this.authorId}`)
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  width: 100%;
  height: 700px;
}

.showCommentMsg {
  margin-top: 20px;
  height: 100px;
}

.showCommentMsg ul {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 0;
}

.showCommentMsg ul li {
  width: 100%;
  height: 100px;
  font-size: 15px;
  padding-top: 10px;
  border-bottom: 1px solid #ccc;
}

.info {
  position: relative;
  margin-top: 20px;
}

.msgContent {
  margin-top: 10px;
  padding-left: 10px;
}

p {
  display: inline;
  color: #4e6ef2e6;
}
</style>
