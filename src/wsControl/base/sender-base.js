import msgBase from "./msgBase";
class senderBase {
    constructor(ws) {
        if (!ws) throw new Error('ws is undefined');
        this.ws = ws;
    }
    send({ code, state = 0, data }) {
        this.ws.send(JSON.stringify(new msgBase(code, state, data)));
    }
}

export default senderBase;