/** @format */
import {
    FORMS_ADD,
    FORMS_REMOVE,
    FORMS_SET,
} from "state/actions/types";

const initialState = {};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case FORMS_ADD: {
			if (!String.isEmpty(action.name)) {
				return {
					...state,
					[action.name]: { ...action.payload },
				}
			}
            return state
        }
        case FORMS_SET: {
            const name = action.name;
			const values = action.payload
            if (!String.isEmpty(name)) {
				state[name] = {...values}
			}
            return state;
        }
        case FORMS_REMOVE: {
            const name = action.name || action.payload;
            let nextState = String.isString(name) && !String.isEmpty(name) ? JSON.removeProperty(state, name) : state;
            return {
                ...nextState,
            };
        }
        default: {
            return state;
        }
    }
};
