export default {
    serverError: {//服务器错误
        code: -1,
    },
    heartPing: {//心跳包
        code: 0,
        state: {
            success: 200,
        }
    },
    checkUser: {//检查用户是否存在
        code: 1,
        state: {
            success: 200,
            refresh: 201,
            fail: 100,
        }
    },
}