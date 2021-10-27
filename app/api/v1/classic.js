const Router = require('koa-router')
const {
    Flow
} = require('../../models/flow')
const router = new Router({
    prefix: '/v1/classic'
})
const {
    Art
} = require('../../models/art')
const {
    Auth
} = require('../../../middlewares/auth')

//  获取最新一期的api
// 通过调用中间件以及flow实例的方法
// 来获取最新的一期 也就是index最大的时候
// 然后将对应的art_id和type拿到
// 在通过这两个值 来获取详细的信息
// 判断是movie就movie.findone 是music就music表里查
// 最后因为 我们这个数据结构里面需要index 字段
// 所以在数据打包的时候 将index也打包入art返回的json对象中
// 进行序列化
// 使用setDataValue的方法 将index字段以及值 存入返回的json中
router.get('/latest', new Auth().m, async (ctx, next) => {
    const flow = await Flow.findOne({
        order: [
            ['index', 'DESC']
        ]
    })
    const art = await Art.getData(flow.art_id, flow.type)
    art.setDataValue('index',flow.index)
    ctx.body = art
})


module.exports = router