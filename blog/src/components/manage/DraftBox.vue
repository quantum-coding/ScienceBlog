<template>
  <div class="container">
    <!-- <div
      class="showDraft"
      v-for="item in this.draftList"
      :key="item.id"
      @click="showDraftDetail(item._id)"
    >
      <h1>{{ item.title }}</h1>
      <div class="content">{{ item.content }}</div>
    </div> -->
    <el-card>
      <el-table :data="draftList" style="width: 100%">
        <el-table-column label="日期" width="300">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{
              scope.row.date | dateFormat
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文章标题" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-count="pageCount"
        @current-change="change"
        :current-page.sync="currentPage"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="删除草稿" :visible.sync="dialogVisible">
      您确定要删除草稿？
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      draftList: [],
      dialogVisible: false,
      draftId: '',
      pageCount: 1,
      currentPage: 1
    }
  },
  created() {
    this.getDraftList()
  },
  updated() {
    this.getDraftList()
  },
  methods: {
    async getDraftList() {
      const id = window.sessionStorage.getItem('userId')
      const { data: res } = await this.$http.get(`/draft?id=${id}&currentPage=${this.currentPage}`)
      console.log(res)
      this.draftList = res.records
      this.pageCount = res.pages
    },
    handleEdit(index, row) {
      this.$router.push(`/draftDetail/${row._id}`)
    },
    async handleDelete(index, row) {
      this.dialogVisible = true
      this.draftId = row._id
    },
    cancel() {
      this.dialogVisible = false
    },
    async confirm() {
      this.dialogVisible = false
      await this.$http.put(`/draft/${this.draftId}`)
    },
    change() {
      this.getDraftList()
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 400px;
}

.el-card {
  height: 100%;
}

.el-pagination {
  display: block;
  width: 100px;
  margin: 30px auto;
}
</style>
