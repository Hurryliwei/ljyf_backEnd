const Router = require('koa-router')
const router = new Router()


router.get('/v1/book/book', (ctx, next) => {
    ctx.body = 'book'
})


module.exports = router