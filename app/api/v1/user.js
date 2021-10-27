const Router = require('koa-router')
const {
    User
} = require('../../models/user')
const router = new Router({
    prefix: '/v1/user'
})
const {
    RegisterValidator
} = require('../../validator/validator')
const success = require('../../lib/helper')
// 注册
router.post('/register', async (ctx) => {
    // 中间件 顺序很重要 很重要
    // new class()是把类进行实例化 每一次请求 都会实例化一个
    // 如果是中间件 那么只会在项目启动时候 实例化一次
    const v = await new RegisterValidator().validate(ctx)
    const user = {
        email: v.get('body.email'),
        password: v.get('body.password2'),
        nickname: v.get('body.nickname')
    }
    const r = await User.create(user)
    success()
})

module.exports = router