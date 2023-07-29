//心跳包处理
export default (wss) => {
    wss.eventListeners.on(0, (ws, msg) => {
        if (!ws.pingCounter) {
            console.log('心跳包计数器不存在');
        }
        ws.pingCounter.clear();
    });
}