/** @format */
import ApiService from "services/Api"
import setMessagingCache from "./setMessagingCache"
import appendMessage from "./appendMessage"
import updateMessage from "./updateMessage"
import sendUnsentMessages from "./sendUnsentMessages"
import { getIndexOfConversation, getIndexOfMessage, concatMessages } from "./utils"

export default function sendMessage(message) {
	return async (dispatch, getState) => {
		const {
			auth,
			communication: {
				messaging: { conversations, unsent_messages, active_conversation },
			},
		} = getState()
		//
		if (auth.isAuthenticated && message) {
			const index_of_conversation = getIndexOfConversation(conversations, message.conversation_uuid || message.conversation?._id || message.conversation)
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
					let index_of_message_to_send = getIndexOfMessage(conversation?.messages || [], message_to_send)
					if (index_of_message_to_send === -1) {
						await dispatch(appendMessage({ ...message_to_send, state: "pending" }))
					}

					let sent_message = null
					try {
						sent_message = await ApiService.post("/messages", message_to_send).then(res => {
							if (!JSON.isEmpty(res?.body?.data)) {
								return res.body.data
							} else {
								console.log("res", res)
								return null
							}
						})
					} catch (error) {
						console.error("sendMessage error", error)
					}
					if (!JSON.isEmpty(sent_message)) {
						//
						sent_message.conversation = message_to_send.conversation
						sent_message.sender = message_to_send.sender
						await dispatch(appendMessage(sent_message))
						dispatch(sendUnsentMessages())
					}
					return sent_message
				}
			}
		}
	}
}
