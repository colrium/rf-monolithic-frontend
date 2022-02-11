/** @format */
import ApiService from "services/Api"
import EventRegister from "utils/EventRegister"
import setMessagingCache from "./setMessagingCache"
import {getIndexOfConversation, concatMessages} from "./utils"

export default function fetchMessages(conversation, query = {}, preserve = true) {
	return async (dispatch, getState) => {
		try {
			const {
				auth,
				communication: {
					messaging: { active_conversation, conversations },
				},
			} = getState()

			if (auth.isAuthenticated) {
				const conversation_id = conversation?._id || conversation
				const index_of_conversation =
					getIndexOfConversation(conversations, conversation)
				const eveluatedQuery = {
					sort: "-timestamp",
					pagination: 50,
					page: 1,
					conversation: conversation_id,
					populate: "sender,conversation",
					...query,
				}
				if (conversation_id) {
					const {
						count,
						page,
						pages,
						data: messages,
					} = await ApiService.get("/messages", {
						params: { ...eveluatedQuery },
					})
						.then(res => {
							return res.body
						})
						.catch(err => {
							return {}
						})

					if (Array.isArray(messages) && preserve) {
						if (!!conversations[index_of_conversation]) {
							let next_conversations = [...conversations]
							next_conversations[index_of_conversation].messages =
								concatMessages(
									next_conversations[index_of_conversation]
										.messages,
									messages
								)
							dispatch(
								setMessagingCache(
									"conversations",
									next_conversations
								)
							)
						}
							// EventRegister.emit("db-sync-record", {
							// 	table: "messages",
							// 	data: messages,
							// 	query: { conversation: conversation_id },
							// })
					}
					resolve(messages)
				} else {
					throw "Conversation ID is missing"
				}
			} else {
				throw "Unauthorized"
			}
		} catch (error) {
			// console.log("fetchMessages try error", error)
		}
	}
}
