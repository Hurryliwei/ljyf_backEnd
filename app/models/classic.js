const {
    sequelize
} = require('../../core/db')
const {
    Sequelize,
    Model
} = require('sequelize')
const classicFields = {
    image: Sequelize.STRING,
    content: Sequelize.STRING,
    pubdate: Sequelize.DATEONLY,
    fav_nums: Sequelize.STRING,
    title: Sequelize.STRING,
    type: Sequelize.TINYINT,
}
// 电影
class Movie extends Model {

}
Movie.init(classicFields, {
    sequelize,
    tableName: 'movie'
})
// Sentence句子
class Sentence extends Model {

}
Sentence.init(classicFields, {
    sequelize,
    tableName: 'Sentence'
})
// music
class Music extends Model {

}
Music.init(Object.assign({
    url: Sequelize.STRING
}, classicFields), {
    sequelize,
    tableName: 'Music'
})

module.exports = {
    Movie,
    Sentence,
    Music
}