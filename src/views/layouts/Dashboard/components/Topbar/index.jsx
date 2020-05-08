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
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import compose from "recompose/compose";
import { bindActionCreators } from "redux";
import { withTheme } from '@material-ui/core/styles';
import AuthService from "services/auth";
import { logout, setCurrentUser } from "state/actions";
import { ServiceDataHelper } from "hoc/Helpers";
import {withGlobals} from "contexts/Globals";
import {withErrorHandler} from "hoc/ErrorHandler";
// Custom components
import { NotificationList } from "./components";
// Component styles
import styles from "./styles";



class Topbar extends Component {
	signal = true;
	ignoreConnectionState = false;
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
		this.initSocketActionsListener();
	}

	componentDidMount() {
		this.signal = true;
		let that = this;
		this.mounted = true;
		window.addEventListener("scroll", async function() {
			if (window.scrollY > 0) {
				if (this.mounted) {
					that.setState({ prominent: false });
				}
				
			} else {
				if (this.mounted) {
					that.setState({ prominent: true });
				}
				
			}
		});
		//this.getNotifications();
	}

	componentWillUnmount() {
		this.signal = false;
		this.mounted = false;
		this.ignoreConnectionState = true;
		let that = this;
		window.removeEventListener("scroll", async function() {
			that.setState({ prominent: false });
		});
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {
		this.mounted = false;
		return null;
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.mounted = true;
	}

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

						<Typography
								className={classes.title}
								variant="body1"
								color="inverse"
							>
								{title}
							</Typography>

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
									color={theme.palette.background.paper}
								/>
							</Badge>
						</IconButton>
						<IconButton
							className={classes.signOutButton}
							onClick={this.handleSignOut}
						>
							<Icon 
								path={mdiLogoutVariant}
								title="Logout Icon"    
								size={1}
								color={theme.palette.background.paper}
							/>
						</IconButton>
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
					autoHideDuration={this.state.connectionSnackBarColor === "error"? 200000000 : 2000}
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
	sockets: state.sockets,
});
const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			logout: logout,
			setCurrentUser: setCurrentUser,
		},
		dispatch
	);

export default compose(
		withTheme,
		withStyles(styles),
		connect(mapStateToProps, mapDispatchToProps),
		withGlobals,
		withErrorHandler
	)(Topbar);
