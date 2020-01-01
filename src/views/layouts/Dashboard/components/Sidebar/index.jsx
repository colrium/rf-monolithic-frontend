/* eslint-disable react/display-name */
import React, { Component } from "react";
//Redux imports
import { connect } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import Fade from '@material-ui/core/Fade';
// Material helpers
import {
	Divider,
	Icon,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	Typography,
	withStyles
} from "@material-ui/core";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { PersonOutlined as UserIcon } from "@material-ui/icons";
//
import { app } from "assets/jss/app-theme";
// Externals
import classNames from "classnames";
import Button from "components/Button";
import Status from "components/Status";
import ScrollBars from "components/ScrollBars";
import Avatar from "components/Avatar";

import { attachments as AttachmentsService } from "services";
import { logout } from "state/actions/auth";
import { UtilitiesHelper } from "utils/Helpers";
import withRoot from "utils/withRoot";
import LazyImage from "components/LazyImage";
// Component styles
import styles from "./styles";

const AdapterLink = React.forwardRef((props, ref) => (
	<NavLink innerRef={ref} {...props} />
));

class Sidebar extends Component {
	
	state = {
		userPresenceMenuAnchorEl: null,
		userPresenceMenuOpen: false,
	};
	
	constructor(props) {
		super(props);
		this.onOpenUserPresenceMenu = this.onOpenUserPresenceMenu.bind(this);
		this.onCloseUserPresenceMenu = this.onCloseUserPresenceMenu.bind(this);
		this.onChangeUserPresenceMenu = this.onChangeUserPresenceMenu.bind(this);
	}
	
	onOpenUserPresenceMenu = event => {
		const userPresenceMenuAnchorEl = event.currentTarget;
		this.setState({ userPresenceMenuAnchorEl: userPresenceMenuAnchorEl, userPresenceMenuOpen: true });
	}
	
	onCloseUserPresenceMenu = () => {
		this.setState({ userPresenceMenuAnchorEl: null, userPresenceMenuOpen: false });
	}
	
	onChangeUserPresenceMenu = presence => event => {
		const { auth, sockets } = this.props;
		if (sockets.auth && auth.isAuthenticated) {
			sockets.auth.emit("change_user_presence", { id: auth.user._id, presence: presence });
		}		
		this.setState({ userPresenceMenuAnchorEl: null, userPresenceMenuOpen: false });
	}
	
