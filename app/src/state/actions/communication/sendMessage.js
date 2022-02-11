/** @format */
import ApiService from "services/Api"
import setMessagingCache from "./setMessagingCache"
import appendMessage from "./appendMessage"
import updateMessage from "./updateMessage"
import sendUnsentMessages from "./sendUnsentMessages"

export default function sendMessage(message) {
	return async (dispatch, getState) => {
		const {
			auth,
			communication: {
				messaging: {
					conversations,
					unsent_messages,
					active_conversation,
				},
			},
		} = getState()
		//
		if (auth.isAuthenticated && message) {
			let conversation_id = message.conversation?._id || message.conversation
			let conversation_uuid =
				message.conversation?.uuid || message.conversation_uuid
			if (
				!String.isEmpty(conversation_id) ||
				!String.isEmpty(conversation_uuid)
			) {
				let message_to_send = {
					uuid: String.uuid(),
					...message,
					conversation_uuid: conversation_uuid,
					conversation: conversation_id,
					timestamp: new Date(),
					sender: auth.user._id,
				}

				await dispatch(
					appendMessage({ ...message_to_send, state: "pending" })
				)

				let sent_message = await ApiService.post(
					"/messages",
					message_to_send
				)
					.then(res => {
						const { data } = res.body
						return data
					})
					.catch(e => {
						return false
					})

				if (sent_message) {
					//
					dispatch(updateMessage(sent_message))
					dispatch(sendUnsentMessages())
				} else {
					let new_unsent_messages = Array.isArray(unsent_messages)
						? unsent_messages.concat([message_to_send])
						: [message_to_send]
					dispatch(
						setMessagingCache(
							"unsent_messages",
							new_unsent_messages
						)
					)
				}
				return sent_message
			}
		}
	}
}
