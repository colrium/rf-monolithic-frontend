/** @format */
import { useCallback, useMemo, useState } from "react"
function createImmutableQueue(entries = []) {
	return {
		add(id, data) {
			const matchIndex = entries.findIndex(n => {
				return n.id === id
			})
			const copy = entries.slice()
			if (matchIndex > -1) {
				copy.splice(matchIndex, 1, {
					id,
					data,
				})
			} else {
				copy.push({
					id,
					data,
				})
			}
			return createImmutableQueue(copy)
		},
		remove(id) {
			return createImmutableQueue(entries.filter(n => n.id !== id))
		},
		removeAll() {
			return createImmutableQueue()
		},
		entries,
	}
}

const useQueue = (initialValue = []) => {
	const [{ entries }, setQueue] = useState(createImmutableQueue(initialValue))

	/**
	 * Add a new notification to the queue. If the ID already exists it will updated.
	 * @param id Unique string identifier for notification.
	 * @param data
	 */
	const add = useCallback(
		(id, data) => {
			setQueue(queue => queue.add(id, data))
		},
		[setQueue]
	)

	/**
	 * Remove a notification by ID
	 * @param id Unique string identifier for a notification
	 */
	const remove = useCallback(
		id => {
			setQueue(queue => queue.remove(id))
		},
		[setQueue]
	)

	/**
	 * Remove all notifications from the page.
	 */
	const removeAll = useCallback(() => {
		setQueue(queue => queue.removeAll())
	}, [setQueue])

	return useMemo(
		() => ({
			add,
			remove,
			removeAll,
			entries,
		}),
		[add, remove, removeAll, entries]
	)
}

export default useQueue
