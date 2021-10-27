const axios = require('axios')
const util = require('util')
const {
    User
} = require('../models/user')
const {
    generateToken
} = require('../../core/util')
const {
    Auth
} = require('../../middlewares/auth')
class WXManager {
    static async codeToToken(code) {
        const url = util.format(global.config.wx.loginUrl,
            global.config.wx.appID, global.config.wx.appSecret, code)
        const result = await axios.get(url)
        console.log(result.data)
        if (result.status !== 200) {
            throw new global.errs.AuthFailed('openid获取失败')
        }
        const errorCode = result.data.errcode
        const errorMsg = result.data.errMsg
        if (errorCode) {
            throw new global.errs.AuthFailed('openid获取失败' + errorMsg)
        }
        let user = await User.getUserByOpenID(result.data.openid)
        console.log(user)
        if (!user) {
            user = await User.registerByOpenID(result.data.openid)
        }
        return generateToken(user.id,Auth.USER_MINI)
    }
}
module.exports ={
    WXManager
}