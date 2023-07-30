import msgBase from './msgBase';
import ws from 'ws';
import eventListeners from './eventListeners/eventListeners';
import heartPing from './wsControl/heartPing';
import checkUser from './wsControl/checkUser';
import { onlineUsers } from './users';
import code from './common/code';

// 定义一个websocket服务器
const wss = new ws.Server({ port: 8080 });
console.log('websocket服务器启动成功');
wss.sendMsg = (msg, ...clients) => {
    clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
            client.send(msg);
        }
    })
}
wss.eventListeners = new eventListeners();
heartPing(wss);
checkUser(wss);

// 监听客户端连接事件
wss.on('connection', (client) => {
    // 将新连接的客户端添加到客户端列表中
    onlineUsers.push(client);
    //添加登录属性
    client.login = false;
    //添加心跳包计数器
    client.pingCounter = {
        count: 0,
        max: 3,
        ping() {
            this.count++;
            console.log(this.count);
            if (this.count === this.max) {
                console.log('心跳包超时断开连接');
                client.close();
                return;
            }
            if (client.login) {
                console.log(client.login);
                client.send(JSON.stringify(new msgBase(code.heartPing.code, code.heartPing.state.success, '心跳包')));
            }
            if (client.readyState !== ws.OPEN) return;
        },
        clear() {
            this.count = 0;
        }
    };
    // 监听客户端消息事件
    client.on('message', (message) => {
        try {
            message = JSON.parse(message.toString());
            console.log('收到消息: ', message);
            if (message.code !== undefined && message.code !== null) {
                wss.eventListeners.emit(message.code, client, message);
            }
        }
        catch (err) {
            console.log('在收到客户端消息处理时发生异常');
            console.log('异常信息: ', err.message);
            console.log('错误类型: ', err.name);
            console.log('错误堆栈: ', err.stack);
        }
    });
    // 监听客户端断开连接事件
    client.on('close', () => {
        // 将断开连接的客户端移出客户端列表
        for (let i = 0; i < onlineUsers.length; i++) {
            if (onlineUsers[i] === client) {
                onlineUsers.splice(i, 1);
                break;
            }
        }
    });
});

//开启一个定时器，每隔5秒像所有客户端发送心跳包
setInterval(() => {
    onlineUsers.forEach((client) => {
        client.pingCounter.ping();
    });
}, 5000);

export default wss;