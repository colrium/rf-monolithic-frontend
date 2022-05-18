/** @format */
/*global google*/

import { useCallback, useRef } from "react"
import { useMap, useGeolocation } from "react-use"
import { useNetworkServices } from "contexts"
import { useSelector } from "react-redux"
import ReactDOMServer from "react-dom/server"
import Grid from '@mui/material/Grid'

import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import { ThemeProvider } from "@mui/material/styles"
import { useDidMount, useDidUpdate, useSetState } from "hooks"
import { theme } from "assets/jss/app-theme"
import ApiService from "services/Api"
import { PersonOutlined as UserIcon } from "@mui/icons-material"
import Button from "@mui/material/Button"
import Rating from "@mui/material/Rating"
import { useSearchParams, useNavigate } from "react-router-dom"

if (typeof google !== "undefined") {
	google.maps.Marker.prototype.animateTo = function (newPosition, options) {
		var defaultOptions = {
			duration: 1000,
			easing: "linear",
			complete: null,
			pan: null,
		}
		options = options || {}

		// complete missing options
		for (var key in defaultOptions) {
			options[key] = options[key] || defaultOptions[key]
		}

		// make sure the pan option is valid
		if (options.pan !== null) {
			if (options.pan !== "center" && options.pan !== "inbounds") {
				return
			}
		}

		window.requestAnimationFrame =
			window.requestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.msRequestAnimationFrame
		window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame

		// save current position. prefixed to avoid name collisions. separate for lat/lng to avoid calling lat()/lng() in every frame
		this.AT_startPosition_lat = this.getPosition().lat()
		this.AT_startPosition_lng = this.getPosition().lng()
		var newPosition_lat = newPosition.lat()
		var newPosition_lng = newPosition.lng()
		var newPoint = new google.maps.LatLng(newPosition.lat(), newPosition.lng())

		if (options.pan === "center") {
			this.map.setCenter(newPoint)
		}

		if (options.pan === "inbounds") {
			if (!this.map.getBounds().contains(newPoint)) {
				var mapbounds = this.map.getBounds()
				mapbounds.extend(newPoint)
				this.map.fitBounds(mapbounds)
			}
		}

		// crossing the 180° meridian and going the long way around the earth?
		if (Math.abs(newPosition_lng - this.AT_startPosition_lng) > 180) {
			if (newPosition_lng > this.AT_startPosition_lng) {
				newPosition_lng -= 360
			} else {
				newPosition_lng += 360
			}
		}

		var animateStep = function (marker, startTime) {
			var ellapsedTime = new Date().getTime() - startTime
			var durationRatio = ellapsedTime / options.duration // 0 - 1
			var easingDurationRatio = durationRatio

			// // use jQuery easing if it's not linear
			// if (options.easing !== "linear") {
			// 	easingDurationRatio = jQuery.easing[options.easing](durationRatio, ellapsedTime, 0, 1, options.duration)
			// }

			if (durationRatio < 1) {
				var deltaPosition = new google.maps.LatLng(
					marker.AT_startPosition_lat + (newPosition_lat - marker.AT_startPosition_lat) * easingDurationRatio,
					marker.AT_startPosition_lng + (newPosition_lng - marker.AT_startPosition_lng) * easingDurationRatio
				)
				marker.setPosition(deltaPosition)

				// use requestAnimationFrame if it exists on this browser. If not, use setTimeout with ~60 fps
				if (window.requestAnimationFrame) {
					marker.AT_animationHandler = window.requestAnimationFrame(function () {
						animateStep(marker, startTime)
					})
				} else {
					marker.AT_animationHandler = setTimeout(function () {
						animateStep(marker, startTime)
					}, 17)
				}
			} else {
				marker.setPosition(newPosition)

				if (typeof options.complete === "function") {
					options.complete()
				}
			}
		}

		// stop possibly running animation
		if (window.cancelAnimationFrame) {
			window.cancelAnimationFrame(this.AT_animationHandler)
		} else {
			clearTimeout(this.AT_animationHandler)
		}

		animateStep(this, new Date().getTime())
	}
}


