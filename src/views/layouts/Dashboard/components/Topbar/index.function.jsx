/** @format */

import { AppBar, Badge, Box, IconButton, Popover, Snackbar, Toolbar } from "@mui/material"
import CloseSideBarIcon from "@mui/icons-material/MenuOpen"
import OpenSideBarIcon from "@mui/icons-material/Menu"
import classNames from "classnames"
import SnackbarContent from "components/Snackbar/SnackbarContent"
import Typography from '@mui/material/Typography'
import { notifications as notificationsDefination } from "definations"
import Icon from "@mdi/react"
import { mdiBellOutline } from "@mdi/js"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Fade from "@mui/material/Fade"
import PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import compose from "recompose/compose"
import { withTheme } from "@mui/styles"
import Avatar from "components/Avatar"
import ApiService from "services/Api"
import { PersonOutlined as UserIcon } from "@mui/icons-material"
import NotificationsPopup from "./NotificationsPopup"
import MessagingIcon from "./MessagingIcon"
import { logout, setCurrentUser } from "state/actions"
import { ServiceDataHelper } from "utils/Helpers"
import { width as drawerWidth } from "config/ui/drawer"
// Custom components
import { NotificationList } from "./components"
import { app } from "assets/jss/app-theme"

import { useNetworkServices } from "contexts/NetworkServices"
// Component styles

