/** @format */
import { getIndexOfConversation, getIndexOfMessage, concatMessages } from "./utils"
import { database as dexieDB } from "config/dexie"
export default function getUnsentMessages(conversation = null) {
	return async (dispatch, getState) => {
		const {
			auth,
		} = getState()
		let unsentMessages = []
		if (auth.isAuthenticated) {
			unsentMessages = await dexieDB.messages
				.filter(item => item?.sender === auth?.user._id && item.state === "pending")
				.toArray()
		}

		return unsentMessages
	}
}
