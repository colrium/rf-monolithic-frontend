/** @format */

import setMessagingCache from "./setMessagingCache"
import fetchMessages from "./fetchMessages"
import { getIndexOfConversation } from "./utils"
import dexieDB from "config/dexie/database"

export default function setActiveConversation(conversation) {
	return async (dispatch, getState) => {
		const {
			auth,
			communication: {
				messaging: {
					active_conversation,
				},
			},
		} = getState()
		if (!!conversation) {
			const conversations = await dexieDB.conversations.where("status").equalsIgnoreCase("available").toArray()
			if (Array.isArray(conversations)) {
				let index_of_conversation = getIndexOfConversation(conversations, conversation)

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
				}
			} else {
				dispatch(setMessagingCache("active_conversation", null))
			}
		} else {
			dispatch(setMessagingCache("active_conversation", null))
		}

	}
}
