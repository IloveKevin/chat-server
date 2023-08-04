//参数校验中间件
import { validationResult } from 'express-validator';
export default (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.json({ code: 1, message: result.errors[0].msg });
    }
    next();
}