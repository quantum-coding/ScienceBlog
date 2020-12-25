const jwt = require('jsonwebtoken')

module.exports = function(user_id) {
    var token = jwt.sign({ user_id: user_id }, "huangwenchuan", { expiresIn: '1d' })
    return token
}