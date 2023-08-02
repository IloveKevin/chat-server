export default (err, req, res, next) => {
    console.log(`请求地址：${req.url}，请求方法：${req.method}，错误信息：${err.message},错误堆栈：${err.stack}`);
    return res.status(500).json({ code: 1, message: '服务器错误' });
};