/** @format */

import * as React from "react"
import { styled, useTheme } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import CssBaseline from "@mui/material/CssBaseline"
import MuiAppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"
import Contacts from "../Contacts"
import Conversations from "../Conversations"

const drawerWidth = 320

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	padding: theme.spacing(0, 1),
	backgroundColor: theme.palette.action.disabledBackground,
	color: theme.palette.text.secondary,
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: "flex-start",
}))

const ChatDrawer = props => {
	const { onClose, sx, onItemClick, onItemContextMenu, contentType, headerLeft, headerRight, title, ...rest } = props
	const theme = useTheme()
	const open = useMediaQuery("(min-width:600px)")

	return (
		<Drawer
			sx={{
				flexShrink: 0,
				"& .MuiDrawer-paper": {
					width: open ? drawerWidth : 0,
				},
				height: theme => `calc(100vh - ${theme.spacing(25)})`,
				maxHeight: theme => `calc(100vh - ${theme.spacing(25)})`,
				...sx,
			}}
			classes={{
				paper: "flex flex-col relative box-border border-0 overflow-hidden",
			}}
			className="h-full overflow-hidden"
			variant="persistent"
			variant="temporary"
			variant="permanent"
			anchor="left"
			open={open}
			{...rest}
		>
			<Box className="w-full flex-1 relative flex flex-col">
				<DrawerHeader>
					{!!headerLeft && (
						<Box component="div" className="flex flex-row items-center justify-start">
							{headerLeft}
						</Box>
					)}

					{!!title && (
						<Typography variant="body1" className="flex-1">
							{title}
						</Typography>
					)}

					{!!headerRight && (
						<Box component="div" className="flex flex-row items-center justify-end">
							{headerRight}
						</Box>
					)}
				</DrawerHeader>
				<Box
					sx={{
						backgroundColor: theme.palette.background.default,
						// height: theme => `calc(100vh - ${theme.spacing(16)})`,
						// maxHeight: theme => `calc(100vh - ${theme.spacing(16)})`,
					}}
					className="w-full flex-1"
				>
					{contentType === "new-chat" && <Contacts onClick={onItemClick} onContextMenu={onItemContextMenu} />}
					{contentType === "conversations" && (
						<Conversations onConversationClick={onItemClick} onConversationContextMenu={onItemContextMenu} />
					)}
				</Box>
			</Box>
		</Drawer>
	)
}

export default ChatDrawer
