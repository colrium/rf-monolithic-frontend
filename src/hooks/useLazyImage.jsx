import { useCallback, useEffect, useRef } from 'react'

import { useMountedState } from 'react-use';
import useSetState from './useSetState';
import useForwardedRef from "./useForwardedRef"
import useDidUpdate from "./useDidUpdate"
import useDidMount from "./useDidMount"

const useLazyImage = props => {
	const {
		src,
		fallback = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAD0lEQVR42mNkwAIYh7IgAAVVAAuInjI5AAAAAElFTkSuQmCC`,
		placeholder,
		ref,
		cache = true,
		...intersectionObserverOptions
	} = { ...props }
	const elementRef = useForwardedRef(ref)
	const imageRef = useRef(new Image())
	const objectUrlRef = useRef(null)
	const isMounted = useMountedState()
	const [state, setState, getState] = useSetState({
		loading: true,
		src: null,
		error: null,
		loaded: false,
	})

	const getSrcImage = async srcUrl => {
		if (String.isString(srcUrl) && String.containsUrl(srcUrl) && caches) {
			if (!objectUrlRef.current) {
				return await caches.open("lazy-loaded-images").then(async cacheStorage => {
					let cachedResponse = await cacheStorage.match(srcUrl)

					if (!cachedResponse || !cachedResponse.ok) {
						if (!cachedResponse) {
							cachedResponse = await cacheStorage.add(srcUrl)
						}

						throw srcUrl
					}

					objectUrlRef.current = URL.createObjectURL(await cachedResponse.clone().blob())
					console.log("objectUrlRef.current", objectUrlRef.current)

					return objectUrlRef.current
				})
			} else {
				return objectUrlRef.current
			}
		} else {
			throw srcUrl
		}
	}

	const onImageLoad = useCallback(
		event => {
			//
			imageRef.current.onload = null
			setState({
				loading: false,
				error: null,
				loaded: true,
			})
		},
		[fallback, placeholder]
	)

	const onImageError = useCallback(
		event => {
			//
			imageRef.current.onerror = null
			if (isMounted && !String.isEmpty(imageRef.current.src)) {
				setState({
					loading: false,
					error: event,
				})
				imageRef.current.src = fallback || placeholder
			}
		},
		[fallback, placeholder]
	)

	const loadImage = useCallback(
		imgSrc => {
			setState({
				loading: true,
				error: null,
			})
			imageRef.current.onload = onImageLoad
			imageRef.current.onerror = onImageError
			getSrcImage(imgSrc)
				.then(cachedSrc => {
					console.log("loadImage cachedSrc", cachedSrc)
					setState({
						loading: false,
						error: null,
						src: cachedSrc,
					})

					imageRef.current.src = cachedSrc
				})
				.catch(error => {
					console.log("loadImage error", error)
					setState({
						loading: false,
						error: error,
						src: fallback || placeholder,
					})
					imageRef.current.src = imgSrc
				})
		},
		[fallback, placeholder]
	)
	useDidMount(() => {
		let observer = undefined
		let didCancel = false
		const currentState = getState()
		// if (!currentState.loaded) {
		// 	imageRef.current.src = currentState.placeholder || currentState.fallback
		// } else if (currentState.error) {
		// 	imageRef.current.src = currentState.fallback || currentState.placeholder
		// }
		// loadImage(src)
		if ("IntersectionObserver" in window && elementRef && elementRef.current instanceof Element) {
			// reload image when prop - src changed

			observer = new IntersectionObserver(entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						// change state
						loadImage(src)

						// don't need to observe anymore
						observer.unobserve(entry.target)
					}
				})
			}, intersectionObserverOptions)
			// start to observe element
			observer.observe(elementRef.current)
		} else {
			// baseline: load image after componentDidMount
			loadImage(currentState.src)
		}
		return () => {
			didCancel = true
			imageRef.current.onerror = null
			imageRef.current.onload = null
			// on component cleanup, we remove the listner
			if (observer && elementRef.current instanceof Element) {
				observer.unobserve(elementRef.current)
			}
		}
	})

	useDidUpdate(() => {
		const { error } = getState()
		if (error) {
			setState({ fallback, src: fallback })
		}
	}, [fallback])

	useDidUpdate(() => {
		setState(prevState => ({ placeholder, src: prevState.error ? placeholder : prevState.src }))
	}, [placeholder])

	useDidUpdate(() => {
		objectUrlRef.current = false
		loadImage(src)
	}, [src])

	return [state.src || placeholder || fallback, { ...state, ref: elementRef, fallback: fallback, placeholder: placeholder }]
}
export default useLazyImage
