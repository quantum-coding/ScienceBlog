// 引入mongoose第三方模块
const mongoose = require("mongoose");

//创建文章规则集合
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    coverImg: {
        type: String,
    },
    publishDate: {
        type: String,
        required: true,
    },
    variety: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    totalCount: {
        type: String
    },
    likeUsers: {
        type: Array
    },
    collectCount: {
        type: String
    },
    collectUsers: {
        type: Array
    },
});

//创建文章集合
const Article = mongoose.model("Article", articleSchema);

module.exports = {
    Article
};