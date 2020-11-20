// 引入mongoose第三方模块
const mongoose = require("mongoose")
    // 创建用户集合规则
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});
//创建用户集合
const Users = mongoose.model("Users", userSchema)

module.exports = {
    Users
}