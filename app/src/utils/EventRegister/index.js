/**
 * /*
 * //Usage Example
 * const listener = EventRegister.addEventListener('myCustomEvent', (data) => ())
 * EventRegister.removeEventListener(listener);
 * EventRegister.emit('myCustomEvent', 'it works!!!')
 *
 * @format
 */

class EventRegister {
	static _Listeners = []
	static removeEventListener(eventName, handler = null, options = {}) {
		if (String.isString(eventName)) {
			const isSupported = global && Function.isFunction(global.addEventListener)
			if (isSupported) {
				global.removeEventListener(eventName, handler, options)
			}
		}
		return
	}

	static addEventListener(eventName, handler, options = {}) {
		const isSupported = global && Function.isFunction(global.addEventListener)
		if (String.isString(eventName) && Function.isFunction(handler) && isSupported) {
			global.addEventListener(eventName, handler, options)
			if (EventRegister._Listeners.indexOf(eventName) === -1) {
				EventRegister._Listeners.push(eventName)
			}
			return {
				name: eventName,
				remove: () => {
					EventRegister.removeEventListener(eventName, handler, options)
				},
			}
		}
		return {
			id: null,
			remove: () => {
				//Do Nothing
			},
		}
	}

	static removeAllListeners() {
		if (Array.isArray(EventRegister._Listeners)) {
			EventRegister._Listeners.forEach(listener => {
				EventRegister.removeEventListener(listener)
			})
			EventRegister._Listeners = []
		}
	}

	static async emitEvent(eventName, data = {}) {
		try {
			const isSupported = global && global.dispatchEvent
			if (isSupported) {
				global.dispatchEvent(new CustomEvent(eventName, { detail: data }))
			}
		} catch (error) {
			console.error("emitEvent error", error)
		}
	}

	/*
	 * shorthands
	 */
	static on(eventName, callback, opts = {}) {
		return EventRegister.addEventListener(eventName, callback, opts)
	}

	static rm(listener) {
		return EventRegister.removeEventListener(listener)
	}
	static off(listener) {
		return EventRegister.removeEventListener(listener)
	}

	static rmAll() {
		return EventRegister.removeAllListeners()
	}

	static emit(eventName, data) {
		EventRegister.emitEvent(eventName, data)
	}

	static dispatchEvent(eventName, data) {
		EventRegister.emitEvent(eventName, data)
	}
}

export default EventRegister;
