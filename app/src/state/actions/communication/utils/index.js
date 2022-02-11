
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

export const concatMessages = (entries, targets) => {
	let allEntries = Array.isArray(entries)? [...entries] : []


		if (Array.isArray(targets)) {
			let targetsEntries = targets.reduce(
				(prevAllEntries, target) => {
					let index = getIndexOfMessage(allEntries, target)
					if (index === -1) {
						prevAllEntries.push(target)
					}
					else {
						allEntries[index] = JSON.merge(allEntries[index], target)
					}
					return prevAllEntries
				},
				[]
			)
			allEntries = allEntries.concat(targetsEntries).sort((a, b) => {
				if (a.timestamp && b.timestamp) {
					return (
						Date.parseFrom(a.timestamp) -
						Date.parseFrom(b.timestamp)
					)
				}
				else {
					return -1
				}
			})
		}

	return allEntries
}
