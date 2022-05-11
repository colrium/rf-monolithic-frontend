/** @format */
import { Grid, Box, Typography } from "@mui/material"

import React from "react"

const NotificationContent = props => {
	const { content, title, subtitle, icon, image, actions, ...rest } = props
	return (
		<Grid container {...rest}>
			<Grid item xs={12} className="flex flex-row">
				<Box className=""></Box>
				<Box className="flex-1 flex flex-col">
					{title && (
						<Typography variant="body1" className="truncate">
							{title}
						</Typography>
					)}
					{subtitle && (
						<Typography variant="caption" className="truncate">
							{title}
						</Typography>
					)}
					{content && (
						<Typography variant="body2" className="flex-1">
							{content}
						</Typography>
					)}
					{Array.isArray(actions) && <Box className="flex flex-row justify-end">

					</Box>}
				</Box>
			</Grid>
		</Grid>
	)
}

export default React.memo(NotificationContent)
