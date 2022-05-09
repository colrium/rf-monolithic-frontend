/** @format */

import dexieDB from "../database"
import depopulate from "./depopulate"

export const onContact = async contact => {
	const entryID = contact?.uuid || contact?._id || contact
	let dexieDBEntry = null
	if (!String.isEmpty(entryID)) {
		try {
			dexieDBEntry = await dexieDB.contacts.where("uuid").equalsIgnoreCase(entryID).or("_id").equalsIgnoreCase(entryID).last()
			if (JSON.isJSON(contact)) {
				let nextDexieDBEntry = { ...dexieDBEntry, ...contact }

				dexieDB.contacts.put(nextDexieDBEntry)
			} else if (!JSON.isJSON(dexieDBEntry) || JSON.isEmpty(dexieDBEntry)) {
				Api.get(`/contacts/${entryID}`, {}).then(res => {
					const { body } = { ...res }
					if (!!body?.data) {
						onContact(body?.data)
					}
				})
			}
		} catch (error) {
			console.error("onContact error", error)
		}
	}

	return dexieDBEntry
}

export const onContacts = async contacts => {
	if (Array.isArray(contacts)) {
		contacts.map(contact => onContact(contact))
	}
}
