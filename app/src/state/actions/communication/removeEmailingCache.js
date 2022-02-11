/** @format */
import {
	REMOVE_EMAILING_CACHE,
} from "state/actions"

export default function removeEmailingCache(key) {
	return {
		type: REMOVE_EMAILING_CACHE,
		key,
	}
}
