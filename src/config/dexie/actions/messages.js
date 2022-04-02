import dexieDB from "../database"
function depopulate(data){
	let unPopulated = data

	if (JSON.isJSON(data)) {
		unPopulated = Object.entries(data).reduce((acc, [key, value]) => {
			if (Array.isArray(value)) {
				acc[key] = depopulate(value)
			} else if (JSON.isJSON(value) && "_id" in value) {
				acc[key] = value._id
			} else {
				acc[key] = value
			}

			return acc
		}, {})
	} else if (Array.isArray(data)) {
		unPopulated = data.reduce((acc, [key, value]) => {
			if (Array.isArray(value)) {
				acc.push(depopulate(value))
			} else if (JSON.isJSON(value) && "_id" in value) {
				acc.push(value._id)
			} else {
				acc.push(value)
			}
			return acc
		}, [])
	}
	return unPopulated
}
export const onMessageMarkedAsRead =  async data => {
			const messageID = data?.message?.uuid || data?.message?._id || data?.message
			const userID = data?.user?._id || data?.user
			let dbEntry = null
			if (!String.isEmpty(messageID)) {
				try {
					dbEntry = await dexieDB.messages.where("uuid").equalsIgnoreCase(messageID).or("_id").equalsIgnoreCase(messageID).last()
					if (JSON.isJSON(data.message)) {
						dbEntry = depopulate({ ...dbEntry, ...data.message })
						const pkPath = !String.isEmpty(dbEntry) ? "uuid" : "_id"
						dexieDB.messages.put(dbEntry)
					} else if (!dbEntry) {
						Api.get(`/messages/${messageID}`, {}).then(res => {
							const { body } = { ...res }
							if (!!body?.data) {
								const pkPath = !String.isEmpty(body.data?.uuid) ? "uuid" : "_id"
								dexieDB.messages.put(body.data)
							}
						})
					} else if (!!dbEntry && dbEntry.state !== "read") {
						dbEntry.state = "read"
						dbEntry.reads = Array.isArray(dbEntry.reads) ? dbEntry.reads.concat([userID]) : [userID]
						const pkPath = !String.isEmpty(dbEntry.uuid) ? "uuid" : "_id"
						dexieDB.messages.put(dbEntry)
					}

					console.error("onMessageMarkedAsRead dbEntry", dbEntry)
				} catch (error) {
					console.error("Mark Message As Read error", error)
				}
			}

			return dbEntry

	}
export const onMessageMarkedAsReceived = async data => {
			const messageID = data?.message?.uuid || data?.message?._id || data?.message
			const userID = data?.user?._id || data?.user
			let dbEntry = null
			if (!String.isEmpty(messageID)) {
				try {
					dbEntry = await dexieDB.messages.where("uuid").equalsIgnoreCase(messageID).or("_id").equalsIgnoreCase(messageID).last()
					if (JSON.isJSON(data.message)) {
						dbEntry = depopulate({ ...dbEntry, ...data.message })
						const pkPath = !String.isEmpty(dbEntry) ? "uuid" : "_id"
						dexieDB.messages.put(dbEntry)
					} else if (!dbEntry) {
						Api.get(`/messages/${messageID}`, {}).then(res => {
							const { body } = { ...res }
							if (!!body?.data) {
								const pkPath = !String.isEmpty(body.data?.uuid) ? "uuid" : "_id"
								dexieDB.messages.put(body.data)
							}
						})
					} else if (!!dbEntry && dbEntry.state !== "read" && dbEntry.state !== "received") {
						dbEntry.state = "received"
						dbEntry.receipts = Array.isArray(dbEntry.receipts) ? dbEntry.receipts.concat([userID]) : [userID]
						const pkPath = !String.isEmpty(dbEntry.uuid) ? "uuid" : "_id"
						dexieDB.messages.put(dbEntry)
					}

					console.error("onMessageMarkedAsRead dbEntry", dbEntry)
				} catch (error) {
					console.error("Mark Message As Read error", error)
				}
			}
		return dbEntry
	}

export const onMessageDeletedForAll = async data => {
			const messageID = data?.message?.uuid || data?.message?._id || data?.message
			const userID = data?.user?._id || data?.user
			let dbEntry = null
			if (!String.isEmpty(messageID)) {
				try {
					dbEntry = await dexieDB.messages.where("uuid").equalsIgnoreCase(messageID).or("_id").equalsIgnoreCase(messageID).last()
					if (JSON.isJSON(data.message)) {
						dbEntry = depopulate({ ...dbEntry, ...data.message })
						const pkPath = !String.isEmpty(dbEntry) ? "uuid" : "_id"
						dexieDB.messages.put(dbEntry)
					} else if (!dbEntry) {
						Api.get(`/messages/${messageID}`, {}).then(res => {
							const { body } = { ...res }
							if (!!body?.data) {
								const pkPath = !String.isEmpty(body.data?.uuid) ? "uuid" : "_id"
								dexieDB.messages.put(body.data)
							}
						})
					} else if (!!dbEntry) {
						dbEntry.state = "deleted-for-all"
						dbEntry.deletions = Array.isArray(dbEntry.deletions) ? dbEntry.deletions.concat([userID]) : [userID]
						const pkPath = !String.isEmpty(dbEntry.uuid) ? "uuid" : "_id"
						dexieDB.messages.put(dbEntry)
					}
				} catch (error) {
					console.error("Mark Message As Read error", error)
				}
			}
			return dbEntry

	}
