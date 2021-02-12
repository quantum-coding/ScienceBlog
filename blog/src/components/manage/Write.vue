<template>
  <el-container>
    <el-header>
      <div><i class="arrow-left" @click="back"></i></div>
      <div class="title_bar">
        <el-input
          :placeholder="date"
          class="title"
          v-model="publishArticle.title"
          maxlength="100"
          show-word-limit
        >
        </el-input>
      </div>
      <div class="button_box">
        <el-button type="primary" plain @click="keepDraft">保存草稿</el-button>
        <el-button type="primary" @click="showDialogForm">发布文章</el-button>
      </div>
    </el-header>
    <el-main>
      <mavon-editor
        v-model="content"
        @imgAdd="imgAdd"
        @imgDel="imgDel"
        ref="md"
      />
    </el-main>
    <el-dialog title="文章发布" :visible.sync="tipsVisible">
      您的文章是否要保存为草稿？
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDraft">取 消</el-button>
        <el-button type="primary" @click="keepAndBack">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="文章发布" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="添加标签:" label-width="100px">
          <el-tag
            :key="tag"
            v-for="tag in this.dynamicTags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
            :disabled="disabled"
            >+ New Tag</el-button
          >
        </el-form-item>
        <el-form-item label="选择分类:" label-width="100px">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择封面:" label-width="100px">
          <input type="file" id="file" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialogForm">取 消</el-button>
        <el-button type="primary" @click="publish">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import marked from 'marked'
import axios from 'axios'

