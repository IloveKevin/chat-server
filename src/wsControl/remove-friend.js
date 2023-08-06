import code from "../common/code";
import msgBase from "./base/msgBase";
import db from "../db";
import { onlineUsers } from "../users";

export default (wss) => {
    wss.eventListeners.on(code.removeFriendRequest.code, async (ws, msg) => {
        let userId = ws.id;
        let { friendId } = msg.data;
        let friend = await db('tb_friend').where({ user_id: userId, friend_id: friendId }).orWhere({ user_id: friendId, friend_id: userId }).first();
        if (!friend) {
            ws.send(JSON.stringify(new msgBase(code.removeFriendRequest.code, code.removeFriendRequest.state.fail, "删除好友失败，您不是该好友的好友")));
            return;
        }
        await db('tb_friend').where({ user_id: userId, friend_id: friendId }).orWhere({ user_id: friendId, friend_id: userId }).del();
        ws.send(JSON.stringify(new msgBase(code.removeFriendRequest.code, code.removeFriendRequest.state.success, "删除好友成功")));
        let friendWs = onlineUsers.find((item) => item.id == friendId);
        if (friendWs) {
            friendWs.send(JSON.stringify(new msgBase(code.removeFriendResponce.code, 0, { friendId: userId, message: "对方已将您从好友列表中删除" })));
        }
    });
}