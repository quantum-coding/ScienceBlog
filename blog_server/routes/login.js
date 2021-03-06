// 引入express框架
var express = require('express')
var router = express.Router()
const createToken = require('../model/token')
const bcrypt = require('bcrypt')

//引入用户集合构造函数
const { Users } = require('../model/users')

// 实现登陆功能
router.post('/', async(req, res) => {
    // 获取请求体中的对象
    const { email, password } = req.body
    let user = await Users.findOne({ email })

    if (user) {
        let isEqual = await bcrypt.compare(password, user.password)
        if (isEqual) {
            req.body.meta = {
                'msg': '登录成功',
                'status': 200,
                'username': user.username,
                'avatar': user.avatar_img,
                'userId': user.id
            }

            // 为用户分配一个token值
            let token = createToken(user.id)
            req.body.meta.token = token
            res.send(req.body.meta)
        } else {
            req.body.meta = {
                'msg': '密码错误',
                'status': 400
            }
            res.send(req.body.meta)
        }
    } else {
        req.body.meta = {
            'msg': '用户名不存在',
            'status': 404
        }
        res.send(req.body.meta)
    }
})

module.exports = router