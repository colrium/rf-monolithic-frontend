import { useCallback, useState } from 'react';

const useSetState = (initialState = {}) => {
	const [state, set] = useState(initialState);
	const setState = useCallback((patch) => {
		set((prevState) =>
			Object.assign({}, prevState, patch instanceof Function ? patch(prevState) : patch)
		);
	}, []);

	return [state, setState];
};

export default useSetState;

// import { useCallback, useEffect, useRef, useReducer } from 'react';


// const useSetState = (value = {}) => {
// 	const initialState = useRef(value).current;

// 	const [state, dispatch] = useReducer((state, nextState) => ({ ...state, ...nextState }), initialState);
// 	const mountedRef = useRef(false)
// 	const prevStateRef = useRef(initialState);
// 	const currentStateRef = useRef(initialState)
// 	const lastChangesRef = useRef({})
// 	useEffect(() => {
// 		mountedRef.current = true
// 		return () => (mountedRef.current = false)
// 	}, []);

// 	const getStateChanges = useRef(async (currentState, nextState) => () => {
// 		currentState = currentState ? currentState : {}
// 		nextState = nextState ? nextState : {};
// 		let stateChanges = {};
// 		const changedProps = Object.difference(currentState, nextState, false);
// 		if (Array.isArray(changedProps) && changedProps.length > 0) {
// 			changedProps.map(changedProp => {
// 				stateChanges[changedProp] = [currentState[changedProp], nextState[changedProp]];
// 			})
// 		}
// 		return stateChanges;
// 	}).current;

// 	const triggerChangeEffects = useRef((currentState, nextState, callback = null) => async () => {
// 		const stateChanges = await getStateChanges(currentState, nextState, false).catch(error => console.log("getStateChanges error", error));
// 		if (Function.isFunction(callback)) {
// 			try {
// 				callback(stateChanges);
// 			} catch (error) {
// 				console.log("useSetState callback error", error)
// 			}
// 		}

// 		return { nextState, stateChanges };
// 	}).current;

// 	const safeSetState = useCallback((patch, callBack = null) => async () => {
// 		let nextStateChanges = {};
// 		if (Function.isFunction(patch)) {
// 			nextStateChanges = await Promise.all([patch(currentStateRef.current)]).then(res => ({ ...res[0] })).catch(err => ({}));
// 		}
// 		else {
// 			nextStateChanges = { ...patch }
// 		}
// 		if (!JSON.isEmpty(nextStateChanges) && mountedRef.current) {
// 			let nextState = { ...currentStateRef.current, ...nextStateChanges };
// 			if (!Object.areEqual(currentStateRef.current, nextState)) {
// 				prevStateRef.current = { ...currentStateRef.current };
// 				dispatch(nextStateChanges);
// 				triggerChangeEffects(prevStateRef.current, nextStateChanges, callBack).then(({ nextState, stateChanges }) => {
// 					currentStateRef.current = nextState;
// 					//lastChangesRef.current = stateChanges; 
// 				}).catch(error => console.log("triggerChangeEffects error", error));
// 			}
// 		}
// 	}, []);

// 	return [state, safeSetState, lastChangesRef.current]

// };

// export default useSetState;

