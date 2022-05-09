/** @format */
import ApiService from "services/Api"
import { onMessage } from "config/dexie"

export default function ensureMessage(message, persist = false) {
	return async (dispatch, getState) => {
		const { auth } = getState()

		if (auth.isAuthenticated) {
			const is_message_obj = JSON.isJSON(message)
			let message_id = message?._id || message?.uuid || message
			if (JSON.isJSON(message)) {
				let fetchedMessage = await ApiService.get(`/messages/${message_id}`, {
					params: !is_message_obj ? { populate: "sender" } : {},
				})
					.then(res => {
						return res.body.data
					})
					.catch(err => {
						return false
					})

				if (JSON.isJSON(fetchedMessage)) {
					message = is_message_obj ? { ...message, ...fetchedMessage } : fetchedMessage
				}
			}
			if (JSON.isJSON(message)) {
				try {
					onMessage(message)
				} catch (error) {
					console.error("message error", error)
				}
			} else if (persist && message_id && is_message_obj) {
				ApiService.put("/messages/" + message_id, message)
					.then(res => {
						if (JSON.isJSON(res?.body?.data) && !JSON.isEmpty(res?.body?.data)) {
							try {
								onMessage(res.body.data)
							} catch (error) {
								console.error("persist onMessage message error", error)
							}
						}
					})
					.catch(err => {
						console.error("persist message error", error)
						return false
					})
			}

			return message
		}
	}
}
