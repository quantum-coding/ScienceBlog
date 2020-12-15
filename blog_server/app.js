// 引入express框架
const express = require('express')

// 创建网站服务器
const app = express()

const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/article_img', express.static('article_img'))

//解决前端跨域问题
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", '3.2.1')
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
})

// // 实现登陆功能
// app.post('/login', (req, res) => {
//     req.data = req.body.config
//     res.send(req.body)
// })

// 连接数据库
require('./model/connect')

// 引入登陆验证模块
const loginRouter = require('./routes/login')

// 当发送登陆请求时调用验证模块
app.use('/routes/login', loginRouter)

// 引入注册模块
const registerRouter = require('./routes/register')

// 当发送注册请求时调用注册模块
app.use('/routes/register', registerRouter)

// 引入头像上传模块
const avatarRouter = require('./routes/avatar')

// 当发送头像上传请求时调用头像上传模块
app.use('/routes/avatar', avatarRouter)

// 引入用户信息获取模块模块
const userInfoRouter = require('./routes/userInfo')

// 当获取用户信息时调用该模块
app.use('/routes/userInfo', userInfoRouter)

// 引入文章上传模块模块
const articleRouter = require('./routes/article')

// 当发布文章时调用该模块
app.use('/routes/article', articleRouter)

// 引入评论上传模块
const commentRouter = require('./routes/comment')

// 当上传评论时调用该模块
app.use('/routes/comment', commentRouter)

app.listen(8888, () => {
    console.log("sever running at http://127.0.0.1")
})
console.log('网站服务器启动成功')