	applyItemsRestrictions() {
		const { auth, items } = this.props;
		let items_with_restrictions = [];
		//iterate
		items.map((item, index) => {
			if (item.section) {
				let allowed_item_links = [];
				item.links.map((item_link, item_link_index) => {
					if (!item_link.restricted) {
						allowed_item_links.push(item_link);
					} else if (
						(Array.isArray(item_link.restricted) &&
							item_link.restricted.includes(auth.user.role)) ||
						item_link.restricted === auth.user.role
					) {
						allowed_item_links.push(item_link);
					} else if (
						UtilitiesHelper.isOfType(item_link.restricted, "function") &&
						!item_link.restricted(auth.user)
					) {
						allowed_item_links.push(item_link);
					}
				});
				//reassign links after link valifa
				item.links = allowed_item_links;
			}
			if (!item.restricted) {
				items_with_restrictions.push(item);
			} else if (
				(Array.isArray(item.restricted) &&
					item.restricted.includes(auth.user.role)) ||
				item.restricted === auth.user.role
			) {
				items_with_restrictions.push(item);
			} else if (
				UtilitiesHelper.isOfType(item.restricted, "function") &&
				!item.restricted(auth.user)
			) {
				items_with_restrictions.push(item);
			}
		});
		return items_with_restrictions;
	}
	render() {
		const { classes, className, items, auth } = this.props;
		const rootClassName = classNames(classes.root, className);

		return (
			<nav className={rootClassName}>
				<div className={classes.headerWrapper}>
					<div className={classes.logoWrapper}>
						<Link className={classes.logoLink} to="/">
							<LazyImage
								alt={app.name + " logo"}
								className={classes.logoImage}
								src={app.logo}
							/>
						</Link>
					</div>
					<div className={classes.profile}>
						{auth.user.avatar ? (
							<Avatar
								alt="Avatar"
								className={classes.avatar}
							>
								<LazyImage src={AttachmentsService.getAttachmentFileUrl(auth.user.avatar)} />
							</Avatar>
						) : (
								<Avatar className={classes.iconAvatar}>
									<UserIcon />
								</Avatar>
						)}
						
						{ auth.isAuthenticated && <Button className={classes.userMenuBtn} variant="text" onClick={this.onOpenUserPresenceMenu} textCase="wordcase" simple>
							{Object.size(auth.user) > 0 && <Status color={auth.user.presence === "online" ? "#00796b" : (auth.user.presence === "away" ? "#b88d00" : "#5C5C5C")} text={auth.user.first_name + " " + auth.user.last_name} />}
						</Button> }
						<Menu
							id="user-presence-menu"
							anchorEl={this.state.userPresenceMenuAnchorEl}
							open={this.state.userPresenceMenuOpen}
							onClose={this.onCloseUserPresenceMenu}
							TransitionComponent={Fade}
							keepMounted
						>
							<MenuItem onClick={this.onChangeUserPresenceMenu(auth.user ? (auth.user.presence === "online" ? "away" : "online") : "online")}>{auth.user ? (auth.user.presence === "online" ? "Set to away" : "Set to online") : "Set to online"}</MenuItem>
							{["online", "away"].includes(auth.user.presence) && <MenuItem onClick={this.onChangeUserPresenceMenu("offline")} >Set to offline</MenuItem>}
							<MenuItem><Link to={"/account".toUriWithDashboardPrefix()} color="default"> My account </Link> </MenuItem>
							<MenuItem>Logout</MenuItem>
						</Menu>
						{ auth.isAuthenticated && <Typography className={classes.nameText} variant="body2">
							{auth.user ? auth.user.email_address : ""}
						</Typography>}
						{ auth.isAuthenticated && <Typography className={classes.bioText} variant="caption">
							{auth.user ? auth.user.role : ""}
						</Typography>}
						
					</div>
				</div>
				<ScrollBars className={classes.bodyWrapper}>
					<List component="div" disablePadding className="px-2">
						{this.applyItemsRestrictions().map((item_link, index) =>
							item_link.section ? (
								<div key={"drawer_section_" + index}>
									<List
										component="div"
										disablePadding
										subheader={
											<ListSubheader
												className={classes.listSubheader}
												disableSticky
											>
												{item_link.text}
											</ListSubheader>
										}
									>
										{item_link.links.map((link_obj, link_index) => (
											<ListItem
												activeClassName={classes.activeListItem}
												className={classes.listItem}
												component={AdapterLink}
												to={link_obj.route}
												key={"drawer_item_" + index + "_" + link_index}
											>
												{link_obj.icon ? (
													<ListItemIcon
														className={classNames({
															[classes.listItemIcon]: true,
															[link_obj.color
																? link_obj.color + "_text"
																: ""]: true
														})}
													>
														{typeof link_obj.icon === "string" ? (
															<Icon>{link_obj.icon}</Icon>
														) : (
																link_obj.icon
															)}
													</ListItemIcon>
												) : (
														""
													)}
												{link_obj.text ? (
													<ListItemText
														primaryTypographyProps={{
															className: classNames({
																[classes.listItemText]: true,
																[link_obj.color
																	? link_obj.color + "_text"
																	: ""]: true
															})
														}}
														primary={link_obj.text}
													/>
												) : (
														""
													)}
											</ListItem>
										))}
									</List>
									<Divider className={classes.listDivider} />
								</div>
							) : (
									<ListItem
										activeClassName={classes.activeListItem}
										className={classes.listItem}
										component={AdapterLink}
										to={item_link.route}
										key={"drawer_item_" + index}
									>
										{item_link.icon ? (
											<ListItemIcon
												className={classNames({
													[classes.listItemIcon]: true,
													[item_link.color ? item_link.color + "_text" : ""]: true
												})}
											>
												{typeof item_link.icon === "string" ? (
													<Icon>{item_link.icon}</Icon>
												) : (
														item_link.icon
													)}
											</ListItemIcon>
										) : (
												""
											)}
										{item_link.text ? (
											<ListItemText
												primaryTypographyProps={{
													className: classNames({
														[classes.listItemText]: true,
														[item_link.color
															? item_link.color + "_text"
															: ""]: true
													})
												}}
												primary={item_link.text}
											/>
										) : (
												""
											)}
									</ListItem>
								)
						)}
					</List>
				</ScrollBars>
			</nav>
		);
	}
}

Sidebar.propTypes = {
	className: PropTypes.string,
	classes: PropTypes.object.isRequired,
	items: PropTypes.array
};

const mapStateToProps = state => ({
	auth: state.auth,
	sockets: state.sockets,
});

export default withRoot(
	compose(
		withStyles(styles),
		connect(
			mapStateToProps,
			{ logout }
		)
	)(Sidebar)
);
