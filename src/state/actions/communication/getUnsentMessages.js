/** @format */
import { getIndexOfConversation, getIndexOfMessage, concatMessages } from "./utils"
let possible_states = ["sent", "received", "partially-received", "partially-read", "read", "deleted-for-sender", "deleted-for-all"]
export default function getUnsentMessages(conversation = null) {
	return async (dispatch, getState) => {
		const {
			auth,
			communication: {
				messaging: { conversations },
			},
		} = getState()
		let unsentMessages = []
		if (auth.isAuthenticated) {
			if (!!conversation) {
				let index_of_conversation = getIndexOfConversation(conversations, conversation)
				const conversation_in_conversations = conversations[index_of_conversation]
				if (index_of_conversation !== -1 && Array.isArray(conversation_in_conversations?.messages)) {
					unsentMessages = conversation_in_conversations.messages.filter(message => String.isEmpty(message.state) || possible_states.indexOf(message.state) === -1)
				}
			} else {
				unsentMessages = conversations.reduce((currentUnsentMessages, conversationEntry) => {
					if (Array.isArray(conversationEntry.messages)) {
						const unsentMessagesInConversation = conversationEntry.messages.filter(message => String.isEmpty(message.state) || possible_states.indexOf(message.state) === -1)
						currentUnsentMessages = currentUnsentMessages.concat(unsentMessagesInConversation)
					}
					return currentUnsentMessages
				}, [])
			}
		}

		return unsentMessages
	}
}
