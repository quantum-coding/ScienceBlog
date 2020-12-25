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
const { CommentMsg } = require("../model/commentMsg");
// 上传新消息
router.post("/commentMsg", async(req, res) => {
    const { aid, content, uid, authorId } = req.body;

    CommentMsg.create({
        aid: aid,
        content: content,
        uid: uid,
        authorId: authorId,
        time: new Date(),
        new: true,
    });
});

router.get("/commentMsg/:authorId", async(req, res) => {
    const id = req.params.authorId;
    console.log(req.params.authorId);
    let commentMsg = await CommentMsg.find({ authorId: id })
        .sort({ time: -1 })
        .populate("aid")
        .populate("uid");
    res.send(commentMsg);
});

router.post("/hasReadcomMsg/:authorId", async(req, res) => {
    const id = req.params.authorId;
    console.log(req.params.authorId);
    await CommentMsg.find({ authorId: id }).updateMany({ new: false })
    res.send(commentMsg);
});

module.exports = router;