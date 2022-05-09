/** @format */
import ApiService from "services/Api"
import setMessagingCache from "./setMessagingCache"
import { onInbox } from "config/dexie/actions"

export default function fetchInbox(params = {}, persist = true) {
	return async (dispatch, getState) => {
		const {
			auth,
			communication: {
				messaging: { conversations },
			},
		} = getState()
		let inbox = []
		if (auth.isAuthenticated) {
			dispatch(setMessagingCache("fetching_inbox", true))
			const inbox_conversations = await ApiService.get("/inbox", {params: {...params}})
				.then(res => {
					const { data } = res.body
					return data
				})
				.catch(err => {
					return false
				})

			if (Array.isArray(inbox_conversations)) {
				onInbox(inbox_conversations)
			}
		}
		dispatch(setMessagingCache("fetching_inbox", false))
		return inbox;
	}
}
