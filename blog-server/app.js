// 引入express框架
const express = require('express')

// 创建网站服务器
const app = express()

const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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

app.listen(8888)
console.log('网站服务器启动成功')