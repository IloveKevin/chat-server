import code from "../common/code";
import db from "../db";
import msgBase from "../msgBase";
import { onlineUsers } from "../users";

export default (wss) => {
    wss.eventListeners.on(code.getFriendList.code, async (ws, msg) => {
        let userId = ws.id;
        let friendIds = await db('tb_friend').where({ user_id: userId }).select('friend_id');
        let friendList = await db('tb_user').whereIn('id', friendIds.map((item) => item.friend_id));
        friendList.forEach((item) => {
            item.online = onlineUsers.indexOf(item.id) !== -1;
        });
        ws.send(JSON.stringify(new msgBase(code.getFriendList.code, code.getFriendList.state.success, friendList)));
    });
}