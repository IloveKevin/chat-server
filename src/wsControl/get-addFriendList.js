import code from "../common/code";
import db from "../db";
import msgBase from "../msgBase";

export default (wss) => {
    wss.eventListeners.on(code.getAddFriendListRequest.code, async (ws, msg) => {
        let userId = ws.id;
        let addFriendList = await db('tb_friend').where({ user_id: userId, state: 1 }).select('friend_id');
        addFriendList = await db('tb_user').whereIn('id', addFriendList.map((item) => item.friend_id)).select('id', 'nickname');
        ws.send(JSON.stringify(new msgBase(code.getAddFriendListRequest.code, code.getAddFriendListRequest.state.success, addFriendList)));
    });
}