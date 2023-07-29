import express from 'express';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import wss from './src/webSocketServer';
import router from './src/router';

// 定义一个express实例
const app = express();
// 使用body-parser中间件
app.use(bodyParser.json());

// 限制所有路由每分钟最多5次请求
app.use(rateLimit({
    windowMs: 60 * 1000, // 1分钟
    max: 5, // 限制每分钟最多5次请求
    handler: (req, res) => {
        return res.status(429).json({ code: 1, message: '请求过于频繁，请稍后再试' });
    }
}));

// 使用路由
router(app);

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

export default app;