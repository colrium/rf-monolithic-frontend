/**
 * /* eslint-disable react/display-name
 *
 * @format
 */

// Material helpers
import {
	Divider,
	Icon,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListSubheader,
} from "@mui/material";

// Externals
import classNames from "classnames";
import ScrollBars from "components/ScrollBars";
import PropTypes from "prop-types";
import React, { Component } from "react";
import Box from '@mui/material/Box';
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import compose from "recompose/compose";
import { width as drawerWidth } from "config/ui/drawer";
import { logout } from "state/actions/auth";
import { UtilitiesHelper } from "hoc/Helpers";
import { withGlobals } from "contexts/Globals";
// Component styles



const AdapterLink = React.forwardRef((props, ref) => (
	<NavLink innerRef={ ref } { ...props } />
));

class Sidebar extends Component {
	state = {
		userPresenceMenuAnchorEl: null,
		userPresenceMenuOpen: false,
	};

	constructor (props) {
		super(props);
		this.onOpenUserPresenceMenu = this.onOpenUserPresenceMenu.bind(this);
		this.onCloseUserPresenceMenu = this.onCloseUserPresenceMenu.bind(this);
		this.onChangeUserPresenceMenu = this.onChangeUserPresenceMenu.bind(
			this
		);
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

	applyItemsRestrictions () {
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
						UtilitiesHelper.isOfType(
							item_link.restricted,
							"function"
						) &&
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
	render () {
		const { className, items, auth, onClickNavLink } = this.props;

		return (
			<Box
				className={ `${ className ? className : "" }  flex flex-col h-full ` }
				sx={ {
					width: drawerWidth
				} }
				component="nav"
			>

				<ScrollBars className={ "overflow-x-hidden overflow-y-scroll" }>
					<List
						component="div"
						disablePadding
						className="px-0"
					>
						{ this.applyItemsRestrictions().map((item_link, index) =>
							item_link.section ? (
								<div key={ "drawer_section_" + index }>
									<List
										component="div"
										disablePadding
										subheader={
											<ListSubheader
												className={ "" }
												disableSticky
											>
												{ item_link.text }
											</ListSubheader>
										}
									>
										{ item_link.links.map(
											(link_obj, link_index) => (
												<ListItem
													activeClassName={ "primary inverse-text" }
													className={ "" }
													component={ AdapterLink }
													to={ link_obj.route }
													onClick={ (event) => {
														if (Function.isFunction(onClickNavLink)) {
															onClickNavLink(link_obj);
														}
													} }
													key={
														"drawer_item_" +
														index +
														"_" +
														link_index
													}
												>
													{ link_obj.icon ? (
														<ListItemIcon
															className={ classNames(
																{
																	[link_obj.color
																		? link_obj.color +
																		"_text"
																		: ""]: true,
																}
															) }
														>
															{ typeof link_obj.icon === "string" ? (
																<Icon>
																	{
																		link_obj.icon
																	}
																</Icon>
															) : (
																link_obj.icon
															) }
														</ListItemIcon>
													) : (
														""
													) }
													{ link_obj.text ? (
														<ListItemText
															primaryTypographyProps={ {
																className: classNames(
																	{
																		[link_obj.color
																			? link_obj.color +
																			"_text"
																			: ""]: true,
																	}
																),
															} }
															primary={
																link_obj.text
															}
														/>
													) : (
														""
													) }
												</ListItem>
											)
										) }
									</List>
									<Divider />
								</div>
							) : (
								<ListItem
									activeClassName={ classNames({ "activeListItemCSS": true }) }
									className={ "" }
									component={ AdapterLink }
									onClick={ (event) => {
										if (Function.isFunction(onClickNavLink)) {
											onClickNavLink(item_link);
										}
									} }
									to={ item_link.route }
									key={ "drawer_item_" + index }
								>
									{ item_link.icon ? (
										<ListItemIcon
											className={ classNames({
												[item_link.color
													? item_link.color + "_text"
													: ""]: true,
											}) }
										>
											{ typeof item_link.icon ===
												"string" ? (
												<Icon>{ item_link.icon }</Icon>
											) : (
												item_link.icon
											) }
										</ListItemIcon>
									) : (
										""
									) }
									{ item_link.text ? (
										<ListItemText
											primaryTypographyProps={ {
												className: classNames({
													[item_link.color
														? item_link.color +
														"_text"
														: ""]: true,
												}),
											} }
											primary={ item_link.text }
										/>
									) : (
										""
									) }
								</ListItem>
							)
						) }
					</List>
				</ScrollBars>
			</Box>
		);
	}
}

Sidebar.propTypes = {
	className: PropTypes.string,

	items: PropTypes.array,
};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default withGlobals(
	compose(connect(mapStateToProps, { logout }))(Sidebar)
);
