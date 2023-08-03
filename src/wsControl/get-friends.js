import code from "../common/code";
import db from "../db";
import msgBase from "../msgBase";

export default (wss) => {
    wss.eventListeners.on(code.getFriendList.code, (ws, msg) => {
        let userId = ws.id;
        db('tb_friend').where({ user_id: userId }).select('friend_id').then((friendList) => {
            ws.send(JSON.stringify(new msgBase(code.getFriendList.code, code.getFriendList.state.success, friendList)));
        })
    });
}