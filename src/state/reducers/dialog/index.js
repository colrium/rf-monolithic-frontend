import { OPEN_DIALOG, CLOSE_DIALOG} from "state/actions";
const initialState = {
	state: false,
	options: {
		children: "Hi"
	}
};

const dialog = function (state = initialState, action) {
	switch (action.type) {
		case OPEN_DIALOG: {
			return {
				...state,
				state: true,
				options: {
					...state.options,
					...action.options
				}
			};
		}
		case CLOSE_DIALOG: {
			return {
				...state,
				state: false,
				options: initialState.options
			};
		}
		default: {
			return state;
		}
	}
};

export default dialog;
