/** @format */

import * as React from "react"
import createPersistedState from "use-persisted-state"

const STORAGE_KEY = "APP_VERSION"

const defaultProps = {
	duration: 60 * 1000,
	auto: false,
	storageKey: STORAGE_KEY,
	basePath: "",
	filename: "meta.json",
}

const useClearCache = props => {
	const { duration, auto, storageKey, basePath, filename } = {
		...defaultProps,
		...props,
	}
	const fetchCacheTimeoutRef = React.useRef(null)
	const [loading, setLoading] = React.useState(true)
	const useAppVersionState = createPersistedState(storageKey)
	const [appVersion, setAppVersion] = useAppVersionState("")
	const [isLatestVersion, setIsLatestVersion] = React.useState(true)
	const [latestVersion, setLatestVersion] = React.useState(appVersion)

	async function setVersion(version) {
		await setAppVersion(version)
	}

	const emptyCacheStorage = async version => {
		if ("caches" in window) {
			// Service worker cache should be cleared with caches.delete()
			const cacheKeys = await window.caches.keys()
			await Promise.all(
				cacheKeys.map(key => {
					window.caches.delete(key)
				})
			)
		}

		// clear browser cache and reload page
		await setVersion(version || latestVersion)
		window.location.replace(window.location.href)
	}

	// Replace any last slash with an empty space
	const baseUrl = basePath.replace(/\/+$/, "") + "/" + filename

	function fetchMeta() {
		try {
			fetch(baseUrl, {
				cache: "no-store",
			})
				.then(response => response.json())
				.then(meta => {
					const newVersion = meta.version
					const currentVersion = appVersion
					const isUpdated = newVersion === currentVersion
					if (!isUpdated && !auto) {
						setLatestVersion(newVersion)
						setLoading(false)
						if (appVersion) {
							setIsLatestVersion(false)
						} else {
							setVersion(newVersion)
						}
					} else if (!isUpdated && auto) {
						emptyCacheStorage(newVersion)
					} else {
						setIsLatestVersion(true)
						setLoading(false)
					}
				})
		} catch (err) {
			console.error(err)
		}
	}

	React.useEffect(() => {
		fetchCacheTimeoutRef.current = setInterval(() => fetchMeta(), duration)
		return () => {
			clearInterval(fetchCacheTimeoutRef.current)
			fetchCacheTimeoutRef.current = null
		}
	}, [loading])

	const startVersionCheck = React.useRef(() => {})
	const stopVersionCheck = React.useRef(() => {})

	startVersionCheck.current = () => {
		if (window.navigator.onLine) {
			fetchCacheTimeoutRef.current = setInterval(() => fetchMeta(), duration)
		}
	}

	stopVersionCheck.current = () => {
		clearInterval(fetchCacheTimeoutRef.current)
		fetchCacheTimeoutRef.current = null
	}

	React.useEffect(() => {
		window.addEventListener("focus", startVersionCheck.current)
		window.addEventListener("blur", stopVersionCheck.current)
		;() => {
			window.removeEventListener("focus", startVersionCheck.current)
			window.removeEventListener("blur", stopVersionCheck.current)
		}
	}, [])

	React.useEffect(() => {
		fetchMeta()
	}, [])

	return {
		loading,
		isLatestVersion,
		emptyCacheStorage,
		latestVersion,
	}
}
export default useClearCache
