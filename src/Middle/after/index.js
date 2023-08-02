import bodyParserJson from './bodyParser-json'
import realIp from './real-ip'
import rateLimit from './rate-limit'
import requestLogger from './request-logger'

export default (app) => {
    app.use(realIp);
    app.use(bodyParserJson);
    // app.use(rateLimit);
    app.use(requestLogger);
}