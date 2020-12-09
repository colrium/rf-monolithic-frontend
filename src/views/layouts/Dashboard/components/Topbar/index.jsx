/** @format */

import { AppBar, Badge, Box, Breadcrumbs, IconButton, Popover, Snackbar, Toolbar, withStyles } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import { NotificationsOutlined as NotificationsIcon, PowerSettingsNew as LogoutIcon } from "@material-ui/icons";
import CloseSideBarIcon from "@material-ui/icons/ChevronLeft";
import OpenSideBarIcon from "@material-ui/icons/Menu";
import classNames from "classnames";
import SnackbarContent from "components/Snackbar/SnackbarContent";
import Typography from "components/Typography";
import { notifications as notificationsDefination } from "definations";
import Icon from '@mdi/react'
import { mdiBellOutline, mdiLogoutVariant } from '@mdi/js';
import Button from "components/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Status from "components/Status";
import Fade from "@material-ui/core/Fade";
import PropTypes from "prop-types";
import React, { Component } from "react";
import Chip from '@material-ui/core/Chip';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import compose from "recompose/compose";
import { withTheme } from '@material-ui/core/styles';
import Avatar from "components/Avatar";
import LazyImage from "components/LazyImage";
import { attachments as AttachmentsService } from "services";
import { PersonOutlined as UserIcon } from "@material-ui/icons";
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';
import AuthService from "services/auth";
import { logout, setCurrentUser } from "state/actions";
import { ServiceDataHelper } from "hoc/Helpers";
import {withGlobals} from "contexts/Globals";
import {withErrorHandler} from "hoc/ErrorHandler";
import SearchBar from "components/SearchBar";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
// Custom components
import { NotificationList } from "./components";
import { app } from "assets/jss/app-theme";
// Component styles
import styles from "./styles";



class Topbar extends Component {
	signal = true;
	ignoreConnectionState = false;
	searchRef = React.createRef();
	state = {
		prominent: true,
		notifications: [],
		notificationsLimit: 5,
		notificationsCount: 0,
		notificationsEl: null,
		load_error: false,
		loading: false,
		connectionSnackBarIgnore: false,
		connectionSnackBarOpened: false,
		connectionSnackBarOpen: false,
		connectionSnackBarColor: "success",
		connectionSnackBarMessage: "Connection Restored",
		notificationSnackBarOpen: false,
		notificationSnackBarMessage: "New notification",
		userPresenceMenuOpen: false,
		userPresenceMenuAnchorEl: null,
	};

	constructor(props) {
		super(props);
		this.mounted = false;
		this.onCloseConnectionSnackbar = this.onCloseConnectionSnackbar.bind(
			this
		);
		this.onCloseNotificationSnackbar = this.onCloseNotificationSnackbar.bind(
			this
		);
		this.handleCloseNotifications = this.handleCloseNotifications.bind(
			this
		);
		this.handleSignOut = this.handleSignOut.bind(this);
		this.onOpenUserPresenceMenu = this.onOpenUserPresenceMenu.bind(this);
		this.onCloseUserPresenceMenu = this.onCloseUserPresenceMenu.bind(this);
		this.onChangeUserPresenceMenu = this.onChangeUserPresenceMenu.bind(
			this
		);
		this.initSocketActionsListener();
	}

	componentDidMount() {
		let {dashboard} = this.props;
		this.signal = true;
		this.mounted = true;
		this.setState({ prominent: true });
		//console.log("dashboard", dashboard);
		
	}

