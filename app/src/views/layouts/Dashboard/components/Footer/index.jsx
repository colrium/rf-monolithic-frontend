// Externals
import React, { useCallback, useRef } from "react"
import { useGeolocation } from "react-use"
import { app } from "assets/jss/app-theme"
import { intercom } from "config"
import { Typography, Divider } from "@mui/material"
import { useClientPositions } from "hooks"
import Intercom from "react-intercom"

const Footer = props => {
	const { className, showIntercom } = props
	const [clientPositions] = useClientPositions()

	return (
		<footer
			className={`p-4 mt-20 w-full absolute bottom-0 text-xs flex flex-col justify-end items-end pr-32 ${className ? className : ""}`}
		>
			<Divider />
			<Typography className={`mt-2 mb-1 text-xs`} variant="body-2">
				&copy; {app.name}. {new Date().format("Y")}
			</Typography>
			<Typography variant="body-2" className={`text-xs`}>
				{app.description}
			</Typography>
			{showIntercom && <Intercom appID={intercom.app.id} {...intercom.app.user} />}
		</footer>
	)
}

Footer.defaultProps = {
	showIntercom: true,
}

export default Footer;
