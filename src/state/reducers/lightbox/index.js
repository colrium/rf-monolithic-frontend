/** @format */

import { SET_LIGHTBOX } from "state/actions/types"

const initialState = {
	src: null,
	alt: undefined,
}

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case SET_LIGHTBOX: {
			return {
				...state,
				...action.payload,
			}
		}
		default: {
			return state
		}
	}
}
