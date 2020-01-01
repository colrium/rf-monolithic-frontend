export default function socketMiddleware() {
	return ({ dispatch, getState }) => next => (action) => {
		if (typeof action === 'function') {
			return next(action);
		}
		const authSocket = io();
		const { event, leave, handle, ...rest } = action;

		if (!event) {
			return next(action);
		}

		if (leave) {
			socket.removeListener(event);
		}

		let handleEvent = handle;
		if (typeof handleEvent === 'string') {
			handleEvent = result => dispatch({ type: handle, result, ...rest });
		}
		return socket.on(event, handleEvent);
	};
}