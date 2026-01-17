/** @format */
import {
	REMOVE_MESSAGING_CACHE,
} from "state/actions"

export default function removeMessagingCache(key) {
	return {
		type: REMOVE_MESSAGING_CACHE,
		key,
	}
}
