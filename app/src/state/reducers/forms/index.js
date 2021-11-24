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
            const { name, ...rest } = action.payload;
            return {
                ...state,
                [name]: { ...rest },
            };
        }
        case FORMS_SET: {
            const { name, ...values } = action.payload;
            let nextStateValue = {};
            if (String.isString(name) && !String.isEmpty(name)) {
                state[name] = values;
                // nextStateValue = JSON.isJSON(state[name]) ? JSON.merge(state[name], values) : {};
                //     return {
                //         ...state,
                //         [name]: values,
                //     };
            }
            return {
                ...state,
                [name]: values,
            };
        }
        case FORMS_REMOVE: {
            const name = action.payload?.name || action.payload;
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
