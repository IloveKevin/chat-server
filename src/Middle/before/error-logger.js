export default (err, req, res, next) => {
    console.log(`时间：${new Date().toLocaleString()}\n请求地址：${req.url}\n请求方法：${req.method}\n错误信息：${err.message}\n错误堆栈：${err.stack}`);
    return res.status(500).json({ code: 1, message: '服务器错误' });
};