import code from "../common/code";
import db from "../db";
import { onlineUsers } from "../users";
import msgBase from "../msgBase";

export default (wss) => {
    wss.eventListeners.on(code.getUserInfo.code, (ws, msg) => {
        let usersId = msg.data.usersId;
        let promises = [];
        usersId.forEach((userId) => {
            promises.push(db('tb_user').where({ id: userId }).select('id', 'nickName', 'avatar').first());
        });
        Promise.all(promises).then((userInfos) => {
            //过滤掉不存在的用户
            userInfos = userInfos.filter((userInfo) => userInfo);
            //设置在线状态
            userInfos.forEach((userInfo) => {
                let index = onlineUsers.findIndex((item) => item.id === userInfo.id);
                if (index !== -1) {
                    userInfo.online = true;
                }
            });
            ws.send(JSON.stringify(new msgBase(code.getUserInfo.code, code.getUserInfo.state.success, userInfos)));
        });
    });
}