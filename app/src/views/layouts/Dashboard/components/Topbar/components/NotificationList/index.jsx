/** @format */

// Material helpers
import { Button, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

import Box from "@mui/material/Box";
// Material icons
import { LabelOutlined as ContextlessNotificationIcon, NotificationsOutlined as EmptyIcon } from "@mui/icons-material";
import { colors } from "assets/jss/app-theme";
import classNames from "classnames";
import Status from "components/Status";
import Typography from "components/Typography";
import { withGlobals } from "contexts/Globals";
// Externals
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { UtilitiesHelper } from "utils/Helpers";

// Component styles


class NotificationList extends Component {
	constructor(props) {
		super(props);
		const { definations } = this.props;
		this.contexts = {
			contextless: {
				icon: <ContextlessNotificationIcon />,
				color: colors.hex.default,
			},
		};

		for (let [name, defination] of Object.entries(definations)) {
			this.contexts[UtilitiesHelper.singularize(name).toLowerCase()] = {
				icon: defination.icon ? (
					defination.icon
				) : (
					<ContextlessNotificationIcon />
				),
				color: defination.color ? defination.color : colors.hex.default,
			};
		}
	}

	componentDidMount() { }

	render() {
		const { className, notifications, onSelect, definations } = this.props;
		const priority_colors = {
			low: "#03a9f4",
			medium: "#ff9800",
			high: "#ff0000",
		};

		return (
			<div className={className}>
				{notifications.length > 0 ? (
					<Box>
						<div className={""}>
							<Typography variant="h6">
								User Notifications
							</Typography>
							<Typography
								className={""}
								variant="body2"
							>
								{notifications.length} new notifications
							</Typography>
						</div>
						<div className={""}>
							<List component="div">
								{notifications.map(notification => (
									<Link
										key={notification._id}
										to={definations.notifications.access.actions.view.uri(
											notification._id
										)}
									>
										<ListItem
											className={""}
											component="div"
											onClick={onSelect}
										>
											<ListItemIcon
												className={""}
												style={{
													color: notification.context
														? notification.context.toLowerCase() in
															this.contexts
															? this.contexts[
																notification.context.toLowerCase()
															].color
															: this.contexts
																.contextless
																.color
														: this.contexts
															.contextless
															.color,
												}}
											>
												{notification.context
													? notification.context.toLowerCase() in
														this.contexts
														? this.contexts[
															notification.context.toLowerCase()
														].icon
														: this.contexts
															.contextless
															.icon
													: this.contexts.contextless
														.icon}
											</ListItemIcon>
											<ListItemText
												primary={
													<React.Fragment>
														<Status
															variant="dot"
															color={
																notification.priority.toLowerCase() in
																	priority_colors
																	? priority_colors[
																	notification.priority.toLowerCase()
																	]
																	: "#9e9e9e"
															}
															text={
																notification.title
															}
															text_color={
																notification.read
																	? colors.hex
																		.grey
																	: colors.hex
																		.default
															}
														></Status>
													</React.Fragment>
												}
												secondary={
													<Typography
														color={
															notification.read
																? "grey"
																: "default"
														}
														variant="body2"
														component="span"
													>
														{" "}
														{notification.body}{" "}
													</Typography>
												}
											/>
										</ListItem>
									</Link>
								))}
							</List>
							<div className={""}>
								<Button
									component={Link}
									to="/notifications"
									variant="text"
									color="primary"
								>
									All Notifications
								</Button>
							</div>
						</div>
					</Box>
				) : (
					<div className={""}>
						<div className={""}>
							<EmptyIcon className={""} />
						</div>
						<Typography color="grey" variant="body2">
							No new notifications yet
						</Typography>
					</div>
				)}
			</div>
		);
	}
}

NotificationList.propTypes = {
	className: PropTypes.string,

	notifications: PropTypes.array.isRequired,
	onSelect: PropTypes.func,
};

NotificationList.defaultProps = {
	notifications: [],
	onSelect: () => { },
};

export default withGlobals(((NotificationList)));
