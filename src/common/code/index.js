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
            success: 200,//登录成功
            refresh: 201,//刷新token
            fail: 100,//登录失败
            kick: 101,//被踢下线
        }
    },
    getFriendList: {//获取好友列表
        code: 2,
        state: {
            success: 200,
            fail: 100,
        }
    },
    userOffline: {//用户下线
        code: 3,
        state: {
            success: 200,
        }
    },
    addFriend: {//添加好友请求
        code: 4,
        state: {
            success: 200,//请求添加成功
            repeat: 101,//重复添加
            isFriend: 100,//已经是好友
            refuse: 102,//拒绝添加
        }
    },
    handleAddFriend: {//处理添加好友请求
        code: 5,
        state: {
            success: 200,//添加成功
            fail: 100,//当前已经是好友
        }
    },
    getAddFriendList: {//获取添加好友列表
        code: 6,
        state: {
            success: 200,
            fail: 100,
        }
    },
}