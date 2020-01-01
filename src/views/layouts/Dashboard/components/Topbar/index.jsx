import React, { Component } from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Hidden from '@material-ui/core/Hidden';
import compose from "recompose/compose";
import PropTypes from "prop-types";
import {
	AppBar,
	Badge,
	Box,
	Breadcrumbs,
	IconButton,
	Popover,
	Snackbar,
	Toolbar,
	withStyles
} from '@material-ui/core';
import { PowerSettingsNew as LogoutIcon, NotificationsOutlined as NotificationsIcon } from "@material-ui/icons";
import CloseSideBarIcon from "@material-ui/icons/ChevronLeft";
import OpenSideBarIcon from "@material-ui/icons/Menu";
import SnackbarContent from "components/Snackbar/SnackbarContent";
import Status from "components/Status";
import Typography from "components/Typography";

import { notifications as notificationsDefination } from "definations";

import { notifications as notificationsService } from "services";
import AuthService from "services/auth";
import { logout, setCurrentUser } from "state/actions";
import { ServiceDataHelper } from "utils/Helpers";
import withRoot from "utils/withRoot";
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
		notificationSnackBarMessage: "New notification"
	};

	constructor(props) {
		super(props);
		this.onCloseConnectionSnackbar = this.onCloseConnectionSnackbar.bind(this);
		this.onCloseNotificationSnackbar = this.onCloseNotificationSnackbar.bind(this);
		this.initSocketActionsListener();
	}

	componentDidMount() {
		this.signal = true;
		let that = this;
		window.addEventListener('scroll', function(){
			if (window.scrollY > 0) {
				that.setState({ prominent: false });
			}
			else{
				that.setState({ prominent: true });
			}			
		});
		this.getNotifications();
	}

	componentWillUnmount() {
		this.signal = false;
		this.ignoreConnectionState = true;
		let that = this;
		window.removeEventListener('scroll', function(){
			that.setState({ prominent: false });		
		});
	}

	initSocketActionsListener() {
		const { sockets, auth, setCurrentUser, dispatch} = this.props;
		if (sockets.default) {
			sockets.default.on("connect", () => {
				if (this.state.connectionSnackBarOpened && !this.ignoreConnectionState) {
					this.setState({ connectionSnackBarOpen: true, connectionSnackBarColor: "success", connectionSnackBarMessage: "Connection Restored" });
				}
			});
			sockets.default.on("disconnect", () => {
				if (!this.ignoreConnectionState) {
					this.setState({
						connectionSnackBarOpened: true,
						connectionSnackBarOpen: true,
						connectionSnackBarColor: "error",
						connectionSnackBarMessage: "Connection Lost"
					});
				}
			});

			sockets.default.on("create", ({ context, action }) => {
				if (auth.isAuthenticated && "_id" in auth.user) {
					if (context.toLowerCase() === "notifications") {
						if (action.effects.notify === auth.user._id && !action.effects.read) {
							this.setState(prevState => ({
								notifications: Array.isArray(prevState.notifications)
									? prevState.notifications.unshift(action.effects)
									: [action.effects],
								notificationSnackBarOpen: true,
								notificationSnackBarMessage: action.effects.body
							}));

							//this.getNotifications();
						}
					}
				}
			});

			sockets.default.on("new_notification", notification => {
				if (auth.isAuthenticated && "_id" in auth.user) {
					if (notification.notify === auth.user._id && !notification.read) {
						this.setState(prevState => ({
							notifications: Array.isArray(prevState.notifications)
								? prevState.notifications.unshift(notification)
								: [notification],
							notificationSnackBarOpen: true,
							notificationSnackBarMessage: notification.body
						}));
						//this.getNotifications();
					}
				}

			});
			
			sockets.default.on("update", ({ context, action }) => {
				if (context.toLowerCase() === "notification") {
					if (action.effects.notify === auth.user._id) {
						this.setState(prevState => ({
							notifications: Array.isArray(prevState.notifications)
								? prevState.notifications.unshift(action.effects)
								: [action.effects],
							notificationSnackBarOpen: true,
							notificationSnackBarMessage: action.effects.body
						}));
						//this.getNotifications();
					}
				} else if (context.toLowerCase() === "user" && auth.isAuthenticated && "_id" in auth.user) {
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
		
		if (sockets.auth) {
			sockets.auth.on("connect", () => {
				if (auth.isAuthenticated && "_id" in auth.user) {
					sockets.auth.emit("set_identity", { _id: auth.user._id, presence: auth.user.presence});
				}
			});
			
			sockets.auth.on("identity_set", profile => {
				if (auth.isAuthenticated) {
					setCurrentUser(profile);
				}
			});

			sockets.auth.on("new_notification", notification => {
				if (auth.isAuthenticated && "_id" in auth.user) {
					if (notification.notify === auth.user._id && !notification.read) {
						this.setState(prevState => ({
							notifications: Array.isArray(prevState.notifications)
								? prevState.notifications.unshift(notification)
								: [notification],
							notificationSnackBarOpen: true,
							notificationSnackBarMessage: notification.body
						}));
						//this.getNotifications();
					}
				}

			});



			sockets.auth.on("update", ({ context, action }) => {
				if (context.toLowerCase() === "notification") {
					if (action.effects.notify === auth.user._id) {
						this.setState(prevState => ({
							notifications: Array.isArray(prevState.notifications)
								? prevState.notifications.unshift(action.effects)
								: [action.effects],
							notificationSnackBarOpen: true,
							notificationSnackBarMessage: action.effects.body
						}));
						//this.getNotifications();
					}
				} else if (context.toLowerCase() === "user" && auth.isAuthenticated && "_id" in auth.user) {
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
						parsed_data[field_name] = field.possibilities[entry[field_name]];
					}
				} else if (typeof field.possibilities === "function") {
					if (entry[field_name] in field.possibilities(entry, auth.user)) {
						parsed_data[field_name] = field.possibilities(entry, auth.user)[
							entry[field_name]
						];
					}
				}
			}
		}
		return parsed_data;
	}

	getNotifications() {
		const { auth } = this.props;

		const { notificationsLimit } = this.state;

		notificationsService
			.getRecordsCount({ read: "0" })
			.then(res => {
				this.setState(state => ({
					notificationsCount: res.body.data.count,
					load_error: false,
					loading: false
				}));
			})
			.catch(err => {
				this.setState(state => ({ load_error: err, loading: false }));
			});

		notificationsService
			.getRecords({
				p: 1,
				pagination: notificationsLimit,
				desc: "date_created"
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
				this.setState(state => ({
					notifications: all_records,
					load_error: false,
					loading: false
				}));
			})
			.catch(err => {
				this.setState(state => ({ load_error: err, loading: false }));
			});
	}

	handleSignOut = () => {
		const { logout } = this.props;
		AuthService.logout();
		logout();		
	};

	handleShowNotifications = event => {
		this.setState({ notificationsEl: event.currentTarget }, () => {
			if (this.state.notificationsCount > 0) {
				notificationsService
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

	handleCloseNotifications = () => {
		this.setState({
			notificationsEl: null
		});
	};

	onCloseConnectionSnackbar() {
		this.setState({
			connectionSnackBarOpen: false
		});
	}

	onCloseNotificationSnackbar() {
		this.setState({
			notificationSnackBarOpen: false
		});
	}

	render() {
		const {
			classes,
			className,
			title,
			isSidebarOpen,
			onToggleSidebar,
			dashboard,
			nav
		} = this.props;
		const { notifications, notificationsCount, notificationsEl } = this.state;

		const rootClassName = classNames(classes.root, className);
		const showNotifications = Boolean(notificationsEl);

		const breadcrumbs = nav.entries;

		return (
			<Box>
				<AppBar className={rootClassName}>
					<Toolbar className={classNames({[classes.toolbar]: true/*, [classes.prominent]: this.state.prominent*/})}>
						{ dashboard.drawer_displayed && <IconButton
							className={classes.menuButton}
							onClick={onToggleSidebar}
							variant="text"
						>
							{isSidebarOpen ? <CloseSideBarIcon /> : <OpenSideBarIcon />}
						</IconButton> }

						<Hidden mdDown>

							<Breadcrumbs
								maxItems={4}
								aria-label="breadcrumb"
								separator={"/"}
								className={classes.breadcrumbs}
							>
							
								{breadcrumbs.map(
									(breadcrumb, index) =>
										index < breadcrumbs.length - 1 && (
											<Link className={classes.breadcrumb} to={breadcrumb.uri} key={"breadcrumb-" + index} >
												<Typography className={classes.title} variant="body1" color="inverse" > {breadcrumb.title}</Typography>
											</Link>
										)
								)}
								<Typography  variant="body1" color="inverse" >
									{title}
								</Typography>
							
							</Breadcrumbs>
						</Hidden>
						
						<Hidden lgUp>
							<Typography className={classes.title} variant="body1" color="inverse" >
								{title}
							</Typography>
						</Hidden>

						<IconButton
							className={classes.notificationsButton}
							onClick={this.handleShowNotifications}
						>
							<Badge
								badgeContent={notificationsCount}
								color="secondary"
								variant="dot"
							>
								<NotificationsIcon />
							</Badge>
						</IconButton>
						<IconButton
							className={classes.signOutButton}
							onClick={this.handleSignOut}
						>
							<LogoutIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
				<Popover
					anchorEl={notificationsEl}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center"
					}}
					onClose={this.handleCloseNotifications}
					open={showNotifications}
					transformOrigin={{
						vertical: "top",
						horizontal: "center"
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
						horizontal: "center"
					}}
					open={this.state.connectionSnackBarOpen}
					autoHideDuration={6000}
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
						horizontal: "right"
					}}
					open={this.state.notificationSnackBarOpen}
					autoHideDuration={6000}
					onClose={this.onCloseNotificationSnackbar} >
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
	title: PropTypes.string
};

Topbar.defaultProps = {
	onToggleSidebar: () => { }
};

const mapStateToProps = state => ({
	auth: state.auth,
	nav: state.nav,
	dashboard: state.dashboard,
	sockets: state.sockets,
});
export default withRoot(
	compose(
		withStyles(styles),
		connect(
			mapStateToProps,
			{ logout, setCurrentUser }
		)
	)(Topbar)
);
