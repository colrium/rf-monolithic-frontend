// Externals
import React, { useCallback, useRef } from "react"
import { useGeolocation } from "react-use"
import { app } from "assets/jss/app-theme"
import { intercom } from "config"
import { Typography, Divider } from "@mui/material"
import AccessibleIcon from "@mui/icons-material/Accessible"
import { useClientPositions, useDidMount, useDidUpdate } from "hooks"
import { useNotificationsQueue } from "contexts"
import LightBox from "components/LightBox"
import Intercom from "react-intercom"

const Footer = props => {
	const { className, showIntercom } = props
	const clientPositions = useClientPositions()
	/* const { queueNotification } = useNotificationsQueue()
	useDidMount(() => {
		queueNotification([
			{
				title: "Title 1",
				severity: "info",
				content:
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
			},
			{
				title: "Title 2",
				priority: 1,
				severity: "error",
				content:
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
			},
			{
				title: "Title 3",
				severity: "success",
				content:
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
			},
		])
	}) */

	return (
		<footer className={``}>
			{/* <Divider />
			<Typography className={`mt-2 mb-1 text-xs`} variant="body-2">
				&copy; {app.name}. {new Date().format("Y")}
			</Typography>
			<Typography variant="body-2" className={`text-xs`}>
				{app.description}
			</Typography> */}
			<LightBox />
			{showIntercom && <Intercom appID={intercom.app.id} {...intercom.app.user} />}
		</footer>
	)
}

Footer.defaultProps = {
	showIntercom: false,
}

export default Footer;
