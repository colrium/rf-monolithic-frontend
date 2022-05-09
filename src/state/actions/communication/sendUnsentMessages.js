/** @format */
import getUnsentMessages from "./getUnsentMessages"
import sendMessage from "./sendMessage"

export default function sendUnsentMessages(conversation = null) {
	return async (dispatch, getState) => {
		const { auth } = getState()
		if (auth.isAuthenticated) {
			const unsent_messages = await dispatch(getUnsentMessages(conversation))
			if (unsent_messages.length > 0) {
				for (let index = 0; index < unsent_messages.length; index++) {
					const sentmessage = await dispatch(sendMessage(unsent_messages[index]))
				}
			}
		}
	}
}
