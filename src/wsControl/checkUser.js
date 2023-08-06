import { createToken, verifyToken } from "../token/jwt";
import db from "../db";
import { getToken, setToken } from "../token";
import msgBase from "./base/msgBase";
import config from "../config";
import code from "../common/code";
import { onlineUsers } from "../users";
import requestBase from "./base/request-base";
import senderBase from "./base/sender-base";

//judge the user is online
const isOnline = (user) => {
    let onlineUser = onlineUsers.find((item) => item.id == user.id);
    if (onlineUser) {
        let sender = new senderBase(onlineUser);
        sender.send({ code: code.checkUserRequest.code, state: code.checkUserRequest.state.kick, data: "您的账号在其他地方登录，您已被迫下线" });
        onlineUser.close();
        onlineUsers.splice(onlineUsers.indexOf(onlineUser), 1);
    }
}

const userOnlie = async (ws) => {
    let friends = await db('tb_friend').where({ user_id: ws.id }).orWhere({ friend_id: ws.id });
    let friendIds = [];
    friends.forEach((item) => {
        if (item.user_id == ws.id) friendIds.push(item.friend_id);
        else friendIds.push(item.user_id);
    });
    onlineUsers.forEach((item) => {
        if (friendIds.find((friendId) => friendId == item.id)) {
            let sender = new senderBase(item);
            sender.send({ code: code.feiendOnlineResponce.code, data: ws.id });
        }
    })
}

//用户token验证
export default (wss) => {
    new requestBase({
        wss: wss,
        code: code.checkUserRequest.code,
        callback: (ws, msg) => {
            const { token, refreshToken } = msg.data;
            let userSender = new senderBase(ws);
            //verify login token
            verifyToken(token, async (err, decoded) => {
                //login token error
                if (err) {
                    //verify refresh token
                    verifyToken(refreshToken, async (err, _decoded) => {
                        //refresh token error
                        if (err) {
                            userSender.send({ code: code.checkUserRequest.code, state: code.checkUserRequest.state.fail, data: "登录失败，token以及刷新token校验失败" });
                            ws.close();
                            return;
                        }
                        //refresh token success
                        //get user info
                        let user = await db('tb_user').where({ account: _decoded.account }).first();
                        //user not exist or refresh token not same or login token not same
                        if (!user || (getToken('refresh' + user.id) != refreshToken) || getToken('login' + user.id) != token) {
                            userSender.send({ code: code.checkUserRequest.code, state: code.checkUserRequest.state.fail, data: "登录失败，用户不存在或刷新token不正确" });
                            ws.close();
                            return;
                        }
                        //judge have user is online
                        isOnline(user);
                        //create new token and refresh token
                        let newToken = createToken(user, config.token.login);
                        let newRefreshToken = createToken(user, config.token.refresh);
                        setToken('login' + user.id, newToken);
                        setToken('refresh' + user.id, newRefreshToken);
                        userSender.send({ code: code.checkUserRequest.code, state: code.checkUserRequest.state.success, data: { token: newToken, refreshToken: newRefreshToken, userName: user.nickname, userId: user.id } });
                        ws.login = true;
                        ws.id = user.id;
                        userOnlie(ws);
                    });
                }
                else {
                    //login token success
                    //get user info
                    let user = await db('tb_user').where({ account: decoded.account }).first();
                    //user not exist or login token not same
                    if (!user || getToken('login' + user.id) != token) {
                        userSender.send({ code: code.checkUserRequest.code, state: code.checkUserRequest.state.fail, data: "登录失败，用户不存在或token不正确" });
                        ws.close();
                        return;
                    }
                    //judge have user is online
                    isOnline(user);
                    ws.send(JSON.stringify(new msgBase(code.checkUserRequest.code, code.checkUserRequest.state.success, { userName: user.nickname, userId: user.id })));
                    ws.login = true;
                    ws.id = user.id;
                    userOnlie(ws);
                }
            });
        }
    });
}