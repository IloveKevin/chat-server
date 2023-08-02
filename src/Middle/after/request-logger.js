export default function (req, res, next) {
    console.log(`时间：${new Date().toLocaleString()}\n请求地址：${req.url}\n请求方法：${req.method}\n请求参数：${JSON.stringify(req.body)}`);
    next();
}