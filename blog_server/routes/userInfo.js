// 引入express框架
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");

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

//引入用户集合构造函数
const { Users } = require("../model/users");

router.get("/:id", async(req, res) => {
    // 获取路由携带的Id
    const _id = req.params.id;

    let user = await Users.findOne({ _id: _id });

    if (user) {
        req.body.meta = {
            email: user.email,
            username: user.username,
            password: user.password,
            age: user.age,
            sex: user.sex,
            borndate: user.borndate,
            hobbies: user.hobbies,
            motto: user.motto
        };
        res.send(req.body.meta);
    }
});

router.post("/:id", async(req, res) => {
    const { email, borndate, password, age, sex, username, hobbies, motto } = req.body;
    // 获取路由携带的Id
    const _id = req.params.id;

    let user = await Users.findOne({ _id: _id });

    if (user) {
        await Users.updateMany({ _id: _id }, {
            email: email,
            username: username,
            password: password,
            age: age,
            sex: sex,
            borndate: borndate,
            hobbies: hobbies,
            motto: motto,
        });
    }
});

module.exports = router;