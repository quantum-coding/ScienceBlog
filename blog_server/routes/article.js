// 引入express框架
var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");
const multer = require("multer");
var upload_config = require("config").get("upload_config");
const pagnation = require("mongoose-sex-page");

//引入用户集合构造函数
const { Article } = require("../model/article");

// 引入评论集合构造函数
const { Comment } = require("../model/comment");

router.post("/", async(req, res) => {
    const {
        coverImg,
        title,
        publishdate,
        variety,
        tags,
        author,
        content,
    } = req.body;
    let result = await Article.create({
        coverImg: coverImg,
        title: title,
        publishDate: publishdate,
        variety: variety,
        tags: tags,
        author: author,
        content: content,
    });
    res.send(result);
});

// 用户上传图片的路由
router.post("/upload_img", uploadFile, async(req, res) => {
    console.log(1)
    var urls = ["null"];
    for (var i in req.files) {
        var fileExtArray = req.files[i].originalname.split("."); // 将文件的名称用点分隔开
        var ext = fileExtArray[fileExtArray.length - 1]; // 获取文件的后缀名
        var targetPath = req.files[i].path + "." + ext;
        fs.rename(
            path.join(process.cwd(), req.files[i].path),
            path.join(process.cwd() + "/", targetPath),
            async function(err) {
                if (err) {
                    return res.send("文件上传失败");
                }
            }
        );
        // 要将目标文件夹的反斜杠替换为正斜杠，否则是无法外链访问的
        var targetPatharray = targetPath.split("\\");
        targetPath = targetPatharray[0]
        console.log(targetPath)
        targetPatharray.length = 0;
        urls.push("http://47.115.132.14:8888/" + targetPath);
        if (urls.length === req.files.length + 1) {
            req.body = urls;
            res.send(req.body);
        }
    }
});

function uploadFile(req, res, next) {
    //dest 值为文件存储的路径;single方法,表示上传单个文件,参数为表单数据对应的key
    let upload = multer({ dest: "article_img" }).array("file");
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("文件存储成功");
            next();
        }
    });
}

router.get("/getArticleList/:currentPage", async(req, res) => {
    const pageNumber = req.params.currentPage;
    let result = await pagnation(Article)
        .page(pageNumber)
        .size(10)
        .find()
        .sort({ publishDate: -1 })
        .populate("author")
        .exec();
    res.send(result);
});

router.get("/search/:searchContent", async(req, res) => {
    const searchContent = req.params.searchContent;
    let result = await pagnation(Article)
        .page()
        .size(10)
        .find({ title: { $regex: searchContent, $options: "$i" } })
        .populate("author")
        .exec();
    res.send(result);
});

router.get("/hotArticles", async(req, res) => {
    let result = await Article.find()
        .sort({ totalCount: -1 })
        .populate("author")
        .limit(5);
    res.send(result);
});

router.post("/getSearchedArticles", async(req, res) => {
    const { searchContent, searchPage } = req.body;
    let result = await pagnation(Article)
        .page(searchPage)
        .size(10)
        .find({ title: { $regex: searchContent, $options: "$i" } })
        .populate("author")
        .exec();
    res.send(result);
});

// 获取用户写的文章列表
router.post("/:id", async(req, res) => {
    // 获取文章的id
    const authorId = req.params.id;
    const { currentPage } = req.body;
    console.log(currentPage)
    let result = await pagnation(Article).page(currentPage).size(4).find({ author: authorId }).populate("author").exec();
    res.send(result);
});

// 获取文章详情列表
router.get("/articleDetail/:id", async(req, res) => {
    // 获取文章的id
    const id = req.params.id;
    // 根据id查找文章数据
    let article = await Article.findOne({ _id: id }).populate("author");
    // 获取评论数据
    let comments = await Comment.find({ aid: id })
        .sort({ time: -1 })
        .populate("uid");
    // 将文章数据赋给请求体
    req.body = { article, comments };
    res.send(req.body);
});

// 文章点赞功能
router.post("/articleDetail/addCount/:id", async(req, res) => {
    // 获取文章的id
    const id = req.params.id;
    const { totalCount, likeUsers } = req.body;
    // 根据文章id查找文章
    let article = await Article.findOne({ _id: id });
    if (article) {
        article.likeUsers.push(likeUsers);
        await Article.updateMany({ _id: id }, { totalCount: totalCount, likeUsers: article.likeUsers });
    }
    console.log(article);
    res.send(req.body);
});

// 取消点赞功能
router.put("/articleDetail/minusCount/:id", async(req, res) => {
    // 获取文章的id
    const id = req.params.id;
    const { totalCount, likeUsers } = req.body;
    // 根据文章id查找文章
    let article = await Article.findOne({ _id: id });
    if (article) {
        // 获取已点赞用户的索引
        let index = article.likeUsers.indexOf(likeUsers);
        article.likeUsers.splice(index, 1);
        await Article.updateMany({ _id: id }, { totalCount: totalCount, likeUsers: article.likeUsers });
    }
    res.send(req.body);
});

// 文章收藏功能
router.post("/articleDetail/addCollectCount/:id", async(req, res) => {
    // 获取文章的id
    const id = req.params.id;
    const { totalCount, collectUsers } = req.body;
    // 根据文章id查找文章
    let article = await Article.findOne({ _id: id });
    if (article) {
        article.collectUsers.push(collectUsers);
        await Article.updateMany({ _id: id }, { collectCount: totalCount, collectUsers: article.collectUsers });
    }
    console.log(article);
    res.send(req.body);
});

// 文章取消收藏
router.put("/articleDetail/minusCollectCount/:id", async(req, res) => {
    // 获取文章的id
    const id = req.params.id;
    const { totalCount, collectUsers } = req.body;
    // 根据文章id查找文章
    let article = await Article.findOne({ _id: id });
    if (article) {
        // 获取已点赞用户的索引
        let index = article.collectUsers.indexOf(collectUsers);
        article.collectUsers.splice(index, 1);
        await Article.updateMany({ _id: id }, { collectCount: totalCount, collectUsers: article.collectUsers });
    }
    res.send(req.body);
});

module.exports = router;