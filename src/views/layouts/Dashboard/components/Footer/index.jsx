// Externals
import React, { useCallback, useRef } from "react"
import { useGeolocation } from "react-use"
import { app } from "assets/jss/app-theme"
import { intercom } from "config"
import { Typography, Divider } from "@mui/material"
import { useClientPositions, useDidMount } from "hooks"
import LightBox from "components/LightBox"
import Intercom from "react-intercom"

const Footer = props => {
	const { className, showIntercom } = props
	const clientPositions = useClientPositions()

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
