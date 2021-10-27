function isThisType(val) {
    for (let key in this) {
        if (this[key] == val) {
            return true
        }
    }
    return false
}
// 这里牛逼的
// 对象中包含一个方法
// 方法里直接this[key]得到的就是 100 101 102
// 然后判断这个值 与传入的 body.type是否相等
// 如果相等 说明传入的参数是对的
// 反向达成了枚举的目的
// 利用了对象的key value属性 以及this的妙用
// this指的就是当前的对象
// key就是登录方式
// value就是对应的类型数字
const LoginType = {
    USER_MINI_PROGRAM: 100,
    USER_EMAIL: 101,
    USER_MOBILE: 102,
    isThisType
}
module.exports = {
    LoginType
}