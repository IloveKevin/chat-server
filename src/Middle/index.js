import bodyParserJson from './bodyParser-json'
import realIp from './real-ip'
import rateLimit from './rate-limit'

export default (app) => {
    bodyParserJson(app)
    realIp(app)
    rateLimit(app)
}