const ClientInfoWindow = ({ user, position, ...rest }) => {
	// const { preferences } = useSelector(state => state.app)
	// const navigate = useNavigate()
	return (
		<ThemeProvider theme={theme}>
			<Grid container style={{ maxWidth: 300 }}>
				<Grid item  xs={12} className={"flex flex-row items-center"}>
					{user?.avatar ? (
						<Avatar
							className="bg-transparent mr-4"
							alt={user?.first_name}
							src={ApiService.getAttachmentFileUrl(user?.avatar)}
						/>
					) : (
						<Avatar className="bg-transparent  mr-4">
							<UserIcon />{" "}
						</Avatar>
					)}
					<Typography variant="h5">{user?.first_name}</Typography>
				</Grid>

				<Grid item  xs={12} className={"flex flex-row items-center"}>
					<Typography className="mx-2 font-bold" variant="body1">
						Gender:
					</Typography>
					<Typography variant="body1">{user?.gender ? user?.gender : "Unspecified"}</Typography>
				</Grid>

				<Grid item  xs={12} className={"flex flex-row items-center"}>
					<Typography className="mx-2 font-bold" variant="body1">
						Course of Study:
					</Typography>
					<Typography variant="body1">{user?.course ? user?.course : "Unspecified"}</Typography>
				</Grid>

				<Grid item  xs={12} className={"flex flex-row items-center"}>
					<Typography className="mx-2 font-bold" variant="body1">
						Tasks Completed:
					</Typography>
					<Typography variant="body1">{user?.noof_completed_tasks ? user?.noof_completed_tasks : "0"}</Typography>
				</Grid>

				<Grid item  xs={12} className={"flex flex-row items-center"}>
					<Typography className="mx-2 font-bold" variant="body1">
						Uncompleted Tasks:
					</Typography>
					<Typography variant="body1">{user?.noof_uncompleted_tasks ? user?.noof_uncompleted_tasks : "0"}</Typography>
				</Grid>
				<Grid item  xs={12} className={"flex flex-col"}>
					<Typography className="mx-2 font-bold" variant="body1">
						Rating
					</Typography>
					<Rating name="read-only" value={user?.rating ? user?.rating : 4} readOnly />
				</Grid>

				<Grid item  xs={12} className={"flex flex-row items-center justify-center"}>
					<Button
						href={("/messaging/conversations?with=" + user?.email_address).toUriWithDashboardPrefix()}
						style={{ background: "#8C189B", color: "#FFFFFF" }}
					>
						Message Me
					</Button>
				</Grid>
			</Grid>
		</ThemeProvider>
	)
}

