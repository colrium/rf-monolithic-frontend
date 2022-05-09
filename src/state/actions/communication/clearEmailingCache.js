/** @format */
import {
	CLEAR_EMAILING_CACHE,
} from "state/actions"

export default function clearEmailingCache() {
	return {
		type: CLEAR_EMAILING_CACHE,
	}
}
