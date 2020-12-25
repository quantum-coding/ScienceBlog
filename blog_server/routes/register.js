// 引入express框架
var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");

//引入用户集合构造函数
const { Users } = require("../model/users");

router.post("/", async(req, res) => {
    const { email, username, password } = req.body;
    let user = await Users.findOne({ email });

    if (!user) {
        // 生成随机字符串
        let salt = await bcrypt.genSalt(10);
        // 进行加密
        let pass = await bcrypt.hash(password, salt);

        await Users.create({
            email: email,
            username: username,
            password: pass,
            avatar_img: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        });
        req.body.meta = {
            msg: "注册成功",
            status: 200,
        };
        res.send(req.body.meta);
    } else if (email == user.email) {
        req.body.meta = {
            msg: "邮箱地址已存在",
            status: 404,
        };
        res.send(req.body.meta);
    }
});

module.exports = router;