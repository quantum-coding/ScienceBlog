// 引入mongoose第三方模块
const mongoose = require("mongoose");

//创建评论规则集合
const commentMsgSchema = new mongoose.Schema({
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
        type: Date,
    },
    content: {
        type: String,
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    new: {
        type: Boolean
    }
});

//创建评论集合
const CommentMsg = mongoose.model("CommentMsg", commentMsgSchema);

module.exports = {
    CommentMsg
};