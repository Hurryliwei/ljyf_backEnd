const requireDirector = require('require-directory')
const Router = require('koa-router')

class InitManager {
    // InitManager的第一个静态方法
    // 入口方法
    // 这里将所有要在启动时执行的方法写入这个方法中进行调用
    static initCore(app) {
        // app就是实例化的koa对象
        // 将koa传入 用koa来挂载方法 调用方法
        InitManager.app = app
        InitManager.initLoadRouters()
        InitManager.loadHttpException()
        InitManager.loadConfig()
    }
    // InitManager的第二个静态方法
    //  用来改写路由的
    static initLoadRouters() {
        // 通过绝对路径 获取到所有这个路径下面的router
        // 然后利用这个中间件 进行导入 监听一个方法
        // 每当发现一个router 判断是Router之后就进行路由挂载
        // 这样路由就可以全部被app.use()了
        const apiDirectory = `${process.cwd()}/app/api`
        requireDirector(module, apiDirectory, {
            visit: whenLoadModule
        })

        function whenLoadModule(obj) {
            if (obj instanceof Router) {
                InitManager.app.use(obj.routes())
            }
        }
    }
        // 增加静态方法
    // 导入这个模块 作为loadConfig
    static loadConfig(path = ''){
        const configPath = path || process.cwd()+'/config/config.js'
        const config = require(configPath)
        global.config = config
    }
    // 第三个静态方法，用来全局定义错误信息
    static loadHttpException() {
        // errors 是一个定义好的异常处理的类
        // 这个异常处理的类里面包含了很多方法
        // HttpException ParameterException都是异常处理类里面的方法
        // 这里global反而是一个全局的类
        // 这个类的errs对象 接受了我们写好的所有的异常方法
        // 所以调用global.errs.XXX类即可调用对应的方法
        // 也就是说 我们调用这个方法
        //  将私有的httpException这个class里所有的方法
        //  挂载到了全局类的对象中 导致全局（global.errs）都可以使用这些方法
        const errors = require('./http-exception')
        global.errs = errors
    }
}
module.exports = InitManager