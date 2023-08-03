import { createToken, verifyToken } from "../token/jwt";
import db from "../db";
import { getToken, setToken } from "../token";
import msgBase from "../msgBase";
import config from "../config";
import code from "../common/code";
import { onlineUsers } from "../users";

//用户token验证
export default (wss) => {
    wss.eventListeners.on(code.checkUser.code, (ws, msg) => {
        const { token, refreshToken } = msg.data;
        verifyToken(token, (err, decoded) => {
            if (err) {
                verifyToken(refreshToken, (err, _decoded) => {
                    if (err) {
                        ws.send(JSON.stringify(new msgBase(code.checkUser.code, code.checkUser.state.fail, "登录失败，token以及刷新token校验失败")));
                        ws.close();
                        return;
                    }
                    db('tb_user').where({ account: _decoded.account }).first().then((user) => {
                        if (!user || (getToken('refresh' + user.id) !== refreshToken) || getToken('login' + user.id) !== token) {
                            ws.send(JSON.stringify(new msgBase(code.checkUser.code, code.checkUser.state.fail, "登录失败，用户不存在或刷新token不正确")));
                            ws.close();
                            return;
                        }
                        let onlineUser = onlineUsers.find((item) => { item.account === user.account });
                        if (onlineUser) {
                            onlineUser.send(JSON.stringify(new msgBase(code.checkUser.code, code.checkUser.state.kick, "您的账号在其他地方登录，您已被迫下线")));
                            onlineUser.close();
                            onlineUsers.splice(onlineUsers.indexOf(onlineUser), 1);
                        }
                        let newToken = createToken(user, config.token.login);
                        let newRefreshToken = createToken(user, config.token.refresh);
                        setToken('login' + user.id, newToken);
                        setToken('refresh' + user.id, newRefreshToken);
                        ws.send(JSON.stringify(new msgBase(code.checkUser.code, code.checkUser.state.refresh, { token: newToken, refreshToken: newRefreshToken })));
                        ws.login = true;
                        ws.account = user.account;
                    }).catch((err) => {
                        ws.send(JSON.stringify(new msgBase(code.serverError.code, -1, "登录失败,服务器异常")));
                        ws.close();
                        return;
                    });
                });
                return;
            }
            db('tb_user').where({ account: decoded.account }).first().then((user) => {
                if (!user || getToken('login' + user.id) !== token) {
                    ws.send(JSON.stringify(new msgBase(code.checkUser.code, code.checkUser.state.fail, "登录失败，用户不存在或token不正确")));
                    ws.close();
                    return;
                }
                let onlineUser = onlineUsers.find((item) => item.account === user.account);
                if (onlineUser) {
                    onlineUser.send(JSON.stringify(new msgBase(code.checkUser.code, code.checkUser.state.kick, "您的账号在其他地方登录，您已被迫下线")));
                    onlineUser.close();
                    onlineUsers.splice(onlineUsers.indexOf(onlineUser), 1);
                }
                ws.send(JSON.stringify(new msgBase(code.checkUser.code, code.checkUser.state.success, "登录成功")));
                ws.login = true;
                ws.account = user.account;
            }).catch((err) => {
                ws.send(JSON.stringify(new msgBase(code.serverError.code, -1, "登录失败，服务器异常")));
                ws.close();
                return;
            });
        });
    })
}