// 引入express框架
var express = require("express");
var router = express.Router();

//引入用户集合构造函数
const { Comment } = require("../model/comment");

const { Article } = require("../model/article");

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

router.post("/", async(req, res) => {
    const { aid, uid, content } = req.body;
    await Comment.create({
        aid: aid,
        uid: uid,
        content: content,
        time: new Date(),
        new: true,
    });

    res.redirect(`/routes/article/articleDetail/${aid}`);
});

router.get("/:id", async(req, res) => {
    const authorId = req.params.id;
    console.log(authorId);
    let articleIds = [];
    articleIds = await Article.find({ author: authorId }, { _id: 1 });
    for (articleId in articleIds) {
        console.log(articleIds[articleId]._id);
    }

});
module.exports = router;