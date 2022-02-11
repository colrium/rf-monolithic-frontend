/** @format */
import ApiService from "services/Api"
import setMessagingCache from "./setMessagingCache"
import { concatMessages, getIndexOfConversation } from "./utils"

export default function fetchInbox(params = {}, persist = true) {
	return async (dispatch, getState) => {
		const {
			auth,
			communication: {
				messaging: { conversations },
			},
		} = getState()
		console.log("fetchInbox called")
		let inbox = []
		if (auth.isAuthenticated) {
			dispatch(setMessagingCache("fetching_inbox", true))
			const inbox_conversations = await ApiService.get("/inbox", {params: {...params}})
				.then(res => {
					const { data } = res.body
					return data
				})
				.catch(err => {
					return false
				})

			if (Array.isArray(inbox_conversations)) {
				let conversations_ids = []
				if (persist && Array.isArray(conversations)) {
					if (conversations.length > 0) {
						conversations.map(conversation => {
							conversations_ids.push(conversation._id)
						})
					}
				}
				inbox = inbox_conversations
				if (persist && conversations_ids.length > 0) {
					inbox_conversations.forEach(inbox_conversation => {
						let index_of_conversation = getIndexOfConversation(
							conversations,
							inbox_conversation
						)
						if (index_of_conversation !== -1) {
							inbox_conversation.messages = concatMessages(
								conversations[index_of_conversation].messages,
								inbox_conversation.messages
							)

							inbox_conversation.state = JSON.merge(conversations[index_of_conversation]
										.state, inbox_conversation.state)

						}
					})
				}
				console.log(
					"fetchInbox inbox_conversations",
					inbox_conversations
				)

				dispatch(
					setMessagingCache("conversations", inbox_conversations)
				)
			}


		}
		dispatch(setMessagingCache("fetching_inbox", false))
		return inbox;
	}
}
