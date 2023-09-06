class EventManager {
    constructor(){
        this.events = {}
    }
    on(eventName,call){
        if (!this.events[eventName]) {
            this.events[eventName] = [];
          }
          this.events[eventName].push(call);
    }
    emit(eventName,data){
        const eventCallbacks = this.events[eventName];
        if (eventCallbacks) {
          eventCallbacks.forEach(callback => callback(data));
        }
    }
}

