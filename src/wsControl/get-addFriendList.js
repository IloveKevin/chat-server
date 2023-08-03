import code from "../common/code";
import db from "../db";
import msgBase from "../msgBase";

export default (wss) => {
    wss.eventListeners.on(code.getAddFriendList.code, (ws, msg) => {
        let userId = ws.id;
        db('tb_friend').where({ friend_id: userId, state: 1 }).select('friend_id').then((friendList) => {
            ws.send(JSON.stringify(new msgBase(code.getAddFriendList.code, code.getAddFriendList.state.success, friendList)));
        });
    });
}