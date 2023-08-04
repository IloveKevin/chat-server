import code from "../common/code";
import db from "../db";
import msgBase from "../msgBase";

export default (wss) => {
    wss.eventListeners.on(code.getAddFriendList.code, async (ws, msg) => {
        let userId = ws.id;
        let addFriendList = await db('tb_friend').where({ user_id: userId, state: 0 }).select('friend_id');
        ws.send(JSON.stringify(new msgBase(code.getAddFriendList.code, code.getAddFriendList.state.success, addFriendList)));
    });
}