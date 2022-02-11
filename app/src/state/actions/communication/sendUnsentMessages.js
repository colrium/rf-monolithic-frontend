/** @format */
import ApiService from "services/Api"
import setMessagingCache from "./setMessagingCache"

export default function sendUnsentMessages() {
	return async (dispatch, getState) => {
		const {
			auth,
			communication: {
				messaging: {
					unsent_messages,
				},
			},
		} = getState()
		if (auth.isAuthenticated && Array.isArray(unsent_messages)) {
			if (unsent_messages.length > 0) {
				const prev_unsent_messages = [...unsent_messages]

				prev_unsent_messages.forEach((unsent_message, index) => {

					ApiService.post("/messages", unsent_message)
						.then(res => {
							//Remove from current unsent messages
							const {
								communication: {
									messaging: {
										unsent_messages:
											current_unsent_messages,
									},
								},
							} = getState()
							let new_unsent_messages = [
								...current_unsent_messages,
							]
							new_unsent_messages.splice(index, 1);
							if (!Array.isArray(new_unsent_messages)) {
								new_unsent_messages = []
							}
							dispatch(
								setMessagingCache(
									"unsent_messages",
									new_unsent_messages
								)
							)
						})
						.catch(err => {
							//Do nothing, just log if needed
						})
				})
			}
		}
	}
}
