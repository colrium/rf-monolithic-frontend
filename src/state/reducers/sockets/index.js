import {
    SET_DEFAULT_SOCKET,
    SET_AUTH_SOCKET,
} from "state/actions/types";

const initialState = {
    default: false,
    auth: false,
    volatile: true,
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_DEFAULT_SOCKET: {
            return {
                ...state,
                volatile: true,
                default: action.socket,
            };
        }
        case SET_AUTH_SOCKET: {
            return {
                ...state,
                volatile: true,
                auth: action.socket,
            };
        }
        default: {
            return state;
        }
    }
};
