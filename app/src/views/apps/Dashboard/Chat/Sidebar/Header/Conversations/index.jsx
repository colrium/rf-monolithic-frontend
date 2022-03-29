/** @format */

import * as React from "react"
import { useTheme } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Avatar from "@mui/material/Avatar"
import Paper from "@mui/material/Paper"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
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
	const { SocketIO, Api: ApiService } = useNetworkServices()

	return (
		<Box {...rest} className={`w-full flex flex-row items-center ${className ? className : ""}`}>
			<Box className="mr-2">
				<IconButton size="small">
					{auth.user?.avatar ? (
						<Avatar
							alt={auth.user?.first_name}
							className={`text-sm`}
							src={ApiService.getAttachmentFileUrl(auth.user?.avatar)}
							sx={{
								width: 32,
								height: 32,
								backgroundColor: theme.palette.action.hover,
								color: theme.palette.text.primary,
							}}
						/>
					) : (
						<Avatar
							className={`text-sm`}
							sx={{
								color: theme => theme.palette.text.primary,
								backgroundColor: theme => theme.palette.action.hover,
								width: 32,
								height: 32,
							}}
						>
							{auth.user?.first_name?.charAt(0)?.toUpperCase()}
						</Avatar>
					)}
				</IconButton>
			</Box>

			<Box className="flex flex-row items-center flex-1 mx-2">
				<Typography variant="body1"> Conversations </Typography>
			</Box>
			<Box className="flex flex-row items-center">
				<IconButton
					sx={{ color: "inherit" }}
					className={`text-sm`}
					onClick={() => navigate(`${"/messaging/contacts".toUriWithDashboardPrefix()}`)}
					title="New Chat"
					aria-label="New Chat"
				>
					<ChatBubbleOutlineIcon fontSize="inherit" />
				</IconButton>
			</Box>
		</Box>
	)
}

export default ConversationsHeader
