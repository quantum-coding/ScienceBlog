// 引入express框架
var express = require("express")
const { userInfo } = require("os")
var router = express.Router()

//引入用户集合构造函数
const { Users } = require("../model/users")

router.post("/", async(req, res) => {
    const { email, username, password } = req.body
    let user = await Users.findOne({ email })

    if (!user) {
        await Users.create({
            email: email,
            username: username,
            password: password
        })
        req.body.meta = {
            msg: "注册成功",
            status: 200,
        }
        res.send(req.body.meta)
    } else if (email == user.email) {
        req.body.meta = {
            msg: "邮箱地址已存在",
            status: 404,
        }
        res.send(req.body.meta)
    }
});

module.exports = router