import code from "../common/code";
import db from "../db";
import msgBase from "../msgBase";
import { onlineUsers } from "../users";

export default (wss) => {
    wss.eventListeners.on(code.handleAddFriend.code, async (ws, msg) => {
        let userId = ws.id;
        let friendId = msg.data.friendId;

        let friend = await db('tb_friend').where({ user_id: userId, friend_id: friendId }).first();

        const { id, state } = friend;
        if (state === 2) {
            ws.send(JSON.stringify(new msgBase(code.handleAddFriend.code, code.handleAddFriend.state.fail)));
        }
        else {
            await db('tb_friend').where({ id }).update({ state: 2 });
            let user = onlineUsers.find((item) => item.id === friendId);
            if (user) {
                user.send(JSON.stringify(new msgBase(code.addFriend.code, code.addFriend.state.success)));
            }
            ws.send(JSON.stringify(new msgBase(code.handleAddFriend.code, code.handleAddFriend.state.success, { friendId })));
        }
    });
}