	componentWillUnmount() {
		this.signal = false;
		this.mounted = false;
		this.ignoreConnectionState = true;
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {
		this.mounted = false;
		return null;
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.mounted = true;
	}

	onOpenUserPresenceMenu = event => {
		const userPresenceMenuAnchorEl = event.currentTarget;
		this.setState({
			userPresenceMenuAnchorEl: userPresenceMenuAnchorEl,
			userPresenceMenuOpen: true,
		});
	};

	onCloseUserPresenceMenu = () => {
		this.setState({
			userPresenceMenuAnchorEl: null,
			userPresenceMenuOpen: false,
		});
	};

	onChangeUserPresenceMenu = presence => event => {
		const { auth, sockets } = this.props;
		if (sockets.default && auth.isAuthenticated) {
			sockets.default.emit("change-user-presence", {
				id: auth.user._id,
				presence: presence,
			});
		}
		this.setState({
			userPresenceMenuAnchorEl: null,
			userPresenceMenuOpen: false,
		});
	};

	initSocketActionsListener() {
		const { sockets, auth, setCurrentUser } = this.props;
		if (sockets.default) {
			sockets.default.on("connect", () => {
				if ( this.state.connectionSnackBarOpened && !this.ignoreConnectionState) {
					this.setState({
						connectionSnackBarOpen: true,
						connectionSnackBarColor: "success",
						connectionSnackBarMessage: "Connection Restored",
					});
				}
			});
			sockets.default.on("disconnect", () => {
				if (!this.ignoreConnectionState) {
					this.setState({
						connectionSnackBarOpened: true,
						connectionSnackBarOpen: true,
						connectionSnackBarColor: "error",
						connectionSnackBarMessage: "Connection Lost",
					});
				}
			});

			sockets.default.on("new_notification", notification => {
				if (auth.isAuthenticated && "_id" in auth.user) {
					if (
						notification.notify === auth.user._id &&
						!notification.read
					) {
						this.setState(prevState => ({
							notifications: Array.isArray(
								prevState.notifications
							)
								? prevState.notifications.unshift(notification)
								: [notification],
							notificationSnackBarOpen: true,
							notificationSnackBarMessage: notification.body,
						}));
						//this.getNotifications();
					}
				}
			});

			sockets.default.on("update", ({ context, action }) => {
				if (context.toLowerCase() === "notification") {
					if (action.effects.notify === auth.user._id) {
						this.setState(prevState => ({
							notifications: Array.isArray(
								prevState.notifications
							)
								? prevState.notifications.unshift(
										action.effects
								  )
								: [action.effects],
							notificationSnackBarOpen: true,
							notificationSnackBarMessage: action.effects.body,
						}));
						//this.getNotifications();
					}
				} else if (
					context.toLowerCase() === "user" &&
					auth.isAuthenticated &&
					"_id" in auth.user
				) {
					if (
						action.record === auth.user._id &&
						action.catalyst !== auth.user._id
					) {
						let updated_user = { ...auth.user, ...action.effects };
						setCurrentUser(updated_user);
					}
				}
			});

			

			
		}
	}

	parseData(entry) {
		const { auth } = this.props;
		let parsed_data = entry;
		let columns = notificationsDefination.scope.columns;
		parsed_data["data_actions"] = entry._id;
		for (let [field_name, field] of Object.entries(columns)) {
			if (field.possibilities) {
				if (typeof field.possibilities === "object") {
					if (entry[field_name] in field.possibilities) {
						parsed_data[field_name] =
							field.possibilities[entry[field_name]];
					}
				} else if (typeof field.possibilities === "function") {
					if (
						entry[field_name] in
						field.possibilities(entry, auth.user)
					) {
						parsed_data[field_name] = field.possibilities(
							entry,
							auth.user
						)[entry[field_name]];
					}
				}
			}
		}
		return parsed_data;
	}

	getNotifications() {
		const { auth, definations, services } = this.props;

		const { notificationsLimit } = this.state;

		services.notifications.getRecordsCount({ read: "0" }).then(res => {
				if (this.mounted) {
					this.setState(state => ({
						notificationsCount: res.body.data.count,
						load_error: false,
						loading: false,
					}));
				}
				else{
					this.state.notificationsCount = res.body.data.count;
					this.state.load_error = false;
					this.state.loading = false;
				}	
			})
			.catch(err => {
				if (this.mounted) {
					this.setState(state => ({ load_error: err, loading: false }));
				}
				else {
					this.state.load_error = err;
					this.state.loading = false;
				}
			});
				

		services.notifications
			.getRecords({
				p: 1,
				pagination: notificationsLimit,
				desc: "date_created",
			})
			.then(response => {
				let raw_data = response.body.data;
				let resolved_data = ServiceDataHelper.resolveReferenceColumnsDisplays(
					raw_data,
					notificationsDefination.columns,
					auth.user
				);
				let that = this;
				let all_records = resolved_data.map(entry => {
					return that.parseData(entry);
				});
				if (this.mounted) {
					this.setState(state => ({
						notifications: all_records,
						load_error: false,
						loading: false,
					}));
				}
				else {
					this.state.notifications = all_records;
					this.state.load_error = false;
					this.state.loading = false;
				}	
			})
			.catch(err => {
				if (this.mounted) {
					this.setState(state => ({ load_error: err, loading: false }));
				}
				else{
					this.state.load_error = err;
					this.state.loading = false;
				}
				
			});
				
	}

	handleSignOut() {
		const { logout } = this.props;
		logout();
		AuthService.logout();
	}

	handleShowNotifications = event => {
		const { auth, definations, services } = this.props;
		this.setState({ notificationsEl: event.currentTarget }, () => {
			if (this.state.notificationsCount > 0) {
				services.notifications
					.markAllAsRead()
					.then(res => {
						this.setState({ notificationsCount: 0 });
					})
					.catch(e => {
						this.setState({ notificationsCount: 0 });
					});
			}
		});
	};

	handleCloseNotifications() {
		this.setState({
			notificationsEl: null,
		});
	}

	onCloseConnectionSnackbar() {
		this.setState({
			connectionSnackBarOpen: false,
		});
	}

	onCloseNotificationSnackbar() {
		this.setState({
			notificationSnackBarOpen: false,
		});
	}

	render() {
		const {
			theme,
			classes,
			className,
			title,
			isSidebarOpen,
			onToggleSidebar,
			dashboard,
			nav,
			communication: { messaging },
			auth,
		} = this.props;
		const {
			notifications,
			notificationsCount,
			notificationsEl,
		} = this.state;

		const rootClassName = classNames(classes.root, className);
		const showNotifications = Boolean(notificationsEl);

		const breadcrumbs = nav.entries;

		return (
			<Box>
				<AppBar className={rootClassName}>
					<Toolbar
						className={classNames({
							[classes.toolbar]: true /*, [classes.prominent]: this.state.prominent*/,
							"flex": true,
							"relative": true,
							"px-2": true,
						})}
					>

						{dashboard.drawer_displayed && (
							<IconButton
								className={classes.menuButton}
								onClick={onToggleSidebar}
								variant="text"

							>
								{isSidebarOpen ? (
									<CloseSideBarIcon />
								) : (
									<OpenSideBarIcon />
								)}
							</IconButton>
						)}

						
							<Link className={classes.logoLink+" cursor-pointer"} to={"/home".toUriWithLandingPagePrefix()}>
								<img
									alt={app.name + " logo cursor-pointer"}
									className={classes.logoImage}
									src={app.logo}
								/>
							</Link>
						


						{/*dashboard.searchbar_displayed && <SearchBar
							innerRef={this.searchRef}
							onChange={(value) => console.log('onChange', value)}
							onRequestSearch={() => {
								this.searchRef.current.blur()
								console.log('onRequestSearch')
							}}
							style={{
								margin: '0 auto',
								flex: 1
							}}
						/>*/}

						

						{/*<Hidden mdDown>
							<Breadcrumbs
								maxItems={4}
								aria-label="breadcrumb"
								separator={"/"}
								className={classes.breadcrumbs}
							>
								{breadcrumbs.map(
									(breadcrumb, index) =>
										index < breadcrumbs.length - 1 && (
											<Link
												className={classes.breadcrumb}
												to={breadcrumb.uri}
												key={"breadcrumb-" + index}
											>
												<Typography
													className={classes.title}
													variant="body1"
													color="inverse"
												>
													{" "}
													{breadcrumb.title}
												</Typography>
											</Link>
										)
								)}
								<Typography variant="body1" color="inverse">
									{title}
								</Typography>
							</Breadcrumbs>
						</Hidden>

						<Hidden lgUp>
							<Typography
								className={classes.title}
								variant="body1"
								color="inverse"
							>
								{title}
							</Typography>
						</Hidden>*/}


						<div className={"flex flex-grow justify-center flex-row-reverse items-center  px-4"}>
							{/*auth.isAuthenticated && (
								<Chip
									avatar={auth.user.avatar ? (
										<Avatar alt="Avatar" className={classes.avatar}>
											<LazyImage
												src={AttachmentsService.getAttachmentFileUrl(
													auth.user.avatar
												)}
											/>
										</Avatar>
									) : (
										<Avatar className={classes.iconAvatar}>
											<UserIcon />
										</Avatar>
									)}
									label={<Status
											color={
												auth.user.presence === "online"
													? "#00796b"
													: auth.user.presence === "away"
													? "#b88d00"
													: "#5C5C5C"
											}
											text={
												auth.user.first_name +
												" " +
												auth.user.last_name
											}
									/>}	
									onClick={this.onOpenUserPresenceMenu}
								/>

								
							)*/}

							{auth.isAuthenticated && (
								<Badge 
									variant="dot" 
									badgeContent=" "
									className="mx-4"
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'right',
									}}
									classes={{
										dot: auth.user.presence === "online"? "bg-green-600" : (auth.user.presence == "away"? "bg-orange-500" : "bg-gray-500")
									}}
								>
									{auth.user.avatar ? (
										<Avatar 
											alt="Avatar" 
											className={classes.userAvatar+" cursor-pointer"} 
											src={AttachmentsService.getAttachmentFileUrl(auth.user.avatar)} 
											onClick={this.onOpenUserPresenceMenu} 
										/>
									) : (
										<Avatar className={classes.userAvatar+" cursor-pointer"} style={{color: theme.palette.text.primary, background: theme.palette.action.selected}} onClick={this.onOpenUserPresenceMenu}>
											<UserIcon />
										</Avatar>
									)}

								</Badge>
							)}

							{/*auth.isAuthenticated && (
								<Status
											color={
												auth.user.presence === "online"
													? "#00796b"
													: auth.user.presence === "away"
													? "#b88d00"
													: "#5C5C5C"
											}
											text={
												auth.user.first_name +
												" " +
												auth.user.last_name
											}
								/>
								
							)*/}

							<Link className={"cursor-pointer"} to={"/messages".toUriWithDashboardPrefix()}>
								<IconButton>
								<Badge variant="dot" invisible={Number.parseNumber(messaging.unread_count, 0) === 0} badgeContent={messaging.unread_count} color="primary">
							        <ForumOutlinedIcon />
							    </Badge>
							    </IconButton>
						    </Link>


							<Menu
								id="user-presence-menu"
								anchorEl={this.state.userPresenceMenuAnchorEl}
								open={this.state.userPresenceMenuOpen}
								onClose={this.onCloseUserPresenceMenu}
								TransitionComponent={Fade}
								keepMounted
							>
								<MenuItem
									onClick={this.onChangeUserPresenceMenu(
										auth.user
											? auth.user.presence === "online"
												? "away"
												: "online"
											: "online"
									)}
								>
									{auth.user
										? auth.user.presence === "online"
											? "Set to away"
											: "Set to online"
										: "Set to online"}
								</MenuItem>
								{["online", "away"].includes(
									auth.user.presence
								) && (
									<MenuItem
										onClick={this.onChangeUserPresenceMenu(
											"offline"
										)}
									>
										Set to offline
									</MenuItem>
								)}
								<MenuItem>
									<Link
										to={"/account".toUriWithDashboardPrefix()}
										color="default"
									>
										My account
									</Link>{" "}
								</MenuItem>
								<MenuItem onClick={this.handleSignOut}
								>
								Logout
								</MenuItem>
							</Menu>

							<IconButton
								className={classes.notificationsButton}
								onClick={this.handleShowNotifications}
							>
								<Badge
									badgeContent={notificationsCount}
									color="secondary"
									variant="dot"
								>
									<Icon 
										path={mdiBellOutline}
										title="Notification Icon"    
										size={1}
										color={theme.palette.text.primary}
									/>
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
					<NotificationList
						notifications={notifications}
						onSelect={this.handleCloseNotifications}
					/>
				</Popover>

				{/* <Notification title="test notification"/> */}

				<Snackbar
					anchorOrigin={{
						vertical: "top",
						horizontal: "center",
					}}
					open={this.state.connectionSnackBarOpen}
					autoHideDuration={this.state.connectionSnackBarColor === "error"? null : 2000}
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
					autoHideDuration={3000}
					onClose={this.onCloseNotificationSnackbar}
				>
					<SnackbarContent
						onClose={this.onCloseNotificationSnackbar}
						color="inverse"
						message={this.state.notificationSnackBarMessage}
					/>
				</Snackbar>
			</Box>
		);
	}
}

Topbar.propTypes = {
	className: PropTypes.string,
	classes: PropTypes.object.isRequired,
	isSidebarOpen: PropTypes.bool,
	onToggleSidebar: PropTypes.func,
	title: PropTypes.string,
};

Topbar.defaultProps = {
	onToggleSidebar: () => {},
};

const mapStateToProps = state => ({
	auth: state.auth,
	nav: state.nav,
	dashboard: state.dashboard,
	cache: state.cache,
	communication: state.communication,
});


export default compose(
		withTheme,
		withStyles(styles),
		connect(mapStateToProps, {logout, setCurrentUser}),
		withGlobals,
		withErrorHandler
	)(Topbar);
