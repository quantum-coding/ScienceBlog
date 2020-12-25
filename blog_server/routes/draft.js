// 引入express框架
var express = require("express");
var router = express.Router();
const pagnation = require("mongoose-sex-page");

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

// 引入用户集合构造函数
const { Draft } = require("../model/draft");

router.post("/:id", async(req, res) => {
    // 获取草稿的id
    const id = req.params.id;
    const { title, content, uid } = req.body;

    if (id === "null") {
        let newDraft = await Draft.create({
            title: title,
            content: content,
            date: new Date(),
            uid: uid,
        });
        req.body = newDraft;
        res.send(req.body);
    } else {
        await Draft.updateMany({ _id: id }, { title: title, content: content });
        console.log("更新成功");
    }
});

router.get("/", async(req, res) => {
    // 获取用户的id
    const { id, currentPage } = req.query;
    let draftList = await pagnation(Draft)
        .page(currentPage)
        .size(5)
        .sort({ date: -1 })
        .find({ uid: id })
        .populate("uid")
        .exec();

    req.body = draftList;

    res.send(req.body);
});

router.get("/draftDetail/:id", async(req, res) => {
    // 获取草稿的id
    const id = req.params.id;
    let draft = await Draft.findOne({ _id: id });
    req.body = draft;
    res.send(req.body);
});

router.put("/:id", async(req, res) => {
    // 获取用户的id
    const id = req.params.id;
    // 查找草稿的Id并删除草稿
    await Draft.deleteOne({ _id: id });
});

module.exports = router;