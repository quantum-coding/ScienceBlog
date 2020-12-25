// 引入mongoose第三方模块
const mongoose = require('mongoose')

// 创建草稿规则集合
const draftSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    // 写草稿用户的id
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    date: {
        type: Date
    }
})

// 创建文章集合
const Draft = mongoose.model('Draft', draftSchema)

module.exports = {
    Draft
}