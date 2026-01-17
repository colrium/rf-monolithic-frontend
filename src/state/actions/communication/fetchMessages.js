/** @format */
import ApiService from "services/Api"
import { onMessages } from "config/dexie/actions"
import setMessagingCache from "./setMessagingCache"
import {getIndexOfConversation, concatMessages} from "./utils"

export default function fetchMessages(conversation, query = {}, preserve = true) {
	return async (dispatch, getState) => {
		try {
			const {
				auth,
				communication: {
					messaging: { active_conversation },
				},
			} = getState()

			if (auth.isAuthenticated) {
				const conversationID = conversation?._id || conversation.uuid || conversation
				const eveluatedQuery = {
					sort: "-timestamp",
					pagination: 50,
					page: 1,
					conversation: conversationID,
					populate: "sender,conversation",
					...query,
				}
				if (conversationID) {
					ApiService.get("/messages", {
						params: { ...eveluatedQuery },
					})
						.then(res => {
							const {data: messages} = {...res.body}
							if (Array.isArray(messages) && preserve) {
								onMessages(messages)
							}
						})
						.catch(err => {
							return {}
						})


				} else {
					throw "Conversation ID is missing"
				}
			} else {
				throw "Unauthorized"
			}
		} catch (error) {
			console.error("fetchMessages try error", error)
		}
	}
}
