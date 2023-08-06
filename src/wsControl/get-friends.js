import code from "../common/code";
import db from "../db";
import msgBase from "./base/msgBase";
import { onlineUsers } from "../users";

export default (wss) => {
    wss.eventListeners.on(code.getFriendListRequest.code, async (ws, msg) => {
        let userId = ws.id;
        let friends = await db('tb_friend').where({ user_id: userId }).orWhere({ friend_id: userId });
        let friendIds = [];
        friends.forEach((item) => {
            if (item.user_id == userId) friendIds.push({ friend_id: item.friend_id });
            else friendIds.push({ friend_id: item.user_id });
        });
        let friendList = await db('tb_user').whereIn('id', friendIds.map((item) => item.friend_id)).select('id', 'nickname');
        friendList.forEach((item) => {
            item.online = onlineUsers.findIndex(u => u.id == item.id) != -1;
        });
        ws.send(JSON.stringify(new msgBase(code.getFriendListRequest.code, code.getFriendListRequest.state.success, friendList)));
    });
}