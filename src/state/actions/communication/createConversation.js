/** @format */
import ApiService from "services/Api"
import setMessagingCache from "./setMessagingCache"
import fetchInbox from "./fetchInbox"
import setActiveConversation from "./setActiveConversation"
import { getIndexOfConversation } from "./utils"

export default function createConversation(conversation, activate = true) {
	return async (dispatch, getState) => {
		const {
			auth,
			communication: {
				messaging: { conversations },
			},
		} = getState()

		if (auth.isAuthenticated) {
			dispatch(setMessagingCache("creating_conversation", true))
			let postData = {
				uuid: String.uuid(),
				...conversation,
			}
			const created_conversation = await ApiService.post(
				"/conversations",
				postData
			)
				.then(async res => {
					const { data } = res.body
					let new_conversation = data
					let new_conversations = conversations
					if (Array.isArray(new_conversations)) {
						new_conversations.unshift(new_conversation)
					} else {
						new_conversations = [new_conversation]
					}

					if (activate) {
						// await dispatch(setActiveConversation(postData));
					}

					await dispatch(fetchInbox())

					dispatch(setMessagingCache("creating_conversation", false))

					return data
				})
				.catch(err => {
					if (err.status === 409 && err.body) {
						if (JSON.isJSON(err.body.data)) {
							let new_conversation = {
								...err?.body?.data,
								state: JSON.merge(
									{
										conversation: err.body.data._id,
										total: 0,
										read: 0,
										unread: 0,
										incoming_total: 0,
										incoming_read: 0,
										incoming_unread: 0,
										outgoing_total: 0,
										outgoing_read: 0,
										outgoing_unread: 0,

										last_message: {
											content: "",
											sender: null,
											type: "text",
											context: null,
											record: null,
											attachments: [],
											status: "available",
											reads: [],
											receipts: [],
											is_reply: false,
											reply_for: null,
											timestamp: new Date(),
										},
									},
									err?.body?.data?.state || {}
								),
							}
							let new_conversations = [...conversations]
							let index_of_conversation = getIndexOfConversation(
								new_conversations,
								new_conversation
							)
							if (Array.isArray(conversations)) {
								if (index_of_conversation === -1) {
									new_conversations.unshift(new_conversation)
									index_of_conversation = 0
								}
							} else {
								new_conversations = [new_conversation]
								index_of_conversation = 0
							}

							dispatch(
								setMessagingCache(
									"conversations",
									new_conversations
								)
							)

							if (activate) {
								dispatch(
									setActiveConversation(
										postData.uuid
									)
								)
							}

							dispatch(
								setMessagingCache(
									"creating_conversation",
									false
								)
							)

							return new_conversations[index_of_conversation]
						}
					}

					throw err
				})

			//dispatch(setMessagingCache("conversations", inbox_conversations));
			return created_conversation
		} else {
			return false
		}
	}
}
