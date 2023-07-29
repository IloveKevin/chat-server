export default class msgBase {
    constructor(code = 0, state = 200, data = null) {
        this.code = code;//0-心跳包
        this.state = state;//2XX-成功 1XX-失败
        this.data = data;
    }
}