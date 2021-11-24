import { useCallback, useEffect, useRef } from 'react';
import { useUpdate, usePrevious } from 'react-use';

const useSetState = (initialState = {}) => {
	const update = useUpdate();
	const state = useRef({ ...(initialState) });
	const isMountedRef = useRef(false);
	const prevState = useRef({});
	useEffect(() => {
		isMountedRef.current = true
		return () => (isMountedRef.current = false)
	}, []);

	const getState = useCallback(() => state.current, []);
	const getPreviousState = useCallback(() => prevState.current, []);

	const setState = useCallback((patch) => {
		if (!patch) {
			return;
		}
		const staleState = JSON.fromJSON(state.current);
		if (JSON.isJSON(patch)) {
			Object.assign(state.current, staleState, patch);
			if (!Object.areEqual(staleState, state.current) && isMountedRef.current) {
				prevState.current = staleState
				update();
			}
		}
		else if (Function.isFunction(patch)) {
			Promise.all([patch(staleState)]).then(patches => {
				if (Array.isArray(patches)) {
					if (JSON.isJSON(patches[0])) {
						Object.assign(state.current, staleState, patches[0]);
					}
					if (!Object.areEqual(staleState, state.current) && isMountedRef.current) {
						prevState.current = staleState;
						update();
					}
				}
			}).catch(error => console.error("useSetState error", error))
		}
	}, []);

	return [state.current, setState, getState, getPreviousState];
};

export default useSetState;
