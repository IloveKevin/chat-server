import code from "../common/code";
import db from "../db";
import msgBase from "../msgBase";
import { onlineUsers } from "../users";

export default (wss) => {
    wss.eventListeners.on(code.handleAddFriendRequest.code, async (ws, msg) => {
        let userId = ws.id;
        const { friendId, agree } = msg.data;
        let addFriend = await db('tb_add_friend').where({ user_id: friendId, friend_id: userId }).first();
        if (!addFriend) return ws.send(JSON.stringify(new msgBase(code.handleAddFriendRequest.code, code.handleAddFriendRequest.state.fail)));
        await db('tb_add_friend').where({ user_id: friendId, friend_id: userId }).del();
        let friend = await db('tb_friend').where({ user_id: userId, friend_id: friendId }).orWhere({ user_id: friendId, friend_id: userId }).first();
        if (friend) {
            ws.send(JSON.stringify(new msgBase(code.handleAddFriendRequest.code, code.handleAddFriendRequest.state.isFriend)));
        }
        else {
            ws.send(JSON.stringify(new msgBase(code.handleAddFriendRequest.code, code.handleAddFriendRequest.state.success, { friendId })));
            let friendWs = onlineUsers.find((item) => item.id == friendId);
            if (agree) {
                await db('tb_friend').insert({ user_id: userId, friend_id: friendId });
                let friend = await db('tb_user').where({ id: friendId }).select('nickname').first();
                ws.send(JSON.stringify(new msgBase(code.addFriendResponce.code, code.addFriendResponce.state.success, { friendId: friendId, friendName: friend.nickname, friendIsOnline: friendWs != undefined })));
                if (friendWs) {
                    let user = await db('tb_user').where({ id: userId }).select('nickname').first();
                    friendWs.send(JSON.stringify(new msgBase(code.addFriendResponce.code, code.addFriendResponce.state.success, { friendId: userId, friendName: user.nickname, friendIsOnline: true })));
                }
            }
            else {
                if (friendWs) {
                    let user = await db('tb_user').where({ id: userId }).select('nickname').first();
                    friendWs.send(JSON.stringify(new msgBase(code.addFriendResponce.code, code.addFriendResponce.state.fail, { friendId: userId, friendName: user.nickname })));
                }
            }
        }
    });
}