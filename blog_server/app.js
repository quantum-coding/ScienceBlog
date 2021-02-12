// 引入express框架
const express = require("express");

// 创建网站服务器
const app = express();

const bodyParser = require("body-parser");

var path = require("path");

app.use(express.static(path.join(__dirname, "dist")))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/article_img", express.static("article_img"));

// app.use(function(req, res, next) {
//     if (req.url !== "/login" && req.url !== "/register") {
//         let token = req.headers.authorization;
//         let result = jwt.verifyToken(token, "huangwenchuan", { expiresIn: '60s' })
//         console.log(result)
//         next()
//     }
// });

//解决前端跨域问题
app.all("*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, mytoken");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization");
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
    );
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", " 3.2.1");
    if (req.method == "OPTIONS") {
        res.send(200);
    } else {
        next();
    }
});

// app.use(function(req, res, next) {
//     let token = req.headers.authorization;
//     jwt.verify(token, "huangwenchuan", function(err, decode) {
//         if (err) {
//             res.send("无效token");
//         } else {
//             next();
//         }
//     });
// });

// // 实现登陆功能
// app.post('/login', (req, res) => {
//     req.data = req.body.config
//     res.send(req.body)
// })

// 连接数据库
require("./model/connect");

// 引入登陆验证模块
const loginRouter = require("./routes/login");

// 当发送登陆请求时调用验证模块
app.use("/routes/login", loginRouter);

// 引入注册模块
const registerRouter = require("./routes/register");

// 当发送注册请求时调用注册模块
app.use("/routes/register", registerRouter);

// 引入头像上传模块
const avatarRouter = require("./routes/avatar");

// 当发送头像上传请求时调用头像上传模块
app.use("/routes/avatar", avatarRouter);

// 引入用户信息获取模块模块
const userInfoRouter = require("./routes/userInfo");

// 当获取用户信息时调用该模块
app.use("/routes/userInfo", userInfoRouter);

// 引入文章上传模块模块
const articleRouter = require("./routes/article");

// 当发布文章时调用该模块
app.use("/routes/article", articleRouter);

// 引入评论上传模块
const commentRouter = require("./routes/comment");

// 当上传评论时调用该模块
app.use("/routes/comment", commentRouter);

// 引入草稿上传模块
const draftRouter = require("./routes/draft");

// 当上传草稿时调用该模块
app.use("/routes/draft", draftRouter);

// 引入消息模块
const messageRouter = require("./routes/message");

// 当上传草稿时调用该模块
app.use("/routes/message", messageRouter);

app.listen(8888, () => {
    console.log("sever running at http://localhost");
});
console.log("网站服务器启动成功");