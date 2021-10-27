const bcrypt = require('bcryptjs')
const {
    sequelize
} = require('../../core/db')
const {
    Sequelize,
    Model
} = require('sequelize')
class User extends Model {
    static async verifyEmailPassword(email, plainPassword) {
        const user = await User.findOne({
            where: {
                email
            }
        })
        console.log(user)
        if (!user) {
            throw new global.errs.AuthFailed('账号不存在')
        }
        const correct = bcrypt.compareSync(plainPassword, user.password)
        if (!correct) {
            throw new global.errs.AuthFailed('密码不正确')
        }
        return user
    }

    // 查询微信用户
    static async getUserByOpenID(openid) {
        const user = await User.findOne({
            where: {
                openid
            }
        })
        return user
    }
    // 新增用户
    static async registerByOpenID(openid) {
        const user = await User.create({
            openid
        })
        return user
    }
}
// 在强制更改字段名称之后，一定一定要记得 把init的的字段名改成和数据库一模一样 
// 不然尽管你方法里的字段名是对的 但是init的时候 没有找到那个字段 
// 所有的增删改查方法
// 都找不到那个字段 也就无法将数据添加进去
// 总而言之 方法里的key要和init里面的key 以及数据库里面的key一模一样
// 我在这里用了强制办法 将字段名更改了下划线而不是驼峰 但是删除后 我没有再次执行让它返回原来的样子
// 所以在上面新增open_id的时候 不仅是字段名是错的,就连下面init方法里面也不对
// 我也是看到控制台进行model关联是才发现 不对劲的
User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nickname: Sequelize.STRING,
    email: {
        type: Sequelize.STRING(128),
        unique: true
    },
    password: {
        // 设计模式 观察者模式
        type: Sequelize.STRING,
        set(val) {
            const salt = bcrypt.genSaltSync(10)
            const psw = bcrypt.hashSync(val, salt)
            this.setDataValue('password', psw)
        }
    },
    openid: {
        type: Sequelize.STRING(128),
        unique: true
    }
}, {
    sequelize
})

module.exports = {
    User
}