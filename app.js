import express from 'express';
import afterMidle from './src/middle/after';
import beforeMidle from './src/middle/before';
import wss from './src/webSocketServer';
import router from './src/router';
import config from './src/config';

// 定义一个express实例
const app = express();
//使用前置中间件
afterMidle(app);

// 设置trust proxy为true
app.set('trust proxy', true);

// 使用路由
router(app);

// 使用后置中间件
beforeMidle(app);

app.listen(config.httpServer.port, () => {
    console.log(`Server listening on port ${config.httpServer.port}!`);
});

export default app;