/*
//Usage Example
const listener = EventRegister.addEventListener('myCustomEvent', (data) => //)
EventRegister.removeEventListener(listener);
EventRegister.emit('myCustomEvent', 'it works!!!')
*/
class EventRegister {

    static _Listeners = {
        count: 0,
        refs: {},
        propagation: {}
    }

    static addEventListener(eventName, callback) {
        if (String.isString(eventName) && Function.isFunction(callback)) {
            //EventRegister._Listeners.count++
            //const eventId = 'l' + EventRegister._Listeners.count;			
            if (!Array.isArray(EventRegister._Listeners.refs[eventName])) {
                EventRegister._Listeners.refs[eventName] = [];
            }
            const eventUUID = String.uuid();
            const eventId = eventName + "@@@" + eventUUID;
            EventRegister._Listeners.refs[eventName].push({ callback: callback, uuid: eventUUID })
            return eventId
        }
        return false
    }

    static removeEventListener(id) {
        if (String.isString(id)) {
            const idArr = id.split("@@@");
            const eventName = idArr[0];
            const eventUUID = idArr[1];
            if (Array.isArray(EventRegister._Listeners.refs[eventName])) {
                EventRegister._Listeners.refs[eventName] = EventRegister._Listeners.refs[eventName].filter(ref => (ref.uuid !== eventUUID));
            }
        }
        return;
    }

    static removeAllListeners() {
        let removeError = false
        Object.keys(EventRegister._Listeners.refs).forEach(_id => {
            const removed = delete EventRegister._Listeners.refs[_id]
            removeError = (!removeError) ? !removed : removeError
        })
        return !removeError;
    }

    /* static emitEvent(eventName, data) {		
        Object.keys(EventRegister._Listeners.refs).forEach(_id => {
            if (EventRegister._Listeners.refs[_id] && eventName === EventRegister._Listeners.refs[_id].name){
                EventRegister._Listeners.refs[_id].callback(data)
            }
        })
    }
    */
    static async emitEvent(eventName, data = {}) {
        const eventCallbacks = EventRegister._Listeners.refs[eventName];


        if (Array.isArray(eventCallbacks)) {
            EventRegister._Listeners.propagation[eventName] = {
                index: (eventCallbacks.length + 1),
                data: data,
                stopped: false,
            };


            const propagate = async () => {

                for (let i = EventRegister._Listeners.propagation[eventName].index; i >= 0; i--) {
                    if (EventRegister._Listeners.propagation[eventName]) {
                        EventRegister._Listeners.propagation[eventName].stopped = false;
                        EventRegister._Listeners.propagation[eventName].index = i--;
                    }
                    await Promise.all([eventCallbacks[i]({
                        ...data,
                        stopPropagation: () => {
                            if (EventRegister._Listeners.propagation[eventName] && !EventRegister._Listeners.propagation[eventName].stopped) {
                                EventRegister._Listeners.propagation[eventName].stopped = true;
                            }
                        },
                        proceedPropagation: () => {
                            EventRegister._Listeners.propagation[eventName].stopped = false;
                            propagate();
                        }
                    })]);
                    if ((EventRegister._Listeners.propagation[eventName]?.stopped ?? false)) {
                        break;
                    }
                }
            }

            propagate();


        }
    }

    /*
     * shorthands
     */
    static on(eventName, callback, throttle = 0) {
        return EventRegister.addEventListener(eventName, callback, throttle)
    }

    static rm(eventName) {
        return EventRegister.removeEventListener(eventName)
    }

    static rmAll() {
        return EventRegister.removeAllListeners()
    }

    static emit(eventName, data) {
        EventRegister.emitEvent(eventName, data)
    }

}

export default EventRegister;