const Topbar = React.forwardRef((props, ref) => {
	const { theme, className, title, isSidebarOpen, onToggleSidebar, ...rest } = props
	const { notifications, notificationsCount, notificationsEl } = this.state
	const showNotifications = Boolean(notificationsEl)

	const breadcrumbs = nav.entries

	return (
		<Box className={className} sx={sx}>
			<AppBar
				sx={{
					borderBottom: theme => `1px solid ${theme.palette.divider}`,
					backgroundColor: theme => theme.palette.background.paper,
					zIndex: theme => theme.zIndex.appBar,

					flexGrow: 1,
				}}
			>
				<Toolbar
					className={classNames({
						flex: true,
						relative: true,
						"px-2": true,
					})}
					sx={{
						height: theme => theme.spacing(8),
						transition: "height 100ms",
						width: "100%",
						transitionTimingFunction: "cubic-bezier(0.1, 0.7, 1.0, 0.1)",
						zIndex: 1300,
						color: theme => theme.palette.text.primary,
					}}
				>
					<IconButton
						onClick={onToggleSidebar}
						variant="text"
						sx={{
							alignSelf: "center",
							marginLeft: "4px",
							marginRight: theme => theme.spacing(),
							color: theme => theme.palette.text.primary,
							"&:hover": {
								color: theme => theme.palette.primary.main + " !important",
							},
						}}
					>
						{isSidebarOpen ? <CloseSideBarIcon /> : <OpenSideBarIcon />}
					</IconButton>

					<Link className={"inline-block text-left w-auto cursor-pointer"} to={"/home".toUriWithDashboardPrefix()}>
						<img alt={app.name + " logo cursor-pointer"} className={"cursor-pointer h-6"} src={app.logo} />
					</Link>

					<div className={"flex flex-grow justify-start flex-row-reverse items-center px-4"}>
						{auth.isAuthenticated && (
							<Badge
								variant="dot"
								badgeContent=" "
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "right",
								}}
								classes={{
									dot: this.state.serverConnected
										? auth.user?.presence === "online"
											? "bg-green-700"
											: auth.user?.presence === "away"
											? "bg-yellow-700"
											: "bg-gray-700"
										: "bg-red-700",
								}}
							>
								<IconButton
									onClick={this.onOpenUserPresenceMenu}
									size="small"
									sx={{ ml: 2 }}
									title={this.state.serverConnected ? auth.user.presence.humanize() : "No Connection"}
								>
									{auth.user?.avatar ? (
										<Avatar
											alt={auth.user?.first_name}
											className={`text-sm ${
												this.state.serverConnected
													? auth.user?.presence === "online"
														? "bg-green-700"
														: auth.user.presence == "away"
														? "bg-yellow-700"
														: "bg-gray-700"
													: "bg-red-700"
											}`}
											src={ApiService.getAttachmentFileUrl(auth.user?.avatar)}
											sx={{ width: 32, height: 32 }}
										/>
									) : (
										<Avatar
											sx={{
												color: theme.palette.text.primary,
												background: theme.palette.action.selected,
												width: 32,
												height: 32,
											}}
										>
											<UserIcon />
										</Avatar>
									)}
								</IconButton>
							</Badge>
						)}

						{/*auth.isAuthenticated && (
								<Status
											color={
												auth.user?.presence === "online"
													? "#00796b"
													: auth.user?.presence === "away"
													? "#b88d00"
													: "#5C5C5C"
											}
											text={
												auth.user?.first_name +
												" " +
												auth.user?.last_name
											}
								/>

							)*/}
						<MessagingIcon />
						<NotificationsPopup />

						<Menu
							id="user-presence-menu"
							anchorEl={this.state.userPresenceMenuAnchorEl}
							open={this.state.userPresenceMenuOpen}
							onClose={this.onCloseUserPresenceMenu}
							TransitionComponent={Fade}
							classes={{
								list: "pt-0",
							}}
						>
							<MenuItem
								classes={{
									root:
										"opacity-100 inverse-text " +
										(this.state.serverConnected
											? auth.user?.presence === "online"
												? "bg-green-700"
												: auth.user?.presence == "away"
												? "bg-yellow-700"
												: "bg-gray-700"
											: "bg-red-700"),
								}}
								disabled
							>
								<Typography color="inherit" variant="subtitle1">
									{auth.user?.first_name + " " + auth.user?.last_name}
								</Typography>
							</MenuItem>
							<MenuItem
								onClick={this.onChangeUserPresenceMenu(
									auth.user ? (auth.user?.presence === "online" ? "away" : "online") : "online"
								)}
								disabled={!this.state.serverConnected}
							>
								{auth.user ? (auth.user?.presence === "online" ? "Set to away" : "Set to online") : "Set to online"}
							</MenuItem>
							{["online", "away"].includes(auth.user?.presence) && (
								<MenuItem onClick={this.onChangeUserPresenceMenu("offline")} disabled={!this.state.serverConnected}>
									Set to offline
								</MenuItem>
							)}
							<MenuItem>
								<Link to={"/account".toUriWithDashboardPrefix()}>My account</Link>{" "}
							</MenuItem>
							<MenuItem onClick={this.handleSignOut}>Logout</MenuItem>
						</Menu>

						<IconButton className={"md:mx-2"} onClick={this.handleShowNotifications}>
							<Badge badgeContent={notificationsCount} color="secondary" variant="dot">
								<Icon path={mdiBellOutline} title="Notification Icon" size={1} color={theme.palette.text.primary} />
							</Badge>
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
			<Popover
				anchorEl={notificationsEl}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				onClose={this.handleCloseNotifications}
				open={showNotifications}
				transformOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
			>
				<NotificationList notifications={notifications} onSelect={this.handleCloseNotifications} />
			</Popover>

			{/* <Notification title="test notification"/> */}

			<Snackbar
				anchorOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
				open={this.state.connectionSnackBarOpen}
				autoHideDuration={this.state.connectionSnackBarColor === "error" ? null : 2000}
				onClose={this.onCloseConnectionSnackbar}
			>
				<SnackbarContent
					onClose={this.onCloseConnectionSnackbar}
					color={this.state.connectionSnackBarColor}
					message={this.state.connectionSnackBarMessage}
				/>
			</Snackbar>

			<Snackbar
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				open={this.state.notificationSnackBarOpen}
				autoHideDuration={7000}
				onClose={this.onCloseNotificationSnackbar}
			>
				<SnackbarContent
					onClose={this.onCloseNotificationSnackbar}
					color="inverse"
					message={this.state.notificationSnackBarMessage}
				/>
			</Snackbar>
		</Box>
	)
})
