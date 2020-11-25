// 引入express框架
var express = require("express");
var router = express.Router();

//引入用户集合构造函数
const { Users } = require("../model/users");

router.put("/:id", async(req, res) => {
    // 获取更新的图像的base64编码
    const { base64 } = req.body;
    // 获取路由携带的Id
    const _id = req.params.id;
    // 根据用户id查找用户
    let user = await Users.findOne({ _id: _id });
    // 如果用户的id存在就更新用户头像数据，否则发送用户未找到
    if (user) {
        await Users.updateOne({ _id: _id }, { avatar_img: base64 });
        req.body.meta = { msg: "头像更新成功", status: 200 };
        res.send(req.body.meta);
    } else {
        req.body.meta = { msg: "头像更新失败", status: 400 };
        res.send(req.body.meta);
    }
});

module.exports = router;