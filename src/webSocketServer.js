import ws from 'ws';
import eventListeners from './eventListeners/eventListeners';
import heartPing from './wsControl/heartPing';
import checkUser from './wsControl/checkUser';
import getFriendList from './wsControl/get-friends';
import getAddFriendList from './wsControl/get-addFriendList';
import addFriend from './wsControl/add-friend';
import handleAddFriend from './wsControl/handle-addfriend';
import { onlineUsers } from './users';
import removeFriend from './wsControl/remove-friend';
import config from './config';
import msgBase from './wsControl/base/msgBase';
import code from './common/code';
import db from './db';

// 定义一个websocket服务器
const wss = new ws.Server({ port: config.webSocketServer.port });
console.log('websocket服务器启动成功，端口号: ', config.webSocketServer.port);

wss.eventListeners = new eventListeners();
heartPing(wss);
checkUser(wss);
getFriendList(wss);
getAddFriendList(wss);
addFriend(wss);
handleAddFriend(wss);
removeFriend(wss);

// 监听客户端连接事件
wss.on('connection', (client) => {
    // 将新连接的客户端添加到客户端列表中
    onlineUsers.push(client);
    //添加登录属性
    client.login = false;

    client.isPing = true;
    // 监听客户端消息事件
    client.on('message', async (message) => {
        try {
            message = JSON.parse(message.toString());
            console.log('收到消息: ', message);
            if (message.code != undefined && message.code != null) {
                await wss.eventListeners.emit(message.code, client, message);
            }
        }
        catch (err) {
            client.send(JSON.stringify(new msgBase(code.serverError.code, -1, "服务器异常")));
            console.log('在收到客户端消息处理时发生异常');
            console.log('异常信息: ', err.message);
            console.log('错误类型: ', err.name);
            console.log('错误堆栈: ', err.stack);
        }
    });
    // 监听客户端断开连接事件
    client.on('close', async () => {
        // 将断开连接的客户端移出客户端列表
        for (let i = 0; i < onlineUsers.length; i++) {
            if (onlineUsers[i] == client) {
                onlineUsers.splice(i, 1);
                //用户下线
                //查询出所有好友
                if (!client.login) return;
                let friends = await db('tb_friend').where({ friend_id: client.id }).orWhere({ user_id: client.id });
                let friendId = [];
                friends.forEach((friend) => {
                    if (friend.user_id == client.id) {
                        friendId.push(friend.friend_id);
                    }
                    else {
                        friendId.push(friend.user_id);
                    }
                });
                //查询出所有好友是否在线
                let onlineFriends = onlineUsers.filter((user) => friendId.includes(user.id));
                //给所有在线好友发送下线消息
                onlineFriends.forEach((friend) => {
                    friend.send(JSON.stringify(new msgBase(code.friendOfflineResponce.code, 0, client.id)));
                });
                return;
            }
        }
    });
});

//开启一个定时器，每隔一分钟检测所有用户是否发送心跳包
setInterval(() => {
    onlineUsers.forEach((client) => {
        if (client.isPing) return client.isPing = false;

        if (!client.login) return client.close(1008);

        return client.close(1011);
    });
}, config.webSocketServer.heartTime);

export default wss;