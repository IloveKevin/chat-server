import rateLimit from 'express-rate-limit';

// 限制所有路由每分钟最多5次请求
const rateLimitMiddleware = rateLimit({
    windowMs: 60 * 1000, // 1分钟
    max: 5, // 限制每分钟最多5次请求
    handler: (req, res) => {
        return res.status(429).json({ code: 1, message: '请求过于频繁，请稍后再试' });
    }
});

export default (app) => app.use(rateLimitMiddleware);