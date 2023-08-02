//参数校验中间件
import { validationResult } from 'express-validator';
export default (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ code: 1, message: errors.array() });
    }
    next();
}