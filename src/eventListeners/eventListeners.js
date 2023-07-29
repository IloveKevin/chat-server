//定义一个事件监听类，用于监听各种事件
export default class eventListeners {
    event = new Map();
    on(eventName, callback) {
        if (this.event.has(eventName)) {
            this.event.get(eventName).push(callback);
        } else {
            this.event.set(eventName, [callback]);
        }
    }

    emit(eventName, ...args) {
        if (this.event.has(eventName)) {
            this.event.get(eventName).forEach(callback => {
                callback(...args);
            });
        }
    }

    remove(eventName, callback) {
        if (this.event.has(eventName)) {
            const eventList = this.event.get(eventName);
            const index = eventList.findIndex(item => item === callback);
            if (index !== -1) {
                eventList.splice(index, 1);
            }
        }
    }

    removeAll(eventName) {
        if (this.event.has(eventName)) {
            this.event.delete(eventName);
        }
    }

    once(eventName, callback) {
        const fn = (...args) => {
            callback(...args);
            this.remove(eventName, fn);
        }
        this.on(eventName, fn);
    }
}