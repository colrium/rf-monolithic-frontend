/** @format */

import * as React from "react"
import { useTheme } from "@mui/material/styles"
import { Outlet } from "react-router-dom"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import Header from "./Header"

const Sidebar = props => {
	const { sx, className, ...rest } = props
	const theme = useTheme()
	return (
		<Paper
			sx={{
				flexShrink: 0,
				width: theme.appDrawer?.width || 320,
				backgroundColor: theme.palette.background.default,
				...sx,
			}}
			className={`h-full flex flex-col box-border border-0 ${
				theme.direction === "ltr" ? "rounded-tr-none rounded-br-none" : "rounded-tl-none rounded-bl-none"
			} ${className ? className : ""}`}
			{...rest}
		>
			<Header />
			<Box className={`flex-1 relative overflow-hidden`}>
				<Outlet />
			</Box>
		</Paper>
	)
}

export default Sidebar
