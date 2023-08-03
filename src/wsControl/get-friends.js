import code from "../common/code";
import db from "../db";
import msgBase from "../msgBase";
import { onlineUsers } from "../users";

export default (wss) => {
    wss.eventListeners.on(code.getFriendList.code, (ws, msg) => {
        let userId = ws.id;
        db('tb_friend').where({ user_id: userId }).select('friend_id').then((friendList) => {
            db('tb_user').whereIn('id', friendList.map((item) => item.friend_id)).then((friendList) => {
                friendList.forEach((item) => {
                    item.online = onlineUsers.indexOf(item.id) !== -1;
                });
                ws.send(JSON.stringify(new msgBase(code.getFriendList.code, code.getFriendList.state.success, friendList)));
            })
        });
    });
}