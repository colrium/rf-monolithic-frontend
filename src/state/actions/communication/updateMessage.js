/** @format */
import ApiService from "services/Api"
import { onMessage, database as dexieDB } from "config/dexie"
import fetchMessages from "./fetchMessages"
import { getIndexOfMessage, getIndexOfConversation } from "./utils"

export default function ensureMessage(message, persist = true) {
	return async (dispatch, getState) => {
		const { auth } = getState()

		if (auth.isAuthenticated) {
			const conversations = await dexieDB.conversations.toArray()
			if (JSON.isJSON(message)) {
				message = JSON.parse(JSON.stringify(message))
			}
			let message_id = message?._id || message
			let fetchMessageFromServer = String.isString(message)
			if (fetchMessageFromServer) {
				let fetchedMessage = await ApiService.getRecordById("/messages/" + message_id, {})
					.then(res => {
						return res.body.data
					})
					.catch(err => {
						return false
					})
				if (fetchedMessage) {
					message = fetchedMessage
				}
			}
			if (JSON.isJSON(message)) {
				console.log("ensureMessage message", message)
				const { conversation, sender, created_on } = message
				const sender_id = sender?._id || sender
				const is_outgoing = sender_id === auth.user?._id
				const conversation_id = conversation?._id || conversation
				const conversation_uuid = conversation?.uuid || message.conversation_uuid

				let index_of_conversation = getIndexOfConversation(conversations, conversation_uuid || conversation_id)

				let newConversations = [...conversations]
				if (index_of_conversation === -1) {
					let fetchedConversation = await dispatch(fetchMessages(conversation_id, {}))
						.then(res => {
							return res.body.data
						})
						.catch(err => {
							return false
						})
					if (fetchedConversation) {
						newConversations.push(fetchedConversation)
						index_of_conversation = newConversations.length
					}
				}
				onMessage(message)
				if (persist && message_id && !fetchMessageFromServer) {
					let persistedServerMessage = await ApiService.put("/messages/" + message_id, message)
						.then(res => {
							return res.body.data
						})
						.catch(err => {
							return false
						})
				}
			}

			return message
		}
	}
}
