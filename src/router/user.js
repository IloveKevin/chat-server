import express from 'express';
import { createToken } from '../token/jwt';
import { body } from 'express-validator';
import paramterValidation from '../middle/other/parameterValidation';
import config from '../config';
import db from '../db'
import { setToken } from '../token';

const router = express.Router();

router.post('/login', [
    body('account')
        .isString()
        .withMessage('账号必须是字符串')
        .isLength({ min: 6, max: 12 })
        .withMessage('账号长度必须小于12位，大于6位'),
    body('password')
        .isString()
        .withMessage('密码必须是字符串')
        .isLength({ min: 6, max: 12 })
        .withMessage('密码长度必须小于12位，大于6位'),
    paramterValidation
], async (req, res, next) => {
    try {
        // 获取请求体中的用户名和密码
        const { account, password } = req.body;
        if (!account || !password) {
            // 如果用户名或密码为空，则返回错误信息
            return res.json({ code: 1, message: '用户名或密码不能为空' });
        }
        let user = await db('tb_user').where({ account, password }).first();
        if (user) {
            // 登录成功，生成 JWT 令牌
            const token = createToken(user, config.token.login);
            // 生成刷新令牌
            const refreshToken = createToken(user, config.token.refresh);
            // 将令牌保存在内存中
            setToken('login' + user.id, token);
            setToken('refresh' + user.id, refreshToken);
            return res.json({ code: 0, message: '登录成功', token, refreshToken });
        } else {
            return res.json({ code: 1, message: '登录失败' });
        }
    } catch (err) {
        next(err);
    }
});

router.post('/register', [
    body('account')
        .isString()
        .withMessage('账号必须是字符串')
        .isLength({ min: 6, max: 12 })
        .withMessage('账号长度必须shi小于12位，大于6位'),
    body('password')
        .isString()
        .withMessage('密码必须是字符串')
        .isLength({ min: 6, max: 12 })
        .withMessage('密码长度必须小于12位，大于6位'),
    paramterValidation
], async (req, res, next) => {
    try {
        const { account, password } = req.body;
        if (!account || !password) {
            return res.json({ code: 1, message: '用户名或密码不能为空' });
        }
        let user = await db('tb_user').where({ account }).first();
        if (user) {
            return res.json({ code: 1, message: '用户名已存在' });
        }
        let nickname = '用户' + Math.floor(Math.random() * 1000000);
        await db('tb_user').insert({ account, password, nickname })
        return res.json({ code: 0, message: '注册成功' });
    } catch (err) {
        next(err);
    }
});


export default router;