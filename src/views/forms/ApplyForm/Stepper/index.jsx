/** @format */

import React, { useEffect, useCallback } from "react"
import Grid from "@mui/material/Grid"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import DesktopStepper from "./Desktop"
import MobileStepper from "./Mobile"

const Stepper = (props) => {
	const theme = useTheme()
	const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"))
	return (
		<Grid container spacing={2}>
			<Grid xs={12}>
				{isLargeScreen ? <DesktopStepper {...props} /> : <MobileStepper {...props} />}
			</Grid>
		</Grid>
	)
}


export default React.memo(Stepper)
