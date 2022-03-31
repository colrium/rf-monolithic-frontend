/** @format */
import Dexie from "dexie"
// import "dexie-observable"
import * as definations from "definations"

import { EventRegister } from "utils"

export default function () {
	let definations_stores = {}
	if (Array.isArray(Object.keys(definations))) {
		definations_stores = Object.entries(definations).reduce((prevValue, [key, value]) => {
			let columns = []
			if (!JSON.isEmpty(value?.scope?.columns) && value.cache) {
				columns = ["++id", "_id", "uuid"].concat(Object.keys(value?.scope?.columns))
			}
			if (!Array.isEmpty(columns)) {
				prevValue[key] = columns.join(",")
			}
			return prevValue
		}, {})
	}
	const db = new Dexie("realfield-data-cache")

	const checkQuota = async () => {
		let quota = null
		let totalSpace = 0
		let usedSpace = 0
		if ("storage" in navigator && "estimate" in navigator.storage) {
			quota = await navigator.storage.estimate()
			totalSpace = quota.quota
			usedSpace = quota.usage

			console.log("checkQuota quota", quota, "bytes")
			console.log("checkQuota totalSpace", totalSpace)
			console.log("checkQuota usedSpace", usedSpace)
		}
	}
	db.version(1).stores({
		...definations_stores,
		inbox: "++id,_id,type,recipients,group_admins,group_name,archives,deletions,status,owner,uuid,participants,messages,state,started_by",
		conversations:
			"++id,_id,type,recipients,group_admins,group_name,archives,deletions,status,owner,uuid,participants,messages,state,started_by",
		messages:
			"++id,_id,type,archives,deletions,reads,receipts,attachments,is_reply,reply_for,conversation,conversatio_uuid,status,sender,uuid,content,state,timestamp",
		CacheDatabaserequests: "++id,scope,params",
	})

	// checkQuota()
	db.open()
	// db.on("changes", function (changes) {
	// 	changes.forEach(function (change) {
	// 		switch (change.type) {
	// 			case 1:
	// 				EventRegister.emit(`cacheDbChange`, { ...change, name: "created" })
	// 				console.log("An object was created: " + JSON.stringify(change.obj))
	// 				break
	// 			case 2: // UPDATED
	// 				EventRegister.emit(`cacheDbChange`, { ...change, name: "updated" })
	// 				console.log("An object with key " + change.key + " was updated with modifications: " + JSON.stringify(change.mods))
	// 				break
	// 			case 3: // DELETED
	// 				EventRegister.emit(`cacheDbChange`, { ...change, name: "deleted" })
	// 				console.log("An object was deleted: " + JSON.stringify(change.oldObj))
	// 				break
	// 		}
	// 	})
	// })

	return db
}