export const onMessageDeletedForUser = async data => {
			const messageID = data?.message?.uuid || data?.message?._id || data?.message
			const userID = data?.user?._id || data?.user
			let dbEntry = null
			if (!String.isEmpty(messageID)) {
				try {
					dbEntry = await dexieDB.messages.where("uuid").equalsIgnoreCase(messageID).or("_id").equalsIgnoreCase(messageID).last()
					if (JSON.isJSON(data.message)) {
						dbEntry = depopulate({ ...dbEntry, ...data.message })
						const pkPath = !String.isEmpty(dbEntry) ? "uuid" : "_id"
						dexieDB.messages.put(dbEntry)
					} else if (!dbEntry) {
						Api.get(`/messages/${messageID}`, {}).then(res => {
							const { body } = { ...res }
							if (!!body?.data) {
								const pkPath = !String.isEmpty(body.data?.uuid) ? "uuid" : "_id"
								dexieDB.messages.put(body.data)
							}
						})
					} else if (!!dbEntry) {
						dbEntry.state = "deleted-for-user"
						dbEntry.deletions = Array.isArray(dbEntry.deletions) ? dbEntry.deletions.concat([userID]) : [userID]
						const pkPath = !String.isEmpty(dbEntry.uuid) ? "uuid" : "_id"
						dexieDB.messages.put(dbEntry)
					}
				} catch (error) {
					console.error("Mark Message As Read error", error)
				}
			}

	}

export const onMessageSent = async message => {
			const messageID = message?.uuid || message?._id || message
			let dbEntry = null
			if (!String.isEmpty(messageID)) {
				try {
					if (JSON.isJSON(message)) {
						dbEntry = depopulate(message)
						const pkPath = !String.isEmpty(dbEntry) ? "uuid" : "_id"
						dexieDB.messages.put(dbEntry)
					} else {
						Api.get(`/messages/${messageID}`, {}).then(res => {
							const { body } = { ...res }
							if (!!body?.data) {
								const pkPath = !String.isEmpty(body.data?.uuid) ? "uuid" : "_id"
								dexieDB.messages.put(depopulate(body.data))
							}
						})
					}
				} catch (error) {
					console.error("Mark Message As Read error", error)
				}
			}
			return dbEntry
	}

export const onNewMessage =  async message => {
			const messageID = message?.uuid || message?._id || message
			let dbEntry = null
			if (!String.isEmpty(messageID)) {
				try {
					if (JSON.isJSON(message)) {
						dbEntry = depopulate(message)
						const pkPath = !String.isEmpty(dbEntry) ? "uuid" : "_id"
						dexieDB.messages.put(dbEntry)
					} else {
						Api.get(`/messages/${messageID}`, {}).then(res => {
							const { body } = { ...res }
							if (!!body?.data) {
								const pkPath = !String.isEmpty(body.data?.uuid) ? "uuid" : "_id"
								dexieDB.messages.put(depopulate(body.data))
							}
						})
					}
				} catch (error) {
					console.error("Mark Message As Read error", error)
				}
			}

	}
export const onMessage = async message => {
	const entryID = message?.uuid || message?._id || message
	let dexieDBEntry = null
	if (!String.isEmpty(entryID)) {
		try {
			dexieDBEntry = await dexieDB.messages.where("uuid").equalsIgnoreCase(entryID).or("_id").equalsIgnoreCase(entryID).last()
			if (JSON.isJSON(message) && !JSON.isJSON(dexieDBEntry)) {
				let nextDexieDBEntry = { ...dexieDBEntry, ...message }
				nextDexieDBEntry = depopulate(nextDexieDBEntry)
				const pkPath = !String.isEmpty(nextDexieDBEntry.uuid) ? "uuid" : !String.isEmpty(nextDexieDBEntry._id) ? "_id" : null

				// if (!String.isEmpty(pkPath)) {
				// 	dexieDB.messages.put(nextDexieDBEntry)
				// }
				dexieDB.messages.put(nextDexieDBEntry)
			} else if (!JSON.isJSON(dexieDBEntry) || JSON.isEmpty(dexieDBEntry)) {
				Api.get(`/messages/${entryID}`, {}).then(res => {
					const { body } = { ...res }
					if (!!body?.data) {
						onMessage(body?.data)
					}
				})
			}
			console.log("onMessage dexieDBEntry", dexieDBEntry)
		} catch (error) {
			console.error("onMessage error", error)
		}
	}

	return dexieDBEntry
}

export const onMessages = async messages => {
	messages.map(message => onMessage(message))
}
