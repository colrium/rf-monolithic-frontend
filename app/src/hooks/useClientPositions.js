/** @format */

import { useCallback, useRef } from "react"
import { useMap, useGeolocation } from "react-use"
import { useNetworkServices } from "contexts"
import { useDidMount, useDidUpdate } from "hooks"

const useClientPositions = options => {
	const { markers = true, infowindows = true, animations = true, filter = {} } = { ...options }
	const { SocketIO } = useNetworkServices()
	const [value, { set, setAll, get, remove, reset, ...rest }] = useMap({})
	const googleMap = useRef(null)
	const clientLocationAck = useRef(false)
	const clientLocation = useGeolocation()

	const handleOnClientLocation = useCallback(
		gLocation => {
			SocketIO.emit("client-position-changed", { ...gLocation })
		},
		[SocketIO]
	)

	const handleOnClientPositions = useCallback(
		data => {
			reset()

			let positions = {}
			console.log("handleOnClientPositions data", data)
			// setAll(positions)
		},
		[markers, googleMap]
	)

	const handleOnClientPosition = useCallback(
		data => {
			const { id, user, latitude, longitude, heading, accuracy, altitude, ...pos } = { ...data }
			const existing = !!id ? get(id) : null
			const title = !JSON.isEmpty(existing)
				? existing.title
				: `${user?.first_name ? user?.first_name : ""} ${user?.last_name ? user?.first_name + " " : ""}`
			const subTitle = !JSON.isEmpty(existing)
				? existing.subTitle
				: `${user?.role ? user?.role.humanize() + ":" : ""} ${user?.presence ? user?.presence.humanize() : ""}`
			const icon = `${process.env.PUBLIC_URL}/img/avatars/${user.icon || "default"}.png`
			const marker = !JSON.isEmpty(existing)
				? existing.marker
				: new google.maps.Marker({
						position: { lat: latitude, lng: longitude },
						title: title,
						icon: {
							url: icon,
							scaledSize: new google.maps.Size(30, 30),
						},
				  })
			marker.setMap(googleMap.current)
			set(id, { ...existing, user, latitude, longitude, title, marker, icon, subTitle, ...pos })
		},
		[markers]
	)

	const handleOnClientPositionUnavailable = useCallback(
		data => {
			const { id, ...pos } = { ...data }
			// remove(id)
		},
		[markers, googleMap]
	)

	const handleOnSocketIOConnect = useCallback(
		socket => {
			// console.log("handleOnSocketIOConnect socket.id", socket.id)
			SocketIO.emit("get-client-positions", { ...filter })
		},
		[filter]
	)

	const handleOnUserPresenceChanged = useCallback(({ user, presence }) => {
		const position = get(user)
		console.log("handleOnUserPresenceChanged position", position)
		console.log("handleOnUserPresenceChanged user", user, "presence", presence)
		if (!!position?.user?.presence && position?.user?.presence !== presence) {
			set(user, { ...position, user: { ...user, presence: presence } })
		}
	}, [])

	const handleOnClientLocationAck = useCallback(() => {
		if (!clientLocationAck.current) {
			clientLocationAck.current = true
		}
	}, [])

	useDidMount(() => {
		SocketIO.on("clients-positions", handleOnClientPositions)
		SocketIO.on("new-client-position", handleOnClientPosition)
		SocketIO.on("client-position-changed", handleOnClientPosition)
		SocketIO.on("client-position-unavailable", handleOnClientPositionUnavailable)
		SocketIO.on("user-changed-presence", handleOnUserPresenceChanged)
		SocketIO.on("client-position-acknowledged", handleOnClientLocationAck)
		if (SocketIO.connected) {
			SocketIO.emit("get-client-positions", { ...filter })
			if (!clientLocation.loading) {
				handleOnClientLocation(clientLocation)
			}
		}

		SocketIO.on("connect", handleOnSocketIOConnect)

		return () => {
			SocketIO.off("clients-positions", handleOnClientPositions)
			SocketIO.off("new-client-position", handleOnClientPosition)
			SocketIO.off("client-position-changed", handleOnClientPosition)
			SocketIO.off("client-position-unavailable", handleOnClientPositionUnavailable)
		}
	})

	const setGoogleMap = useCallback(
		googlemap => {
			googleMap.current = googlemap
		},
		[value]
	)

	const setCurrentClientPosition = useCallback(
		position => {
			googleMap.current = googlemap
		},
		[value]
	)

	useDidUpdate(() => {
		// console.log("useClientPositions geoLocation", geoLocation)
		if (!clientLocation.loading) {
			handleOnClientLocation(clientLocation)
		}
	}, [clientLocation])

	console.log("useClientPositions value", value)

	return [value, { get, set, setAll, remove, reset, ...rest }, setGoogleMap, setCurrentClientPosition]
}

export default useClientPositions
