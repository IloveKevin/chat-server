import { createToken, verifyToken } from "../jwt";
import db from "../db";
import { getToken, setToken } from "../token";
import msgBase from "../msgBase";
import config from "../config";

//用户token验证
export default (wss) => {
    wss.eventListeners.on(1, (ws, msg) => {
        const { token, refreshToken } = msg.data;
        verifyToken(token, (err, decoded) => {
            if (err) {
                verifyToken(refreshToken, (err, _decoded) => {
                    if (err) {
                        ws.send(JSON.stringify(new msgBase(1, 100, "登录失败")));
                        ws.close();
                        return;
                    }
                    let user = db('tb_user').where({ username: _decoded.username }).first();
                    if (!user || (getToken('refresh' + user.id) !== refreshToken)) {
                        ws.send(JSON.stringify(new msgBase(1, 100, "登录失败")));
                        ws.close();
                        return;
                    }
                    let newToken = createToken(user, config.token.login);
                    let newRefreshToken = createToken(user, config.token.refresh);
                    setToken('login' + user.id, newToken);
                    setToken('refresh' + user.id, newRefreshToken);
                    ws.send(JSON.stringify(new msgBase(1, 201, { token: newToken, refreshToken: newRefreshToken })));
                    ws.login = true;
                });
                return;
            }
            let user = db('tb_user').where({ username: decoded.username }).first();
            if (!user || user.token !== token) {
                ws.send(JSON.stringify(new msgBase(1, 100, "登录失败")));
                ws.close();
                return;
            }
            ws.send(JSON.stringify(new msgBase(1, 200, "登录成功")));
            ws.login = true;
        });
    })
}