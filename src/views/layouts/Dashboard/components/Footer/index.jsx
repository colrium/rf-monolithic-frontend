/** @format */

// Externals
import React, { useCallback, useRef, useEffect } from "react"
import { useGeolocation } from "react-use"
import { app } from "assets/jss/app-theme"
import { intercom } from "config"
import { Typography, Divider } from "@mui/material"
import AccessibleIcon from "@mui/icons-material/Accessible"
import { useClientPositions, useDidMount, useDidUpdate } from "hooks"
import { useNotificationsQueue, useCacheBuster } from "contexts"
import LightBox from "components/LightBox"
import Intercom from "react-intercom"

const Footer = props => {
	const { className, showIntercom } = props
	const clientPositions = useClientPositions()
	const cacheBuster = useCacheBuster()
	useEffect(() => {
		if (!cacheBuster.loading && !cacheBuster.isLatestVersion) {
			if (window.confirm("A new version of this page is available. A page reload is required to continue to the latest version.")) {
				cacheBuster.emptyCacheStorage()
				window.location.reload()
			}
		}
	}, [cacheBuster.loading])

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

export default Footer
