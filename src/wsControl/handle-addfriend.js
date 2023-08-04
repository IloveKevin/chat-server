import code from "../common/code";
import db from "../db";
import msgBase from "../msgBase";
import { onlineUsers } from "../users";

export default (wss) => {
    wss.eventListeners.on(code.handleAddFriendRequest.code, async (ws, msg) => {
        let userId = ws.id;
        const { friendId, agree } = msg.data;

        let friendState = await db('tb_friend').where({ user_id: userId, friend_id: friendId }).select('state').first();
        if (friendState === undefined) return ws.send(JSON.stringify(new msgBase(code.handleAddFriendRequest.code, code.handleAddFriendRequest.state.fail)));

        if (friendState === 2) {
            ws.send(JSON.stringify(new msgBase(code.handleAddFriendRequest.code, code.handleAddFriendRequest.state.isFriend)));
        }
        else {
            await db('tb_friend').where({ user_id: userId, friend_id: friendId }).update({ state: agree ? 2 : 0 });
            ws.send(JSON.stringify(new msgBase(code.handleAddFriendRequest.code, code.handleAddFriendRequest.state.success, { friendId })));
            if (!agree) return;
            let user = onlineUsers.find((item) => item.id === friendId);
            if (user) {
                user.send(JSON.stringify(new msgBase(code.addFriendResponce.code, code.addFriendResponce.state.success)));
            }
        }
    });
}