import dexieDB from "../database"
import { Api } from "services"
import { EventRegister } from "utils"

function depopulate(data) {
	let depopulated = data

	if (JSON.isJSON(data)) {
		depopulated = Object.entries(data).reduce((acc, [key, value]) => {
			if (Array.isArray(value)) {
				acc[key] = depopulate(value)
			} else if (JSON.isJSON(value) && "_id" in value) {
				acc[key] = value._id
			} else {
				acc[key] = value
			}

			return acc
		}, {})
	} else if (Array.isArray(data) && data.length > 0) {
		depopulated = data.reduce((acc, entry) => {
			if (Array.isArray(entry)) {
				acc.push(depopulate(entry))
			} else if (JSON.isJSON(entry) && "_id" in entry) {
				acc.push(entry._id)
			} else {
				acc.push(entry)
			}
			return acc
		}, [])
	}
	return depopulated
}

export const onMessage = async (message, newIncoming = false) => {
	const entryID = message?._id || message
	const entryUUID = message?.uuid || message
	let dexieDBEntry = null
	if (!String.isEmpty(entryID) || !String.isEmpty(entryUUID)) {
		try {
			dexieDBEntry = await dexieDB.messages
				.filter(
					item => {
						let include = false
						if (!String.isEmpty(entryID)) {
							include = item?._id === entryID || item?.uuid === entryID
						}
						if (!include && !String.isEmpty(entryUUID)) {
							include = item?._id === entryUUID || item?.uuid === entryUUID
						}
						return include
					}

				)
				.last()

			const pkPath = !String.isEmpty(dexieDBEntry?.uuid) ? "uuid" : !String.isEmpty(dexieDBEntry?._id) ? "_id" : null
			if (JSON.isJSON(message)) {
				const conversationID = message?.conversation?._id || message?.conversation || dexieDBEntry?.conversation
				const conversationUUID =
					message?.conversation?.uuid || message?.conversation_uuid || message?.conversation || dexieDBEntry?.conversation_uuid
				let conversation = null
				if (!String.isEmpty(conversationID) || !String.isEmpty(conversationUUID)) {
					conversation = await dexieDB.conversations
						.filter(
							item =>
								item?._id === conversationID ||
								item?._id === conversationUUID ||
								(item?.uuid && (item?.uuid === conversationID || item?.uuid === conversationUUID))
						)
						.last()
				}
				const depopulatedMessage = depopulate(message)
				let nextDexieDBEntry = { ...dexieDBEntry, ...message }
				nextDexieDBEntry = depopulate(nextDexieDBEntry)

				delete nextDexieDBEntry.__v
				if (Array.isArray(depopulatedMessage.deletions)) {
					nextDexieDBEntry.deletions = (dexieDBEntry?.deletions || []).concat([...depopulatedMessage.deletions])
				}
				if (Array.isArray(depopulatedMessage.receipts)) {
					nextDexieDBEntry.receipts = (dexieDBEntry?.receipts || []).concat([...depopulatedMessage.receipts])
				}
				if (Array.isArray(depopulatedMessage.reads)) {
					nextDexieDBEntry.reads = (dexieDBEntry?.reads || []).concat([...depopulatedMessage.reads])
				}
				if (Array.isArray(depopulatedMessage.archives)) {
					nextDexieDBEntry.archives = (dexieDBEntry?.archives || []).concat([...depopulatedMessage.archives])
				}

				const difference = Object.difference(message, dexieDBEntry)

				// console.log("message conversation", conversation)
				// console.log("message difference?.differences", difference)
				if (
					!JSON.isEmpty(conversation) /*  &&
					((Array.isArray(difference?.differences) && (difference?.differences > 0 || !JSON.isEmpty(dexieDBEntry))) ||
						!Array.isArray(difference?.differences)) */
				) {
					// console.log("nextDexieDBEntry", nextDexieDBEntry)
					// console.log("dexieDBEntry", dexieDBEntry)
					// console.log("message difference?.differences", difference)

					dexieDB.messages.put(nextDexieDBEntry)
				}
				if (!JSON.isEmpty(conversation) && newIncoming) {
					let senderName = null
					let sender_id = message?.sender._id || message?.sender
					if (!JSON.isEmpty(conversation) && Array.isArray(conversation?.participants)) {
						if (conversation.started_by?._id === sender_id) {
							senderName = conversation.started_by?.first_name + " " + conversation.started_by?.last_name
						} else {
							conversation.participants.map(participant => {
								if (senderName === sender_id && sender_id === participant?._id) {
									senderName = participant?.first_name + " " + participant?.last_name
								}
							})
						}

						const notification = {
							title: `${senderName === sender_id ? "New Message" : senderName}`,
							content: message.content,
							type: "info",
							mode: "snackbar",
							icon: "message",
						}
						EventRegister.emit("notification", notification)
					}
				}
			} else if (!JSON.isJSON(dexieDBEntry) || JSON.isEmpty(dexieDBEntry)) {
				Api.get(`/messages/${entryUUID || entryID}`, {}).then(res => {
					const { body } = { ...res }
					if (!!body?.data) {
						onMessage(body?.data)
					}
				})
			}
			// console.log("onMessage dexieDBEntry", dexieDBEntry)
		} catch (error) {
			console.error("onMessage error", error)
		}
	}

	return dexieDBEntry
}

export const onMessages = async messages => {
	messages.map(message => onMessage(message))
}
