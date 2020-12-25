// 引入mongoose第三方模块
const mongoose = require("mongoose");

//创建评论规则集合
const commentSchema = new mongoose.Schema({
    // 文章的id
    aid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
    },
    // 评论用户的id
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    time: {
        type: Date
    },
    content: {
        type: String
    },
    new: {
        type: Boolean
    }
});

//创建评论集合
const Comment = mongoose.model("Comment", commentSchema);

module.exports = {
    Comment
};