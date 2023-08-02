//心跳包处理
export default (wss) => {
    wss.eventListeners.on(0, (ws, msg) => {
        if (ws.login) ws.isPing = true;
    });
}