/** @format */

import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"

import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import React from "react"
import Typography from "@mui/material/Typography"

const NotificationContent = props => {
	const { content, title, subtitle, icon, image="/apple-touch-icon.png", actions, avatarProps, ...rest } = props

	return (
		<ListItem
			secondaryAction={
				Array.isArray(actions) ? (
					<Box className="flex flex-row">
						{actions.map(({ icon, ...other }) => (
							<IconButton {...other}>{icon}</IconButton>
						))}
					</Box>
				) : undefined
			}
			{...rest}
		>
			<ListItemButton>
				{(!!image || !!icon) && (
					<ListItemAvatar>
						{image && <Avatar alt={`${title}`} src={`${image}`} {...avatarProps} />}
						{!image && <Avatar {...avatarProps}>{icon}</Avatar>}
					</ListItemAvatar>
				)}
				<ListItemText
					primary={
						<Box className="flex flex-col">
							{!!title && <Typography variant="subtitle1">{title}</Typography>}
							{!!subtitle && <Typography variant="subtitle2">{subtitle}</Typography>}
						</Box>
					}
					secondary={content}
				/>
			</ListItemButton>
		</ListItem>
	)
}

export default React.memo(NotificationContent)