export default {
  data() {
    return {
      content: '', // 写文章时的内容
      // 用于接收内容被转化为html格式的文件
      publishArticle: {
        coverImg: '',
        title: '',
        publishdate: '',
        variety: '',
        tags: [],
        author: '',
        content: ''
      },
      img_file: [],
      dialogFormVisible: false,
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      options: [
        {
          value: '1',
          label: '前端'
        },
        {
          value: '2',
          label: '后端'
        },
        {
          value: '3',
          label: '运维'
        },
        {
          value: '4',
          label: '运营'
        },
        {
          value: '5',
          label: '游戏开发'
        }
      ],
      value: '',
      disabled: false,
      // 输入框的日期
      date: '',
      draft: {
        title: '',
        content: '',
        uid: ''
      },
      // 判断该文章是新写的还是之前的草稿
      isDraft: false,
      // 判断草稿是否保存
      iskept: false,
      tipsVisible: false,
      draftId: ''
    }
  },
  created() {
    const myDate = new Date()
    const yy = myDate.getFullYear()
    const mm = (myDate.getMonth() + 1 + '').padStart(2, '0')
    const dd = (myDate.getDate() + '').padStart(2, '0')
    this.date = `${yy}-${mm}-${dd}`

    this.getDraft()
  },
  // beforeRouteEnter在调用的时候，组件实例尚未被创建出来，要在next中获取组件实例
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 获取草稿细节
      if (from.path == '/draftBox') {
        vm.getDraft()
        vm.isDraft = true
      }
    })
  },
  methods: {
    keepAndBack() {
      this.keepDraft()
      this.$router.push('/newArticle')
    },
    async getDraft() {
      const id = this.$route.params.id
      const { data: res } = await this.$http.get(`/draft/draftDetail/${id}`)
      console.log(res)
      this.publishArticle.title = res.title
      this.content = res.content
      // 设置草稿Id
      window.sessionStorage.setItem('draftId', res._id)

      this.draftId = window.sessionStorage.getItem('draftId')
    },
    async keepDraft() {
      // 保存草稿或如果标题为空，那么就用日期代替
      if (this.publishArticle.title == '') {
        this.publishArticle.title = this.date
      }
      this.draft.title = this.publishArticle.title
      this.draft.content = this.content
      this.draft.uid = window.sessionStorage.getItem('userId')

      // 获取草稿的Id
      this.draftId = window.sessionStorage.getItem('draftId')

      console.log(this.draftId)

      this.iskept = true

      this.isDraft = true

      if (this.img_file.length !== 0) {
        await this.uploadImg().then(res => {
          this.draft.content = res
        })
      }

      const { data } = await this.$http.post(
        `/draft/${this.draftId}`,
        this.draft
      )

      this.$message.success('已保存至草稿箱')

      this.$router.push(`/draftDetail/${data._id}`)

      window.sessionStorage.setItem('draftId', data._id)

      // 确定草稿已经保存
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      // 如果标签少于3个则可以添加标签
      if (this.dynamicTags.length < 3) {
        this.disabled = false
      }
    },

    showInput() {
      // 如果标签达到3个则禁止添加标签
      if (this.dynamicTags.length >= 3) {
        this.disabled = true
        this.$message.error('最多只能添加3个标签')
        return
      }
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },

    back() {
      if (this.iskept === false) {
        this.tipsVisible = true
      } else {
        this.$router.push('/newArticle')
        window.sessionStorage.removeItem('draftId')
      }
    },

    cancelDraft() {
      this.$router.push('/newArticle')
    },
    async showDialogForm() {
      // 文章标题不能为空
      if (this.publishArticle.title === '' || this.content === '') {
        return this.$message.error('标题或文章内容不能为空')
      }
      // if (this.img_file.length !== 0) {
      //   await this.uploadImg().then(res => {
      //     this.draft.content = res
      //   })
      // }
      this.dialogFormVisible = true
    },
    async publish() {
      if (this.img_file.length !== 0) {
        await this.uploadImg().then(res => {
          // 将内容转换为html格式,并获取
          this.publishArticle.content = marked(this.content)
        })
      }

      this.publishArticle.content = marked(this.content)
      // 获取发表日期
      this.publishArticle.publishdate = this.date
      // 获取文章分类
      this.publishArticle.variety = this.value
      // 获取文章标签
      this.publishArticle.tags = this.dynamicTags
      // 获取用户名
      this.publishArticle.author = window.sessionStorage.getItem('userId')

      var file = document.querySelector('#file')

      // 将文章封面图片转为base64
      await this.getBase64(file.files[0]).then(result => {
        this.publishArticle.coverImg = result
      })

      const { data } = await this.$http.post('/article', this.publishArticle)

      console.log(data)

      this.dialogFormVisible = false

      this.iskept = true

      this.$router.push(`/articleDetail/${data._id}`)

      // 如果该文章是之前写的草稿进行发布就删除草稿
      if (this.isDraft) {
        await this.$http.put(`/draft/${this.draftId}`)
        window.sessionStorage.setItem('draftId', '')
      }
    },

    getBase64(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        let imgResult = ''
        // 将图片转化为base64编码
        reader.readAsDataURL(file)
        reader.onload = function() {
          imgResult = reader.result
        }
        reader.onerror = function(error) {
          reject(error)
        }
        reader.onloadend = function() {
          resolve(imgResult)
        }
      })
    },
    imgAdd(index, file) {
      // 缓存图片信息,markdown的图片索引是从1开始的，因此数组的索引要减1
      this.img_file[index - 1] = file
      console.log(this.img_file)
    },
    imgDel(index) {
      this.img_file.pop(this.img_file[index - 1])
    },

    async uploadImg(e) {
      var formdata = new FormData()
      for (var _img in this.img_file) {
        formdata.append('file', this.img_file[_img])
      }

      // 将图片中的索引替换为资源路径从而实现图片资源外链访问
      //  this.$refs.md.$img2Url(index, url)

      await axios({
        url: '/article/upload_img',
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        /**
         * 例如：返回数据为 res = [[pos, url], [pos, url]...]
         * pos 为原图片标志（0）
         * url 为上传后图片的url地址
         */
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        const { data: urls } = res

        // console.log(urls)

        for (var url in urls) {
          this.$refs.md.$img2Url(url, urls[url])
          // this.$refs.md.$imgUpdateByUrl(url, urls[url])
        }
      })
      return this.content
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
}
.arrow-left {
  display: block;
  border-left: 3px solid #eee;
  border-top: 3px solid #eee;
  transform: rotate(-45deg);
  width: 20px;
  height: 20px;
  margin-left: 5px;
  cursor: pointer;
}
.title {
  width: 900px;
}
.button_box {
  .el-button {
    float: left;
  }
}
.el-form {
  padding-left: 0;
  margin-left: -20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
