import code from "../common/code";
import db from "../db";
import { onlineUsers } from "../users";
import senderBase from "./base/sender-base";
import requestBase from "./base/request-base";

export default (wss) => {
    new requestBase({
        wss: wss,
        code: code.addFriendRequest.code,
        callback: async (ws, msg) => {
            //get user id
            let userId = ws.id;
            //get need add friend id
            let friendId = msg.data.friendId;
            let userSender = new senderBase(ws);
            if (userId == friendId) return userSender.send({ code: code.addFriendRequest.code, state: code.addFriendRequest.state.self });

            let friend = await db('tb_friend').where({ user_id: userId, friend_id: friendId }).orWhere({ user_id: friendId, friend_id: userId }).first();

            if (friend) {
                userSender.send({ code: code.addFriendRequest.code, state: code.addFriendRequest.state.isFriend });
            }
            else {
                let addFriend = await db('tb_add_friend').where({ user_id: userId, friend_id: friendId }).first();
                if (addFriend) return userSender.send({ code: code.addFriendRequest.code, state: code.addFriendRequest.state.isAddFriend });
                await db('tb_add_friend').insert({ user_id: userId, friend_id: friendId });
                userSender.send({ code: code.addFriendRequest.code, state: code.addFriendRequest.state.success });
                let friendWs = onlineUsers.find((item) => item.id == friendId);
                if (friendWs) {
                    let user = await db('tb_user').where({ id: userId }).select('nickname').first();
                    let sender = new senderBase(friendWs);
                    sender.send({ code: code.newAddFriendRequest.code, data: { friendId: userId, friendName: user.nickname } });
                }
            }
        }
    });
}