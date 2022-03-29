/** @format */

import * as React from "react"
import { useTheme } from "@mui/material/styles"
import Box from "@mui/material/Box"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useNetworkServices } from "contexts"

const ConversationsHeader = props => {
	const { className, ...rest } = props
	const theme = useTheme()
	const navigate = useNavigate()
	const auth = useSelector(state => state.auth)

	return (
		<Box {...rest} className={`w-full flex flex-row items-center ${className ? className : ""}`}>
			<Box className="mr-2">
				<IconButton
					sx={{ color: "inherit", fontSize: theme.spacing(2) }}
					onClick={() => navigate(`${"/messaging/conversations".toUriWithDashboardPrefix()}`)}
					title="Back to conversations"
					aria-label="Back to conversations"
				>
					<ArrowBackIcon fontSize="inherit" />
				</IconButton>
			</Box>

			<Box className="flex flex-row items-center flex-1 mx-2">
				<Typography variant="body1"> New Chat </Typography>
			</Box>
			<Box className="flex flex-row items-center"></Box>
		</Box>
	)
}

export default ConversationsHeader
