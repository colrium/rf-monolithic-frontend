/** @format */

const error = ({ dispatch, getState }) => next => action => {
	try {
		next(action);
	} catch (e) {}
};

export default error;
