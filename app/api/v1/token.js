const Router = require('koa-router')
const {
    TokenValidator,
    NotEmptyValidator
} = require('../../validator/validator')
const {
    LoginType
} = require('../../lib/enum')
const {
    User
} = require('../../models/user')
const {
    generateToken
} = require('../../../core/util')
const {
    Auth
} = require('../../../middlewares/auth')
const {
    WXManager
} = require('../../services/wx')
const { result } = require('lodash')
const router = new Router({
    prefix: '/v1/token'
})
router.post('/', async (ctx) => {
    let token;
    const v = await new TokenValidator().validate(ctx)
    // 业务逻辑
    // 1.api接口里编写
    // 2.Model 分层
    // 
    if (v.get('body.type') == LoginType.USER_EMAIL) {
        token = await emailLogin(v.get('body.account'), v.get('body.secret'))
    }
    if (v.get('body.type') == LoginType.USER_MINI_PROGRAM) {
        token = await WXManager.codeToToken(v.get('body.account'))
    }
    ctx.body = {
        token
    }
})
router.post('/verify', async (ctx) => {
    const v = await new NotEmptyValidator().validate(ctx)
    const result = Auth.verifyToken(v.get('body.token'))
    ctx.body={
        is_valid:result
    }
})

async function emailLogin(account, secret) {
    const user = await User.verifyEmailPassword(account, secret)
    return generateToken(user.id, Auth.USER)
}


module.exports = router