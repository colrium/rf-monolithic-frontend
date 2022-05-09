/** @format */

import dexieDB from "../database"
import depopulate from "./depopulate"


export const onConversation = async conversation => {
			const entryID = conversation?.uuid || conversation?._id || conversation
			let dexieDBEntry = null
			if (!String.isEmpty(entryID)) {
				try {
					dexieDBEntry = await dexieDB.conversations
						.where("uuid")
						.equalsIgnoreCase(entryID)
						.or("_id")
						.equalsIgnoreCase(entryID)
						.last()
					if (JSON.isJSON(conversation)) {
						let nextDexieDBEntry = { ...dexieDBEntry, ...conversation }
						const pkPath = !String.isEmpty(nextDexieDBEntry.uuid)
							? "uuid"
							: !String.isEmpty(nextDexieDBEntry._id)
							? "_id"
							: null

						// if (!String.isEmpty(pkPath)) {
						// 	nextDexieDBEntry.last_used =
						// 		dexieDBEntry?.last_used || conversation?.last_used || conversation?.created_on || new Date()
						// 	dexieDB.conversations.put(nextDexieDBEntry)
						// }
						nextDexieDBEntry.last_used =
							dexieDBEntry?.last_used || conversation?.last_used || conversation?.created_on || new Date()
						dexieDB.conversations.put(nextDexieDBEntry)
					} else if (!JSON.isJSON(dexieDBEntry) || JSON.isEmpty(dexieDBEntry)) {
						Api.get(`/conversations/${entryID}`, {}).then(res => {
							const { body } = { ...res }
							if (!!body?.data) {
								onConversation(body?.data)
							}
						})
					}
				} catch (error) {
					console.error("onConversation error", error)
				}
			}

			return dexieDBEntry

	}

export const onInbox = async conversations => {
	conversations.map(conversation => onConversation(conversation))
}
