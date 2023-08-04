import code from "../common/code";
//心跳包处理
export default (wss) => {
    wss.eventListeners.on(code.heartPingRequest, (ws, msg) => {
        if (ws.login) ws.isPing = true;
    });
}