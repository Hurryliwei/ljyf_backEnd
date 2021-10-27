const {
    Movie,
    Sentence,
    Music
} = require('../models/classic')
// 定义一个类 
// 这个类用来判断 我们获取的是哪个类型的 哪个期刊
// 接受两个参数 一个id 一个类型
// 就可以唯一的锁定是哪个东西
class Art {
    static async getData(art_id, type) {
        const finder = {
            where: {
                id: art_id
            }
        }
        let art = null
        switch (type) {
            case 100:
                art = await Movie.findOne(finder)
                break;
            case 200:
                art = await Music.findOne(finder)
                break;
            case 300:
                art = await Sentence.findOne(finder)
                break;
            case 400:
                break;
            default:
                break;
        }
        return art
    }
}

module.exports = {
    Art
}