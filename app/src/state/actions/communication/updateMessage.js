/** @format */
import ApiService from "services/Api"
import EventRegister from "utils/EventRegister"
import fetchMessages from "./fetchMessages"
import { getIndexOfMessage, getIndexOfConversation } from "./utils"

export default function updateMessage(message, persist = true) {
	return async (dispatch, getState) => {
		const {
			auth,
			communication: {
				messaging: { conversations },
			},
		} = getState()

		if (auth.isAuthenticated) {
			if (JSON.isJSON(message)) {
				message = JSON.parse(JSON.stringify(message))
			}
			let message_id = message?._id || message
			let fetchMessageFromServer = String.isString(message)
			if (fetchMessageFromServer) {
				let fetchedMessage = await ApiService.getRecordById(
					"/messages/" + message_id,
					{}
				)
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
				const { conversation, sender, created_on } = message
				const sender_id = sender._id || sender
				const is_outgoing = sender_id === auth.user?._id
				const conversation_id = conversation?._id || conversation
				const conversation_uuid = conversation?.uuid || message.conversation_uuid

				let index_of_conversation = getIndexOfConversation(
					conversations,
					conversation_uuid || conversation_id
				)
				let index_of_message = getIndexOfMessage(
					conversations[index_of_conversation],
					message
				)

				let newConversations = [...conversations]
				if (index_of_conversation === -1) {
					let fetchedConversation = await dispatch(
						fetchMessages(conversation_id, {})
					)
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
				if (newConversations[index_of_conversation]) {
					if (
						newConversations[index_of_conversation]?.messages[
							index_of_message
						]
					) {
						newConversations[index_of_conversation].messages[
							index_of_message
						] = JSON.merge(
							newConversations[index_of_conversation].messages[
								index_of_message
							],
							message
						)
					}

					let current_last_message = newConversations[
						index_of_conversation
					].state
						? JSON.isJSON(
								newConversations[index_of_conversation].state
									.last_message
						  )
							? newConversations[index_of_conversation].state
									.last_message
							: false
						: false
					let conversation_id = conversation._id
						? conversation._id
						: conversation
					let is_last_message = current_last_message
						? current_last_message.uuid === message.uuid
						: true
					let last_message =
						current_last_message && is_last_message
							? JSON.merge(current_last_message, message)
							: !current_last_message
							? message
							: current_last_message

					newConversations[index_of_conversation].state = {
						...newConversations[index_of_conversation].state,
						last_message: last_message,
					}
				}
				if (persist && message_id && !fetchMessageFromServer) {
					let persistedServerMessage = await ApiService.put(
						"/messages/" + message_id,
						message
					)
						.then(res => {
							return res.body.data
						})
						.catch(err => {
							return false
						})
				}

				// dispatch(setMessagingCache("conversations", newConversations));

				EventRegister.emit("db-sync-record", {
					table: "conversations",
					data: newConversations[index_of_conversation],
				})
			}

			return message
		}
	}
}
