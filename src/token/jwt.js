import Jwt from 'jsonwebtoken';
import { getToken } from '.';
import config from '../config';
const secretKey = config.token.key;

// 生成 JWT 令牌
const createToken = (user, expiresIn) => {
    return Jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn });
}

// 验证 JWT 令牌
const verifyToken = (token, callback) => {
    return Jwt.verify(token, secretKey, callback);
}

// 校验 JWT 令牌中间件
const verifyTokenMiddleware = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(403).json({ code: 1, message: '没有提供令牌' });
    }

    const token = authorization.replace('Bearer ', '');
    verifyToken(token, (err, decoded) => {
        if (err) {
            return res.status(401).json({ code: 1, message: '令牌无效' });
        }
        req.username = decoded.username;
        const savedToken = getToken('login' + decoded.id);
        if (savedToken !== token) {
            return res.status(401).json({ code: 1, message: '令牌无效' });
        }
        next();
    });
}

export { createToken, verifyToken, verifyTokenMiddleware };