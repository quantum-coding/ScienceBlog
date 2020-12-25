// 引入express框架
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");

//引入用户集合构造函数
const { Users } = require("../model/users");

router.use(function(req, res, next) {
    let token = req.headers.authorization;
    jwt.verify(token, "huangwenchuan", function(err, decode) {
        if (err) {
            res.send("无效token");
        } else {
            next();
        }
    });
});

router.post("/:id", async(req, res) => {
    // 获取更新的图像的base64编码
    const { base64 } = req.body;
    // 获取路由携带的Id
    const _id = req.params.id;
    // 根据用户id查找用户
    let user = await Users.findOne({ _id: _id });
    // 如果用户的id存在就更新用户头像数据，否则发送用户未找到
    if (user) {
        await Users.updateOne({ _id: _id }, { avatar_img: base64 });
        req.body = { msg: "头像更新成功", status: 200 };
        res.send(req.body);
    } else {
        req.body = { msg: "头像更新失败", status: 400 };
        res.send(req.body);
    }
});

module.exports = router;