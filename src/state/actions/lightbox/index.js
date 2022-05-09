/** @format */

import { SET_LIGHTBOX } from "../types"

export function setLightbox(payload) {
	return {
		type: SET_LIGHTBOX,
		payload: String.isString(payload) || !payload ? { src: payload, alt: undefined, next: undefined, prev: undefined } : { ...payload },
	}
}
