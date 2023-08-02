// 自定义中间件：获取真实的客户端IP地址
function getRealIp(req, res, next) {
    const forwardedFor = req.header('X-Forwarded-For');
    req.realIp = forwardedFor ? forwardedFor.split(',')[0] : req.ip;
    next();
}

export default getRealIp;