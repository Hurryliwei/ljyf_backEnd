
const Koa = require('koa')
const InitManager = require('./core/init')
const parser = require('koa-bodyparser')
const catchError = require('./middlewares/exception')
const app = new Koa()

 // bodyParser 就是为了处理每个 Request 中的信息，要放到路由前面先让他处理再进路由
app.use(parser())
// 使用的自定义中间件 用来捕获全局异常
app.use(catchError)
//  入口方法 初始化的方法 包括路由的改造 这里就是进入路由了
InitManager.initCore(app)
app.listen(3000)



// 好的代码
// 阅读 利于维护  提高编程效率
// 编程 根据主题 拆分 成不同文件

// 数据的类型进行主题划分
// 主题 是渐进式划分的 

// 客户端兼容性 老版本 新版本
// V1 V2 V3支持三个版本
// api 携带版本号

// 1.加到路径中
// 2.查询参数
// 3.header