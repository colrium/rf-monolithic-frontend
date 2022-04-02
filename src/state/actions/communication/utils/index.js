
export const getIndexOfConversation = (entries, target) => {
	let index = -1

	if (Array.isArray(entries) && !!target) {
		const target_id = target?._id || target
		const target_uuid = target?.uuid || target
		index = entries.findIndex(
			entry =>
				(!String.isEmpty(entry.uuid) && entry.uuid === target_uuid) ||
				(!String.isEmpty(entry._id) && entry._id === target_id)
		)
	}

	return index;
}

export const getIndexOfMessage = (entries, target) => {
	let index = -1

	if (Array.isArray(entries) && !!target) {
		const target_id = target?._id || target
		const target_uuid = target?.uuid || target
		index = entries.findIndex(
			entry =>
				(!String.isEmpty(entry.uuid) && entry.uuid === target_uuid) ||
				(!String.isEmpty(entry._id) && entry._id === target_id)
		)
	}

	return index
}

export const concatMessages = (entries, targets, sort = "desc") => {
	let allEntries = Array.isArray(entries) ? [...entries] : []

	if (Array.isArray(targets)) {
		targets.map(target => {
			let index = getIndexOfMessage(allEntries, target)
			if (index === -1) {
				allEntries.push(target)
			} else {
				allEntries[index] = JSON.merge(allEntries[index], target)
			}
		})
	} else if (JSON.isJSON(targets)) {
		let indexOfTarget = getIndexOfMessage(allEntries, targets)
		if (indexOfTarget === -1) {
			allEntries.push(targets)
		} else {
			allEntries[indexOfTarget] = JSON.merge(allEntries[indexOfTarget], targets)
		}
	}
	if (sort === "desc") {
		allEntries = allEntries.sort((a, b) => {
			return Date.parseFrom(a.timestamp || a.created_on) - Date.parseFrom(b.timestamp || b.created_on)
		})
	} else if (sort === "asc") {
		allEntries = allEntries.sort((a, b) => {
			return Date.parseFrom(b.timestamp || b.created_on) - Date.parseFrom(a.timestamp || a.created_on)
		})
	}

	return allEntries
}
