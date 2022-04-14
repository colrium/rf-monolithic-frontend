/** @format */
import {useRef, useEffect} from 'react'

const useForwardedRef = ref => {
	const innerRef = useRef(null)
	useEffect(() => {
		if (!ref) return
		if (Function.isFunction(ref)) {
			ref(innerRef.current)
		} else {
			ref.current = innerRef.current
		}
	})

	return innerRef
}

export default useForwardedRef;
