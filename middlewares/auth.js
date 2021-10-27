const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
class Auth {
    constructor(level) {
        this.level = level || 1
        Auth.USER = 8
        Auth.ADMIN = 16
        Auth.USER_MiNI = 32
    }

    get m() {
        return async (ctx, next) => {
            const userToken = basicAuth(ctx.req)
            let errMsg = 'token不合法'
            if (!userToken || !userToken.name) {
                throw new global.errs.Forbidden(errMsg)
            }
            try {
                var decode = jwt.verify(userToken.name, global.config.security.secretKey)
            } catch (error) {
                // token不合法
                // token过期
                if (error.name == 'TokenExpiredError') {
                    errMsg = 'token过期'
                }
                throw new global.errs.Forbidden(errMsg)
            }
            if(decode.scope < this.level){
                throw new global.errs.Forbidden('权限不足')
            }
            ctx.auth = {
                uid: decode.uid,
                scope: decode.scope
            }
            await next()
        }
    }

    static verifyToken(token){
        try {
            jwt.verify(token, global.config.security.secretKey)
            return true
        } catch (error) {
            return false
        }
    }
}
module.exports = {
    Auth
}