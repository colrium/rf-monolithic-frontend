/**
 * /*
 * //Usage Example
 * const listener = EventRegister.addEventListener('myCustomEvent', (data) => //console.log("It works"))
 * EventRegister.removeEventListener(listener);
 * EventRegister.emit('myCustomEvent', 'it works!!!')
 *
 * @format
 */

class EventRegister {
	static _Listeners = {
		count: 0,
		refs: {},
		propagation: {},
	};

	static addEventListener(eventName, callback) {
		if (String.isString(eventName) && Function.isFunction(callback)) {
			if (!Array.isArray(EventRegister._Listeners.refs[eventName])) {
				EventRegister._Listeners.refs[eventName] = [];
			}
			const eventUUID = String.uuid();
			const eventId = eventName + "@@@" + eventUUID;
			EventRegister._Listeners.refs[eventName].push({
				callback: callback,
				uuid: eventUUID,
				id: eventId,
			});
			return {
				id: eventId,
				remove: () => EventRegister.removeEventListener(eventId),
			};
		}
		return false;
	}

	static removeEventListener(listener) {
		let id = listener?.id || listener;
		if (String.isString(id)) {
			const idArr = id.split("@@@");
			const eventName = idArr[0];
			const eventUUID = idArr[1];
			if (Array.isArray(EventRegister._Listeners.refs[eventName])) {
				EventRegister._Listeners.refs[eventName] =
					EventRegister._Listeners.refs[eventName].filter(
						ref => ref.uuid !== eventUUID
					);
			}
		}
		return;
	}

	static removeAllListeners() {
		let removeError = false;
		Object.keys(EventRegister._Listeners.refs).forEach(_id => {
			const removed = delete EventRegister._Listeners.refs[_id];
			removeError = !removeError ? !removed : removeError;
		});
		return !removeError;
	}

	static async _emitEventPrev(eventName, data = {}) {
		if (Array.isArray(EventRegister._Listeners.refs[eventName])) {
			EventRegister._Listeners.propagation[eventName] = {
				index: EventRegister._Listeners.refs[eventName].length - 1,
				data: data,
				stopped: false,
			};
			const eventRefs = [...EventRegister._Listeners.refs[eventName]];

			const propagate = (eventName, data = {}) => {
				while (
					!EventRegister._Listeners.propagation[eventName]?.stopped &&
					EventRegister._Listeners.propagation[eventName].index >=
						0 &&
					EventRegister._Listeners.propagation[eventName].index <
						EventRegister._Listeners.refs[eventName].length
				) {
					let index =
						EventRegister._Listeners.propagation[eventName].index;
					const refCallback =
						EventRegister._Listeners.refs[eventName][index]
							?.callback;
					const refId =
						EventRegister._Listeners.refs[eventName][index]?.id;
					const refuuid =
						EventRegister._Listeners.refs[eventName][index]?.id;

					if (Function.isFunction(refCallback)) {
						Promise.all([
							refCallback({
								...data,
								stopPropagation: () => {
									if (
										!EventRegister._Listeners.propagation[
											eventName
										]?.stopped
									) {
										EventRegister._Listeners.propagation[
											eventName
										].stopped = true;
									}
								},
								proceedPropagation: () => {
									EventRegister._Listeners.propagation[
										eventName
									].stopped = false;
									propagate(eventName, data);
								},
							}),
						]);
						EventRegister._Listeners.propagation[eventName].index =
							EventRegister._Listeners.propagation[eventName]
								.index - 1;
					}
				}
			};
			let result = propagate(eventName, data);
		}
	}

	static async _emitEvent(eventName, data = {}) {
		if (Array.isArray(EventRegister._Listeners.refs[eventName])) {
			EventRegister._Listeners.propagation[eventName] = {
				index: EventRegister._Listeners.refs[eventName].length - 1,
				data: data,
				stopped: false,
			};
			const eventRefs = [...EventRegister._Listeners.refs[eventName]];

			const propagate = (eventName, data = {}) => {
				while (
					!EventRegister._Listeners.propagation[eventName]?.stopped &&
					EventRegister._Listeners.propagation[eventName].index >=
						0 &&
					EventRegister._Listeners.propagation[eventName].index <
						EventRegister._Listeners.refs[eventName].length
				) {
					let index =
						EventRegister._Listeners.propagation[eventName].index;
					const refCallback =
						EventRegister._Listeners.refs[eventName][index]
							?.callback;
					const refId =
						EventRegister._Listeners.refs[eventName][index]?.id;
					const refuuid =
						EventRegister._Listeners.refs[eventName][index]?.id;

					if (Function.isFunction(refCallback)) {
						Promise.all([
							refCallback({
								...data,

								stopPropagation: () => {
									if (
										!EventRegister._Listeners.propagation[
											eventName
										]?.stopped
									) {
										EventRegister._Listeners.propagation[
											eventName
										].stopped = true;
									}
								},
								proceedPropagation: () => {
									EventRegister._Listeners.propagation[
										eventName
									].stopped = false;
									propagate(eventName, data);
								},
							}),
						]);
						EventRegister._Listeners.propagation[eventName].index =
							EventRegister._Listeners.propagation[eventName]
								.index - 1;
					}
				}
			};
			let result = propagate(eventName, data);
		}
	}

	/*
	 * shorthands
	 */
	static on(eventName, callback) {
		return EventRegister.addEventListener(eventName, callback);
	}

	static rm(listener) {
		return EventRegister.removeEventListener(listener);
	}
	static off(listener) {
		return EventRegister.removeEventListener(listener);
	}

	static rmAll() {
		return EventRegister.removeAllListeners();
	}

	static emit(eventName, data) {
		EventRegister._emitEvent(eventName, data);
	}

	static dispatchEvent(eventName, data) {
		EventRegister._emitEvent(eventName, data);
	}
}

export default EventRegister;
