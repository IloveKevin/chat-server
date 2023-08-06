class requestBase {
    constructor({ wss, code, callback }) {
        if (!wss) throw new Error('wss is undefined');
        if (code == undefined || code == null) throw new Error('code is undefined');
        if (callback == undefined || callback == null) throw new Error('callback is undefined');
        wss.eventListeners.on(code, callback);
    }
}

export default requestBase;