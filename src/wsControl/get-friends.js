import code from "../common/code";
import db from "../db";
import msgBase from "../msgBase";
import { onlineUsers } from "../users";

export default (wss) => {
    wss.eventListeners.on(code.getFriendListRequest.code, async (ws, msg) => {
        let userId = ws.id;
        let friendIds = await db('tb_friend').where({ user_id: userId, state: 2 }).select('friend_id');
        let friendList = await db('tb_user').whereIn('id', friendIds.map((item) => item.friend_id)).select('id', 'nickname');
        friendList.forEach((item) => {
            item.online = onlineUsers.findIndex(u => u.id === item.id) !== -1;
        });
        ws.send(JSON.stringify(new msgBase(code.getFriendListRequest.code, code.getFriendListRequest.state.success, friendList)));
    });
}