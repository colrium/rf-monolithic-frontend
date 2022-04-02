/** @format */

export default function(data) {
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
