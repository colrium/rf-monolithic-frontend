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
	IconButton,
} from "@mui/material";

import CloseSideBarIcon from "@mui/icons-material/MenuOpen";
import OpenSideBarIcon from "@mui/icons-material/Menu";
import classNames from "classnames";
import ScrollBars from "components/ScrollBars";
import PropTypes from "prop-types";
import React, { Component } from "react";
import Box from "@mui/material/Box";
import { connect } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import compose from "recompose/compose";
import { width as drawerWidth } from "config/ui/drawer";
import { logout } from "state/actions/auth";
import { UtilitiesHelper } from "utils/Helpers";
import { app } from "assets/jss/app-theme";
import { withNetworkServices } from "contexts/NetworkServices";
// Component styles

const AdapterLink = React.forwardRef((props, ref) => (
	<NavLink ref={ref} {...props} />
));

class Sidebar extends Component {
	state = {
		userPresenceMenuAnchorEl: null,
		userPresenceMenuOpen: false,
	}

	constructor(props) {
		super(props)
	}


	applyItemsRestrictions() {
		const { auth, items } = this.props
		let items_with_restrictions = []
		//iterate
		items.map((item, index) => {
			if (item.section) {
				let allowed_item_links = []
				item.links.map((item_link, item_link_index) => {
					if (!item_link.restricted) {
						allowed_item_links.push(item_link)
					} else if (
						(Array.isArray(item_link.restricted) && item_link.restricted.includes(auth.user?.role)) ||
						item_link.restricted === auth.user?.role
					) {
						allowed_item_links.push(item_link)
					} else if (UtilitiesHelper.isOfType(item_link.restricted, "function") && !item_link.restricted(auth.user)) {
						allowed_item_links.push(item_link)
					}
				})
				//reassign links after link valifa
				item.links = allowed_item_links
			}
			if (!item.restricted) {
				items_with_restrictions.push(item)
			} else if (
				(Array.isArray(item.restricted) && item.restricted.includes(auth.user?.role)) ||
				item.restricted === auth.user?.role
			) {
				items_with_restrictions.push(item)
			} else if (UtilitiesHelper.isOfType(item.restricted, "function") && !item.restricted(auth.user)) {
				items_with_restrictions.push(item)
			}
		})
		return items_with_restrictions
	}
	render() {
		const { className, items, auth, onClickNavLink, onToggleSidebar, open } = this.props

		return (
			<Box
				className={`${className ? className : ""}  flex flex-col h-full `}
				sx={{
					width: drawerWidth,
				}}
				component="nav"
			>
				{/* <Box className="flex flex-row items-center justify-center">
					<IconButton
						onClick={onToggleSidebar}
						variant="text"
						size=""
						sx={{
							alignSelf: "center",
							marginLeft: "4px",
							marginRight: theme => theme.spacing(2),
							color: theme => theme.palette.background.paper,
							"&:hover": {
								color: theme =>
									theme.palette.secondary.main +
									" !important",
							},
						}}>
						{open ? (
							<CloseSideBarIcon fontSize="inherit" />
						) : (
							<OpenSideBarIcon />
						)}
					</IconButton>

					<Link
						className={
							"inline-block text-left w-auto cursor-pointer"
						}
						to={"/home".toUriWithDashboardPrefix()}>
						<img
							alt={"Home"}
							className={"cursor-pointer h-6"}
							src={app.logo}
						/>
					</Link>
				</Box> */}
				<ScrollBars className={"overflow-x-hidden overflow-y-scroll"}>
					<List component="div" disablePadding className="px-0 pb-12">
						{this.applyItemsRestrictions().map((item_link, index) =>
							item_link.section ? (
								<div key={"drawer_section_" + index}>
									<List
										component="div"
										disablePadding
										subheader={
											<ListSubheader
												sx={{
													color: theme => theme.palette.text.contrastDark,
												}}
												disableSticky
											>
												{item_link.text}
											</ListSubheader>
										}
									>
										{item_link.links.map((link_obj, link_index) => (
											<ListItem
												className={"pointer transition-all hover:bg-black hover:bg-opacity-5"}
												sx={{
													color: theme => theme.palette.text.contrast,
												}}
												component={AdapterLink}
												to={link_obj.route}
												onClick={event => {
													if (Function.isFunction(onClickNavLink)) {
														onClickNavLink(link_obj)
													}
												}}
												key={"drawer_item_" + index + "_" + link_index}
											>
												{!!link_obj.icon && (
													<ListItemIcon
														className={classNames({
															"text-current": true,
															[link_obj.color ? link_obj.color + "_text" : ""]: !!link_obj.color,
														})}
														color="inherit"
													>
														{typeof link_obj.icon === "string" ? <Icon>{link_obj.icon}</Icon> : link_obj.icon}
													</ListItemIcon>
												)}
												{!!link_obj.text && (
													<ListItemText
														primaryTypographyProps={{
															className: classNames({
																"text-current": true,
																[item_link?.color + "_text"]: !!item_link?.color,
															}),
														}}
														primary={link_obj.text}
													/>
												)}
											</ListItem>
										))}
									</List>
									{/* <Divider /> */}
								</div>
							) : (
								<ListItem
									sx={{
										color: theme => theme.palette.text.contrast,
									}}
									className={"pointer transition-all hover:bg-black hover:bg-opacity-5"}
									component={AdapterLink}
									onClick={event => {
										if (Function.isFunction(onClickNavLink)) {
											onClickNavLink(item_link)
										}
									}}
									to={item_link.route}
									key={"drawer_item_" + index}
								>
									{item_link.icon ? (
										<ListItemIcon
											className={classNames({
												"text-current": true,
												[item_link?.color + "_text"]: !!item_link?.color,
											})}
											color="inherit"
										>
											{typeof item_link.icon === "string" ? <Icon>{item_link.icon}</Icon> : item_link.icon}
										</ListItemIcon>
									) : (
										""
									)}
									{item_link.text ? (
										<ListItemText
											primaryTypographyProps={{
												className: classNames({
													"text-current": true,
													[item_link?.color + "_text"]: !!item_link?.color,
												}),
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
			</Box>
		)
	}
}

Sidebar.propTypes = {
	className: PropTypes.string,

	items: PropTypes.array,
};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default compose(
	connect(mapStateToProps, { logout }),
	withNetworkServices
)(Sidebar);
