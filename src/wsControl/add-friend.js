import code from "../common/code";
import db from "../db";
import { onlineUsers } from "../users";
import msgBase from "../msgBase";

export default (wss) => {
    wss.eventListeners.on(code.addFriendRequest.code, async (ws, msg) => {
        //get user id
        let userId = ws.id;
        //get need add friend id
        let friendId = msg.data.friendId;
        if (userId == friendId) return ws.send(JSON.stringify(new msgBase(code.addFriendRequest.code, code.addFriendRequest.state.addSelf)));

        let friend = await db('tb_friend').where({ user_id: userId, friend_id: friendId }).orWhere({ user_id: friendId, friend_id: userId }).first();

        if (friend) {
            ws.send(JSON.stringify(new msgBase(code.addFriendRequest.code, code.addFriendRequest.state.isFriend)));
        }
        else {
            let addFriend = await db('tb_add_friend').where({ user_id: userId, friend_id: friendId }).first();
            if (addFriend) return ws.send(JSON.stringify(new msgBase(code.addFriendRequest.code, code.addFriendRequest.state.repeat)));
            await db('tb_add_friend').insert({ user_id: userId, friend_id: friendId });
            ws.send(JSON.stringify(new msgBase(code.addFriendRequest.code, code.addFriendRequest.state.success)));
            let friendWs = onlineUsers.find((item) => item.id == friendId);
            if (friendWs) {
                let user = await db('tb_user').where({ id: userId }).select('nickname').first();
                friendWs.send(JSON.stringify(new msgBase(code.newAddFriendRequest.code, 0, { friendId: userId, friendName: user.nickname })));
            }
        }
    });
}