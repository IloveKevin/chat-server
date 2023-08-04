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
        //get need add friend info
        let friend = await db('tb_friend').where({ user_id: userId, friend_id: friendId }).select('id').first();
        if (friend) {
            await db('tb_friend').where({ id: friend.id }).update({ state: 2 });
        }
        else {
            await db('tb_friend').insert({ user_id: userId, friend_id: friendId, state: 2 });
        }
        //get need add friend has add me
        let friend2 = await db('tb_friend').where({ user_id: friendId, friend_id: userId }).first();
        if (friend2) {
            let _code;
            switch (friend2.state) {
                case 0:
                    _code = code.addFriendRequest.state.refuse;//用户已经拒绝过了
                    break;
                case 1:
                    _code = code.addFriendRequest.state.repeat;//重复添加
                    break;
                case 2:
                    _code = code.addFriendRequest.state.isFriend;//已经是好友了
            }
            ws.send(JSON.stringify(new msgBase(code.addFriendRequest.code, _code)));
        }
        else {
            await db('tb_friend').insert({ user_id: friendId, friend_id: userId, state: 1 });
            ws.send(JSON.stringify(new msgBase(code.addFriendRequest.code, code.addFriendRequest.state.success)));
            ws.send(JSON.stringify(new msgBase(code.addFriendResponce.code, code.addFriendResponce.state.success, { friendId: friendId })));
            let friendWs = onlineUsers.find((item) => item.id === friendId);
            if (friendWs) ws.send(JSON.stringify(new msgBase(code.newAddFriendRequest.code, { friendId: userId })));
        }
    });
}