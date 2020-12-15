// 引入express框架
var express = require("express");
var router = express.Router();

//引入用户集合构造函数
const { Comment } = require("../model/comment");

router.post("/", async(req, res) => {
    const { aid, uid, content } = req.body;
    await Comment.create({
        aid: aid,
        uid: uid,
        content: content,
        time: new Date(),
    })

    res.redirect(`/routes/article/articleDetail/${aid}`)
});

module.exports = router;