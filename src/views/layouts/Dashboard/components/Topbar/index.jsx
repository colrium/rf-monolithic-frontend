/** @format */

import { AppBar, Badge, Box, IconButton, Popover, Snackbar, Toolbar } from "@mui/material";
import CloseSideBarIcon from '@mui/icons-material/MenuOpen';
import OpenSideBarIcon from "@mui/icons-material/Menu";
import classNames from "classnames";
import SnackbarContent from "components/Snackbar/SnackbarContent";
import Typography from "components/Typography";
import { notifications as notificationsDefination } from "definations";
import Icon from '@mdi/react'
import { mdiBellOutline } from '@mdi/js';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import compose from "recompose/compose";
import { withTheme } from '@mui/styles';
import Avatar from "components/Avatar";
import ApiService from "services/Api";
import { PersonOutlined as UserIcon } from "@mui/icons-material";
import MessagingIcon from "./MessagingIcon"
import { logout, setCurrentUser } from "state/actions";
import { ServiceDataHelper } from "utils/Helpers"
import { width as drawerWidth } from "config/ui/drawer"
// Custom components
import { NotificationList } from "./components"
import { app } from "assets/jss/app-theme"

import { withNetworkServices } from "contexts/NetworkServices"
// Component styles

class Topbar extends Component {
	signal = true
	ignoreConnectionState = false
	searchRef = React.createRef()
	state = {
		drawerWidth: drawerWidth,
		prominent: true,
		notifications: [],
		notificationsLimit: 5,
		notificationsCount: 0,
		notificationsEl: null,
		load_error: false,
		loading: false,
		connectionSnackBarIgnore: false,
		connectionSnackBarOpened: false,
		serverConnected: false,
		connectionSnackBarOpen: false,
		connectionSnackBarColor: "success",
		connectionSnackBarMessage: "Connection Restored",
		notificationSnackBarOpen: false,
		notificationSnackBarMessage: "New notification",
		userPresenceMenuOpen: false,
		userPresenceMenuAnchorEl: null,
	}

	constructor(props) {
		super(props)
		this.mounted = false
		const { auth, setCurrentUser } = this.props
		this.onCloseConnectionSnackbar = this.onCloseConnectionSnackbar.bind(this)
		this.onCloseNotificationSnackbar = this.onCloseNotificationSnackbar.bind(this)
		this.handleCloseNotifications = this.handleCloseNotifications.bind(this)
		this.handleSignOut = this.handleSignOut.bind(this)
		this.onOpenUserPresenceMenu = this.onOpenUserPresenceMenu.bind(this)
		this.onCloseUserPresenceMenu = this.onCloseUserPresenceMenu.bind(this)
		this.onChangeUserPresenceMenu = this.onChangeUserPresenceMenu.bind(this)


	}

	componentDidMount() {
		let { dashboard } = this.props
		this.signal = true
		this.mounted = true
		this.initSocketActionsListener()
		//
	}

