const {
    Sequelize,
    Model
} = require('sequelize')
const {
    sequelize
} = require('../../core/db')
const {
    Art
} = require('./art')
class Favor extends Model {
    // 业务表 静态方法 点赞和取消点赞
    static async like(art_id, type, uid) {
        // 查询是否存在点赞的数据
        const favor = await Favor.findOne({
            where: {
                art_id,
                type,
                uid
            }
        })
        // 如果存在就抛出异常
        // 这里一定检查favor是否是await得到的数据 不然会一直提示已存在数据 
        // 要将异步操作变为同步操作 缺少await 判断一定是错的
        if (favor) {
            throw new global.errs.LikeError()
        }
        // transaction 事务 sequelize对事务的操作一定是要进行return 返回的 
        // 不return 是无法将数据写入数据库的
        return sequelize.transaction(async t => {
            await Favor.create({
                art_id,
                type,
                uid
            }, {
                transaction: t
            })
            const art = await Art.getData(art_id, type)
            await art.increment('fav_nums', {
                by: 1,
                transaction: t
            })
        })
    }
    static async dislike(art_id, type, uid) {
        const favor = await Favor.findOne({
            where: {
                art_id,
                type,
                uid
            }
        })
        if (!favor) {
            throw new global.errs.DislikeError()
        }
        return sequelize.transaction(async t => {
            await favor.destroy({
                force: true,
                transaction: t
            })
            const art = await Art.getData(art_id, type)
            await art.decrement('fav_nums', {
                by: 1,
                transaction: t
            })
        })
    }
}
// 数据库表 字段的初始化
// init两个参数
// 第一个是字段参数 （对象类型）
// 第二个是数据库的连接对象(对象类型) 包含:实例化后的sequelize 就是db连接方式和一些配置文件
// 以及创建的表的名称
Favor.init({
    uid: Sequelize.INTEGER,
    art_id: Sequelize.INTEGER,
    type: Sequelize.INTEGER,
}, {
    sequelize,
    tableName: 'favor'
})
// 最后需要导出这个对象 以方便在api中调用这个对象里面的方法进行操作数据库
module.exports = {
    Favor
}