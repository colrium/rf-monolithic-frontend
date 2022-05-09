/** @format */
import ApiService from "services/Api"
import { onMessage, database as dexieDB } from "config/dexie"
import ensureMessage from "./ensureMessage"
import sendUnsentMessages from "./sendUnsentMessages"
import { getIndexOfConversation, getIndexOfMessage, concatMessages } from "./utils"

export default function sendMessage(message) {
	return async (dispatch, getState) => {
		const {
			auth,
			communication: {
				messaging: { active_conversation },
			},
		} = getState()
		//
		if (auth.isAuthenticated && message) {
			const conversations = await dexieDB.conversations.toArray()

			const index_of_conversation = getIndexOfConversation(
				conversations,
				message.conversation_uuid || message.conversation?._id || message.conversation
			)
			const conversation = conversations[index_of_conversation]

			if (index_of_conversation !== -1) {
				let conversation_id = conversation?._id || message.conversation
				let conversation_uuid = conversation?.uuid || message.conversation_uuid
				if (!String.isEmpty(conversation_id) || !String.isEmpty(conversation_uuid)) {
					let message_to_send = {
						uuid: String.uuid(),
						...message,
						conversation_uuid: conversation_uuid,
						conversation: conversation_id,
						sender: auth.user?._id,
						timestamp: new Date(),
					}
					delete message_to_send.state
					await onMessage({ ...message_to_send, state: "pending" })
					dexieDB.conversations.put({ ...conversation, last_used: new Date() })
					let sent_message = null
					try {
						sent_message = await ApiService.post("/messages", message_to_send).then(res => {
							if (!JSON.isEmpty(res?.body?.data)) {
								return res.body.data
							} else {
								return null
							}
						})
					} catch (error) {
						console.error("sendMessage error", error)
					}

					if (!JSON.isEmpty(sent_message)) {
						delete sent_message.__v //
						sent_message.conversation = message_to_send.conversation
						sent_message.sender = message_to_send.sender
						await onMessage(sent_message)

					}
					return sent_message
				}
			}
		}
	}
}