	componentWillUnmount() {
		this.signal = false
		this.mounted = false
		this.ignoreConnectionState = true
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {
		this.mounted = false
		return null
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.mounted = true
	}

	onOpenUserPresenceMenu = event => {
		const userPresenceMenuAnchorEl = event.currentTarget
		this.setState({
			userPresenceMenuAnchorEl: userPresenceMenuAnchorEl,
			userPresenceMenuOpen: true,
		})
	}

	onCloseUserPresenceMenu = () => {
		this.setState({
			userPresenceMenuAnchorEl: null,
			userPresenceMenuOpen: false,
		})
	}

	onChangeUserPresenceMenu = presence => event => {
		const {
			auth,
			networkServices: { SocketIO },
			setCurrentUser,
		} = this.props
		if (auth.isAuthenticated) {
			setCurrentUser({ ...auth.user, presence: presence })
			SocketIO.emit("change-user-presence", {
				id: auth.user?._id,
				presence: presence,
			})
		}
		this.setState({
			userPresenceMenuAnchorEl: null,
			userPresenceMenuOpen: false,
		})
	}

	initSocketActionsListener() {
		const {
			networkServices: { SocketIO },
			auth,
			setCurrentUser,
		} = this.props
		this.setState({
			serverConnected: SocketIO.connected,
		})
		SocketIO.on("connect", () => {
			this.setState({
				connectionSnackBarOpen: false,
				serverConnected: true,
				connectionSnackBarColor: "success",
				connectionSnackBarMessage: "Connection Restored",
			})
		})
		SocketIO.on("disconnect", () => {
			if (!this.ignoreConnectionState) {
				this.setState({
					connectionSnackBarOpened: false,
					serverConnected: false,
					connectionSnackBarOpen: false,
					connectionSnackBarColor: "error",
					connectionSnackBarMessage: "Connection Lost",
				})
			}
		})

		SocketIO.on("reconnect_failed", attemptNumber => {
			////
			if (attemptNumber >= 10 && !this.ignoreConnectionState) {
				this.setState({
					connectionSnackBarOpened: false,
					connectionSnackBarOpen: false,
					serverConnected: false,
					connectionSnackBarColor: "error",
					connectionSnackBarMessage: "Connection Lost",
				})
			}
		})

		SocketIO.on("new_notification", notification => {
			if (auth.isAuthenticated && "_id" in auth.user) {
				if (notification.notify === auth.user?._id && !notification.read) {
					this.setState(prevState => ({
						notifications: Array.isArray(prevState.notifications)
							? prevState.notifications.unshift(notification)
							: [notification],
						notificationSnackBarOpen: true,
						notificationSnackBarMessage: notification.body,
					}))
					//this.getNotifications();
				}
			}
		})

		SocketIO.on("update", ({ context, action }) => {
			if (context.toLowerCase() === "notification") {
				if (action.effects.notify === auth.user?._id) {
					this.setState(prevState => ({
						notifications: Array.isArray(prevState.notifications)
							? prevState.notifications.unshift(action.effects)
							: [action.effects],
						notificationSnackBarOpen: true,
						notificationSnackBarMessage: action.effects.body,
					}))
					//this.getNotifications();
				}
			} /*else if (
					context.toLowerCase() === "user" &&
					auth.isAuthenticated &&
					"_id" in auth.user
				) {
					if (
						action.record === auth.user?._id &&
						action.catalyst !== auth.user?._id
					) {
						let updated_user = { ...auth.user, ...action.effects };
						setCurrentUser(updated_user);
					}
				}*/
		})
	}

	parseData(entry) {
		const { auth } = this.props
		let parsed_data = entry
		let columns = notificationsDefination.scope.columns
		parsed_data["data_actions"] = entry._id
		for (let [field_name, field] of Object.entries(columns)) {
			if (field.possibilities) {
				if (typeof field.possibilities === "object") {
					if (entry[field_name] in field.possibilities) {
						parsed_data[field_name] = field.possibilities[entry[field_name]]
					}
				} else if (typeof field.possibilities === "function") {
					if (entry[field_name] in field.possibilities(entry, auth.user)) {
						parsed_data[field_name] = field.possibilities(entry, auth.user)[entry[field_name]]
					}
				}
			}
		}
		return parsed_data
	}

	getNotifications() {
		const { auth } = this.props

		const { notificationsLimit } = this.state

		ApiService.getContextRequests("/notifications")
			.getRecordsCount({ read: "0" })
			.then(res => {
				if (this.mounted) {
					this.setState(state => ({
						notificationsCount: res.body.data.count,
						load_error: false,
						loading: false,
					}))
				} else {
					this.state.notificationsCount = res.body.data.count
					this.state.load_error = false
					this.state.loading = false
				}
			})
			.catch(err => {
				if (this.mounted) {
					this.setState(state => ({
						load_error: err,
						loading: false,
					}))
				} else {
					this.state.load_error = err
					this.state.loading = false
				}
			})

		ApiService.getContextRequests("/notifications")
			.getRecords({
				p: 1,
				pagination: notificationsLimit,
				desc: "date_created",
			})
			.then(response => {
				let raw_data = response.body.data
				let resolved_data = ServiceDataHelper.resolveReferenceColumnsDisplays(raw_data, notificationsDefination.columns, auth.user)
				let that = this
				let all_records = resolved_data.map(entry => {
					return that.parseData(entry)
				})
				if (this.mounted) {
					this.setState(state => ({
						notifications: all_records,
						load_error: false,
						loading: false,
					}))
				} else {
					this.state.notifications = all_records
					this.state.load_error = false
					this.state.loading = false
				}
			})
			.catch(err => {
				if (this.mounted) {
					this.setState(state => ({
						load_error: err,
						loading: false,
					}))
				} else {
					this.state.load_error = err
					this.state.loading = false
				}
			})
	}

	handleSignOut() {
		ApiService.logout()
	}

	handleShowNotifications = event => {
		const { auth } = this.props
		this.setState({ notificationsEl: event.currentTarget }, () => {
			if (this.state.notificationsCount > 0) {
				ApiService.get("/notifications/mark/all/read")
					.then(res => {
						this.setState({ notificationsCount: 0 })
					})
					.catch(e => {
						this.setState({ notificationsCount: 0 })
					})
			}
		})
	}

	handleCloseNotifications() {
		this.setState({
			notificationsEl: null,
		})
	}

	onCloseConnectionSnackbar() {
		this.setState({
			connectionSnackBarOpen: false,
		})
	}

	onCloseNotificationSnackbar() {
		this.setState({
			notificationSnackBarOpen: false,
		})
	}



	render() {
		const {
			theme,
			className,
			title,
			isSidebarOpen,
			onToggleSidebar,
			dashboard,
			nav,
			communication: { messaging },
			auth,
			sx,
			...rest
		} = this.props
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

				{/* <Snackbar
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
				</Snackbar> */}
			</Box>
		)
	}
}

Topbar.propTypes = {
	className: PropTypes.string,

	isSidebarOpen: PropTypes.bool,
	onToggleSidebar: PropTypes.func,
	title: PropTypes.string,
}

Topbar.defaultProps = {
	onToggleSidebar: () => {},
}

const mapStateToProps = state => ({
	auth: state.auth,
	nav: state.nav,
	dashboard: state.dashboard,
	cache: state.cache,
	communication: state.communication,
})

export default compose(withTheme, withNetworkServices, connect(mapStateToProps, { logout, setCurrentUser }))(Topbar)
