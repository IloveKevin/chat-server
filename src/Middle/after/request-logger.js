export default function (req, res, next) {
    console.log(`请求地址：${req.url}，请求方法：${req.method},请求参数：${JSON.stringify(req.body)}`);
    next();
}