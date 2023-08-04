export default {
    serverError: {//服务器错误
        code: -1,
    },
    heartPingRequest: {//心跳包请求
        code: 0,
    },
    checkUserRequest: {//检查用户是否存在
        code: 1,
        state: {
            success: 200,//登录成功
            refresh: 201,//刷新token
            fail: 100,//登录失败
        }
    },
    getFriendListRequest: {//获取好友列表
        code: 2,
        state: {
            success: 200,
            fail: 100,
        }
    },
    userOfflineRequest: {//用户下线
        code: 3,
        state: {
            success: 200,//正常下线成功
            kick: 201,//被踢下线
        }
    },
    addFriendRequest: {//添加好友请求
        code: 4,
        state: {
            success: 200,//请求添加成功
            repeat: 101,//重复添加
            isFriend: 100,//已经是好友
            refuse: 102,//对方以及拒绝过添加
        }
    },
    addFriendResponce: {//添加好友响应
        code: 5,
        state: {
            success: 200,//添加成功
            fail: 100,//拒绝添加
        }
    },
    newAddFriendRequest: {//新的添加好友请求
        code: 6,
    },
    removeFriendRequest: {//删除好友请求
        code: 7,
        state: {
            success: 200,//删除成功
            fail: 100,//删除失败
        }
    },
    removeFriendResponce: {//删除好友响应
        code: 8,
    },
    handleAddFriendRequest: {//处理添加好友请求
        code: 9,
        state: {
            success: 200,//处理成功
            fail: 100,//该好友请求不存在
            isFriend: 101,//已经是好友了
        }
    },
    getAddFriendListRequest: {//获取添加好友列表
        code: 10,
        state: {
            success: 200,
            fail: 100,
        }
    },
    feiendOnlineResponce: {//好友上线
        code: 11,
    },
    friendOfflineResponce: {//好友下线
        code: 12,
    },
}