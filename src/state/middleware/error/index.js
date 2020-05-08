/** @format */

const error = ({ dispatch, getState }) => next => action => {
	try {
		next(action);
	} catch (e) {
		console.error(e);
	}
};

export default error;
