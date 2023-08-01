import express from 'express';
import middle from './src/Middle';
import wss from './src/webSocketServer';
import router from './src/router';

// 定义一个express实例
const app = express();
//使用中间件
middle(app);

// 设置trust proxy为true
app.set('trust proxy', true);

// 使用路由
router(app);

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

export default app;