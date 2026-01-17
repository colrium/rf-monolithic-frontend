/**
 * Finds and returns a similar thunk or action in the actionQueue.
 * Else undefined.
 * @param action
 * @param actionQueue
 */
export default function getSimilarActionInQueue(action, actionQueue) {
	if (Object.isObject(action)) {
		return actionQueue.find(queued => Object.areEqual(queued, action));
	}
	if (Function.isFunction(action)) {
		return actionQueue.find(queued => action.toString() === queued.toString());
	}
	return undefined;
}
