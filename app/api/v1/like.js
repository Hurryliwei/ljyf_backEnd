const Router = require('koa-router')
const {
    Auth
} = require('../../../middlewares/auth')
const {
    LikeValidator
} = require('../../validator/validator')
const {
    Favor
} = require('../../models/favor')
const success = require('../../lib/helper')
const router = new Router({
    prefix: '/v1/like'
})
// 点赞的方法
router.post('/', new Auth().m, async ctx => {
    const v = await new LikeValidator().validate(ctx, {
        id: 'art_id'
    })
    await Favor.like(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid)
    success()
})
// 取消点赞的方法
router.post('/cancel', new Auth().m, async ctx => {
    const v = await new LikeValidator().validate(ctx, {
        id: 'art_id'
    })
    await Favor.dislike(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid)
    success()
})
module.exports = router