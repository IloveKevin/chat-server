import { createToken, verifyToken } from "../token/jwt";
import db from "../db";
import { getToken, setToken } from "../token";
import msgBase from "../msgBase";
import config from "../config";
import code from "../common/code";
import { onlineUsers } from "../users";

//judge the user is online
const isOnline = (user) => {
    let onlineUser = onlineUsers.find((item) => item.id === user.id);
    if (onlineUser) {
        onlineUser.send(JSON.stringify(new msgBase(code.checkUserRequest.code, code.checkUserRequest.state.kick, "您的账号在其他地方登录，您已被迫下线")));
        onlineUser.close();
        onlineUsers.splice(onlineUsers.indexOf(onlineUser), 1);
    }
}

//用户token验证
export default (wss) => {
    wss.eventListeners.on(code.checkUserRequest.code, (ws, msg) => {
        const { token, refreshToken } = msg.data;
        //verify login token
        verifyToken(token, async (err, decoded) => {
            //login token error
            if (err) {
                //verify refresh token
                verifyToken(refreshToken, async (err, _decoded) => {
                    //refresh token error
                    if (err) {
                        ws.send(JSON.stringify(new msgBase(code.checkUserRequest.code, code.checkUserRequest.state.fail, "登录失败，token以及刷新token校验失败")));
                        ws.close();
                        return;
                    }
                    //refresh token success
                    //get user info
                    let user = await db('tb_user').where({ account: _decoded.account }).first();
                    //user not exist or refresh token not same or login token not same
                    if (!user || (getToken('refresh' + user.id) !== refreshToken) || getToken('login' + user.id) !== token) {
                        ws.send(JSON.stringify(new msgBase(code.checkUserRequest.code, code.checkUserRequest.state.fail, "登录失败，用户不存在或刷新token不正确")));
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
                    ws.send(JSON.stringify(new msgBase(code.checkUserRequest.code, code.checkUserRequest.state.success, { token: newToken, refreshToken: newRefreshToken })));
                    ws.login = true;
                    ws.id = user.id;
                });
            }
            else {
                //login token success
                //get user info
                let user = await db('tb_user').where({ account: decoded.account }).first();
                //user not exist or login token not same
                if (!user || getToken('login' + user.id) !== token) {
                    ws.send(JSON.stringify(new msgBase(code.checkUserRequest.code, code.checkUserRequest.state.fail, "登录失败，用户不存在或token不正确")));
                    ws.close();
                    return;
                }
                //judge have user is online
                isOnline(user);
                ws.send(JSON.stringify(new msgBase(code.checkUserRequest.code, code.checkUserRequest.state.success, { userName: user.nickname })));
                ws.login = true;
                ws.id = user.id;
            }
        });
    })
}