const useClientPositions = options => {
	const { markers = true, infowindows = true, animations = true, filter = {} } = { ...options }
	const { SocketIO } = useNetworkServices()
	const [value, { set, setAll, get, remove, reset, ...rest }] = useMap({})
	const clientsPositionsOpenPopups = useRef([])
	const googleMap = useRef(null)
	const geoLocationAck = useRef(false)
	const geoLocation = useGeolocation()
	const [state, setState, getState] = useSetState({})
	const handleOnGeoLocation = useCallback(
		gLocation => {
			SocketIO.emit("client-position-changed", { ...gLocation })
		},
		[SocketIO]
	)
	const showClientInfoWindow = useCallback(id => {
		const { marker, ...data } = getState()[id]
		if ((googleMap.current, marker && !clientsPositionsOpenPopups.current.includes(id))) {
			var infoWindow = new google.maps.InfoWindow({
				content: ReactDOMServer.renderToStaticMarkup(<ClientInfoWindow {...data} />),
			})
			infoWindow.open(googleMap.current, marker)
			clientsPositionsOpenPopups.current.push(id)
			google.maps.event.addListener(infoWindow, "closeclick", function () {
				let position = clientsPositionsOpenPopups.current.indexOf(id)
				clientsPositionsOpenPopups.current = clientsPositionsOpenPopups.current.remove(position)
				if (!Array.isArray(clientsPositionsOpenPopups.current)) {
					clientsPositionsOpenPopups.current = []
				}
			})
		}
	}, [])
	const handleOnClickClientPositionMarker = useCallback(
		id => () => {
			if (!geoLocationAck.current) {
				geoLocationAck.current = true
			}
		},
		[]
	)

	const handleOnClientPosition = useCallback(
		data => {
			const { id, user, latitude, longitude, heading, accuracy, altitude, ...pos } = { ...data }
			if (id && user) {
				const existing = getState()[id]
				const title = !JSON.isEmpty(existing)
					? existing.title
					: `${user?.first_name ? user?.first_name.replaceAll(" ", "").humanize() : ""} ${
							user?.last_name ? user?.last_name.replaceAll(" ", "").humanize() : ""
					  }`
				const subTitle = !JSON.isEmpty(existing)
					? existing.subTitle
					: `${user?.role ? user?.role.humanize() + ":" : ""} ${user?.presence ? user?.presence.humanize() : ""}`
				const icon = `${process.env.PUBLIC_URL}/img/avatars/${user?.icon || "default"}.png`
				const marker = !JSON.isEmpty(existing)
					? existing.marker
					: new google.maps.Marker({
							map: googleMap.current,
							position: { lat: latitude, lng: longitude },
							title: title,
							icon: {
								url: icon,
								scaledSize: new google.maps.Size(30, 30),
							},
					  })
				if (existing?.marker) {
					marker.animateTo(new google.maps.LatLng(latitude, longitude))
					//
				} else {
					google.maps.event.addListener(marker, "click", function () {
						showClientInfoWindow(id)
					})
				}

				// marker.setMap(googleMap.current)
				setState({ [id]: { ...existing, user, latitude, longitude, title, marker, icon, subTitle, ...pos } })
			}
		},
		[markers]
	)

	const handleOnClientPositions = useCallback(
		clientPositions => {
			// reset()
			if (Array.isArray(clientPositions)) {
				clientPositions.map(clientPosition => handleOnClientPosition(clientPosition))
			}
		},
		[markers, googleMap]
	)

	const handleOnClientPositionUnavailable = useCallback(
		data => {
			const { id, ...pos } = { ...data }
			// remove(id)
		},
		[markers, googleMap]
	)

	const handleOnSocketIOConnect = useCallback(
		() => {
			SocketIO.emit("get-client-positions", { ...filter })
		},
		[filter]
	)
	const handleOnSocketIODisconnect = useCallback(() => {
		const currentState = getState()
		Object.entries(currentState).map(([id, value]) => {
			if (value.marker instanceof google.maps.Marker) {
				value.marker.setMap(null)
			}
		})
		setState({})

	}, [])


	const handleOnUserPresenceChanged = useCallback(({ user, presence }) => {
		const position = get(user)
		if (!!position?.user?.presence && position?.user?.presence !== presence) {
			set(user, { ...position, user: { ...user, presence: presence } })
		}
	}, [])

	const handleOnClientLocationAck = useCallback(() => {
		if (!geoLocationAck.current) {
			geoLocationAck.current = true
		}
	}, [])

	useDidMount(() => {
		// var geolocationInterval = setInterval(() => {
		// 	handleOnGeoLocation({ longitude: 36.746521 + Math.random() * 0.001, latitude: -1.164471 + Math.random() * 0.001 })
		// }, 5000)
		SocketIO.on("clients-positions", handleOnClientPositions)
		SocketIO.on("new-client-position", handleOnClientPosition)
		SocketIO.on("client-position-changed", handleOnClientPosition)
		SocketIO.on("client-position-unavailable", handleOnClientPositionUnavailable)
		SocketIO.on("user-changed-presence", handleOnUserPresenceChanged)
		SocketIO.on("client-position-acknowledged", handleOnClientLocationAck)
		if (SocketIO.connected) {
			SocketIO.emit("get-client-positions", { ...filter })
			if (!geoLocation.loading) {
				handleOnGeoLocation(geoLocation)
			}
		}

		SocketIO.on("connect", handleOnSocketIOConnect)
		SocketIO.on("disconnect", handleOnSocketIODisconnect)

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
			Object.entries(getState()).forEach(([id, entry]) => {
				entry.marker?.setMap(googlemap)
			})
		},
		[value]
	)

	const setGeoLocation = useCallback(position => {
		handleOnGeoLocation(position)
	}, [])

	useDidUpdate(() => {
		if (!geoLocation.loading) {
			handleOnGeoLocation(geoLocation)
		}
	}, [geoLocation])

	return [state, { get, set, setAll, remove, reset, setGoogleMap, setGeoLocation, ...rest }]
}

export default useClientPositions
