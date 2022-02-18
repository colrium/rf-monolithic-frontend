import { useEffect, useRef } from 'react';

const useDidMount = (callback = () => {}, useEffectHabitCurb=[]) => {
    const isMountedRef = useRef(false);
    useEffect(() => {
		isMountedRef.current = true
		let res = null
		if (Function.isFunction(callback)) {
			res = callback()
		}
		return () => {
			isMountedRef.current = false
			if (Function.isFunction(res)) {
				res()
			}
		}
	}, [])
    return isMountedRef.current;
};

export default useDidMount;
