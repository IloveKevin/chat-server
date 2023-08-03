import code from "../common/code";
import db from "../db";
import { onlineUsers } from "../users";
import msgBase from "../msgBase";

export default (wss) => {
    wss.eventListeners.on(code.addFriend.code, (ws, msg) => {
        let userId = ws.id;
        let friendId = msg.data.friendId;
        db('tb_friend').where({ user_id: userId, friend_id: friendId }).select('id').first().then((friend) => {
            if (friend) {
                db('tb_friend').where({ id: friend.id }).update({ state: 2 }).then(() => { });
            }
            else {
                db('tb_friend').insert({ user_id: userId, friend_id: friendId, state: 2 }).then(() => { });
            }

            db('tb_friend').where({ user_id: friendId, friend_id: userId }).first().then((friend) => {
                if (friend) {
                    let _code;
                    switch (friend.state) {
                        case 0:
                            _code = code.addFriend.state.refuse;//用户已经拒绝过了
                            break;
                        case 1:
                            _code = code.addFriend.state.repeat;//重复添加
                            break;
                        case 2:
                            _code = code.addFriend.state.isFriend;//已经是好友了
                    }
                    ws.send(JSON.stringify(new msgBase(code.addFriend.code, _code)));
                }
                else {
                    db('tb_friend').insert({ user_id: friendId, friend_id: userId, state: 1 }).then(() => {
                        ws.send(JSON.stringify(new msgBase(code.addFriend.code, code.addFriend.state.success, { friendId })));
                    });
                }
            });
        });
    });
}