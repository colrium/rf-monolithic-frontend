/** @format */
import Dexie from "dexie"
// import "dexie-observable"
import * as definations from "definations"

import { EventRegister } from "utils"


class RealfieldDB extends Dexie {
	constructor() {
		super("rf-cache-db")
		this.version(1).stores({
			conversations:
				"++id,_id,uuid,type,recipients,group_admins,group_name,archives,deletions,status,owner,participants,state,started_by,created_on,last_used",
			messages:
				"++id,_id,uuid,type,archives,deletions,reads,receipts,attachments,is_reply,reply_for,conversation,conversation_uuid,status,sender,content,state,timestamp,created_on",
			contacts: "++id,_id,uuid,first_name,last_name,icon,avatar,email_address,role,gender,rating,staff_id,presence,course",
			client_positions: "&id,user,latitude,longitude",
		})
		try {
			this.open()
		} catch (error) {
			console.log("RealfieldDB open error", error)
		}
	}
}
const db = new RealfieldDB()
export default db
