/** @format */
import React from "react"
import Grid from "@mui/material/Grid"
import { Outlet } from "react-router-dom"

function Widget(props) {
	const { context } = props
	return (
		<Grid container>
			<Outlet />
		</Grid>
	)
}

export default React.memo(Widget)
