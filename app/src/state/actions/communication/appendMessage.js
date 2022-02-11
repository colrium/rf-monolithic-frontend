/** @format */
import ApiService from "services/Api"
import EventRegister from "utils/EventRegister"
import fetchMessages from "./fetchMessages"
import {getIndexOfConversation} from "./utils"

export default function appendMessage(message, new_incoming = false) {
	return async (dispatch, getState) => {
		const {
			auth,
			communication: {
				messaging: { conversations, active_conversation },
			},
			navigation,
		} = getState()
		let conversation_messages = []
		let is_message_obj = JSON.isJSON(message)
		if (auth.isAuthenticated) {
			let senderName = message?.sender?.first_name || message?.sender
			let currentScreenName = undefined
			if (Array.isArray(navigation?.history)) {
				currentScreenName = navigation.history[0]?.name
			}

			let message_id = message?._id || message
			let fetchMessageFromServer = String.isString(message)
			if (fetchMessageFromServer) {
				let fetchedMessage = await ApiService.get(
					"/messages/" + message_id,
					{
						params: !is_message_obj
							? {
									populate: "sender",
							  }
							: {},
					}
				)
					.then(res => {
						return res.body.data
					})
					.catch(err => {
						return false
					})

				if (JSON.isJSON(fetchedMessage)) {
					senderName = `${fetchedMessage.sender?.first_name} ${fetchedMessage.sender?.last_name}`
					message = is_message_obj
						? { ...message, ...fetchedMessage }
						: fetchedMessage
				}
			}
			if (JSON.isJSON(message)) {
				const {
					conversation,
					sender,
					uuid,
				} = message
				const sender_id = sender?._id || sender
				const is_outgoing = sender_id === auth.user._id
				const conversation_id = conversation?._id || conversation
				const conversation_uuid = conversation?.uuid || message.conversation_uuid
				const active_conversation_index = getIndexOfConversation(
					conversations,
					active_conversation
				)
				const index_of_conversation = getIndexOfConversation(
					conversations,
					conversation_uuid || conversation_id
				)
				const is_current_active_conversation =
					!String.isEmpty(active_conversation) &&
					active_conversation_index !== -1 &&
					active_conversation_index === index_of_conversation

				let conversation_obj = conversations[index_of_conversation]

				let newConversations = [...conversations]
				if (
					index_of_conversation === -1 ||
					JSON.isEmpty(conversation_obj)
				) {
					let fetchedConversation = await dispatch(
						fetchMessages(conversation_id)
					)
						.then(fetchedConversation => fetchedConversation)
						.catch(err => {
							return false
						})
					if (fetchedConversation) {
						if (index_of_conversation === -1) {
							conversation_obj = fetchedConversation
							newConversations.unshift(fetchedConversation)
							index_of_conversation = 0
						} else {
							conversation_obj = fetchedConversation
						}
					}
				}
				try {
					if (new_incoming) {
						if (
							active_conversation_index !==
								index_of_conversation ||
							(active_conversation_index ===
								index_of_conversation &&
								currentScreenName !== "MessagesScreen")
						) {
							if (
								(String.isEmpty(senderName) ||
									senderName === sender_id) &&
								!JSON.isEmpty(conversation_obj) &&
								Array.isArray(conversation_obj?.participants)
							) {
								conversation_obj.participants.map(
									participant => {
										// console.log("senderName participant", participant)
										if (
											senderName === sender_id &&
											sender_id === participant?._id
										) {
											senderName =
												participant?.first_name +
												" " +
												participant?.last_name
										}
									}
								)
							}
							EventRegister.emit("notification", {
								title: `${
									senderName === sender_id
										? "New Message"
										: senderName
								}`,
								content: message.content,
								type: "info",
								mode: "snackbar",
								icon: "message",
							})
						}

						if (message.state === "sent") {
							if (active_conversation_index === index_of_conversation) {
								if (currentScreenName == "MessagesScreen") {
									EventRegister.emit("mark-message-as-read", {
										message: message._id,
										user: auth.user?._id || auth.user,
									})
								} else {
									EventRegister.emit(
										"mark-message-as-received",
										{
											message: message._id,
											user: auth.user?._id || auth.user,
										}
									)
								}
							} else {
								if (currentScreenName == "MessagesScreen") {
									EventRegister.emit("mark-message-as-read", {
										message: message._id,
										user: auth.user?._id || auth.user,
									})
								} else {
									EventRegister.emit(
										"mark-message-as-received",
										{
											message: message._id,
											user: auth.user?._id || auth.user,
										}
									)
								}
							}
						}
					}

					if (!JSON.isEmpty(conversation_obj)) {
						let messageConversationMessagesIndex = Array.isArray(
							conversation_obj.messages
						)
							? conversation_obj.messages.findIndex(
									conversation_message =>
										(!String.isEmpty(
											conversation_message.uuid
										) &&
											!String.isEmpty(message.uuid) &&
											conversation_message.uuid ===
												message.uuid) ||
										(conversation_message._id &&
											message._id &&
											conversation_message._id ===
												message._id)
							  )
							: -1

						let is_last_message =
							conversation_obj.state?.last_message?.uuid ===
								message.uuid ||
							conversation_obj.state?.last_message?._id ===
								message._id
						let last_message = is_last_message
							? JSON.merge(
									conversation_obj.state?.last_message,
									message
							  )
							: message
						if (!Array.isArray(conversation_obj.messages)) {
							conversation_obj.messages = []
						}
						conversation_obj.state = { ...conversation_obj.state }
						if (messageConversationMessagesIndex === -1) {
							conversation_obj.messages = Array.isArray(
								conversation_obj.messages
							)
								? conversation_obj.messages.concat([message])
								: [message]
							messageConversationMessagesIndex =
								conversation_obj.messages.length - 1
							if (
								new_incoming &&
								!is_current_active_conversation
							) {
								conversation_obj.state.incoming_unread =
									Number.parseNumber(
										conversation_obj.state
											.incoming_unread || 0
									) + 1
							}
							conversation_obj.state.total =
								Number.parseNumber(
									conversation_obj.state.total || 0
								) + 1
							conversation_obj.state.last_message = message
						} else {
							is_last_message =
								conversation_obj.state?.last_message?.uuid ===
									message.uuid ||
								conversation_obj.state?.last_message?._id ===
									message._id
							last_message = is_last_message
								? JSON.merge(
										conversation_obj.state?.last_message,
										message
								  )
								: message
							conversation_obj.messages[
								messageConversationMessagesIndex
							] = JSON.merge(
								conversation_obj.messages[
									messageConversationMessagesIndex
								],
								message
							)
						}
						newConversations[index_of_conversation] =
							conversation_obj
					}

					EventRegister.emit("db-sync-record", {
						table: "conversations",
						data: conversation_obj,
					})
				} catch (error) {
					console.log("message error", error)
				}
			}

			return message
		}
	}
}
