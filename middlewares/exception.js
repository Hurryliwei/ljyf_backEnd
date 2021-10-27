const {
    HttpException
} = require("../core/http-exception")
// 这里说白了 就是捕获全局的异常 
// 然后返回给前端页面 几个参数 msg error_code request status
// 这里必须 必须 必须要写成promise形式的对象
// 必须要用async await 来进行监听
// 不使用这个异步编程函数 真的会监听不到error的抛出
// 所以 这里必须强制要求 箭头函数也是一个异步的 必须等到await有了返回值 再输出
// 这里 if判断主要是判断 error是否是一个HttpException类 具体这个类的方法 可以查询详细的文件
// 如果符合并且捕获到异常 那么返回的值就是ctx.body里面的
// 因为在这个HttpException类中已经定了返回的参数 
// 所以直接赋值即可。
const                                                                                                                                                                                                                                                                 catchError = async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        const isHttpException = error instanceof HttpException
        const isDev = global.config.environment === 'dev'
        if (isDev && !isHttpException) {
            throw error
        }
        // error 堆栈调用信息
        // error 应该简化 
        // http StatusCode 2XX,4XX,5XX
        if (isHttpException) {
            ctx.body = {
                // 前面是属性的名称
                // 后面是属性的值
                // 值是由类里面的构造方法确定的

                // 错误的信息
                msg: error.msg,
                // 错误码
                error_code: error.errorCode,
                // 请求的方法和请求的路径
                request: `${ctx.method} ${ctx.path}`
            }
            // 这就是请求的状态码 2XX 4XX 5XX 前端就是netWork里的HttpStatus
            ctx.status = error.code
        } else {
            ctx.body = {
                msg: 'we made a mistake',
                error_code: 999,
                request: `${ctx.method} ${ctx.path}`
            }
            ctx.status = 500
        }
        // message 
        // error_code 详细，开发者自己定义的 10001
        // request_url 当前请求的url

        // 已知型错误
        // 未知型错误  程序潜在的错误 无意识
    }
}

module.exports = catchError