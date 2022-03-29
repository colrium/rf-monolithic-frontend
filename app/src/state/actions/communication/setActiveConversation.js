/** @format */

import setMessagingCache from "./setMessagingCache"
import fetchMessages from "./fetchMessages"
import { getIndexOfConversation } from "./utils"

export default function setActiveConversation(conversation) {
	return async (dispatch, getState) => {
		const {
			auth,
			communication: {
				messaging: {
					conversations,
					active_conversation,
				},
			},
		} = getState()
		let index_of_conversation = getIndexOfConversation(
			conversations,
			conversation
		)


		if (auth.isAuthenticated && index_of_conversation !== -1) {
			if (
				conversations[index_of_conversation].uuid !== active_conversation &&
				conversations[index_of_conversation]._id !== active_conversation
			) {
				dispatch(
					setMessagingCache(
						"active_conversation",
						conversations[index_of_conversation].uuid || conversations[index_of_conversation]._id
					)
				)
				dispatch(fetchMessages(conversations[index_of_conversation], {}))
			}
		} else {
			dispatch(setMessagingCache("active_conversation", null))
		}
	}
}
