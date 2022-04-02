/** @format */
import {
	CLEAR_MESSAGING_CACHE,
} from "state/actions"

export default function clearMessagingCache() {
	return {
		type: CLEAR_MESSAGING_CACHE,
	}
}
