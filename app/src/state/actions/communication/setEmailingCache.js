/** @format */
import {
	SET_EMAILING_CACHE,
} from "state/actions"

export default function setEmailingCache(key, emailing) {
	return {
		type: SET_EMAILING_CACHE,
		key: key,
		emailing: emailing,
	}
}
