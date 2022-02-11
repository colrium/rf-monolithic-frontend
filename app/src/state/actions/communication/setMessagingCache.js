/** @format */
import {
	SET_MESSAGING_CACHE,
} from "state/actions"

export default function setMessagingCache(key, messaging) {
	return {
		type: SET_MESSAGING_CACHE,
		key: key,
		messaging: messaging,
	}
}
