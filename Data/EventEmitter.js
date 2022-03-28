export const EventEmitter = {
    _events: {},
    dispatch: function (event, data) {
        if (!this._events[event]) return;
        console.log("Refreshing: "+event)
        this._events[event].forEach(callback => callback(data))
    },
    subscribe: function (event, callback) {
        if (!this._events[event]) this._events[event] = [];
        console.log("Subscribed: "+event)
        this._events[event].push(callback);
    },
    unsubscribe: function (event) {
        if (!this._events[event]) return;
        console.log("Unsubscribed: "+event)
        delete this._events[event];
    }
}