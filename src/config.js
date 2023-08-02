export default {
    token: {
        login: '15m',
        refresh: '7d',
        key: '1j234g5678f90qdwertysuio1pasadfghcjkslzaxcvbnm'
    },
    sqlServer: {
        host: 'localhost',
        user: 'sa',
        password: '123456',
        options: {
            instanceName: 'SQLEXPRESS',
            database: 'chat',
        }
    },
    httpServer: {
        port: 3000,//端口
    },
    webSkctetServer: {
        port: 3001,//端口
        heartTime: 1000 * 60,//心跳检测时间
    }
}