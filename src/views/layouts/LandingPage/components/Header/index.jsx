/** @format */

import AppBar from "@material-ui/core/AppBar";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import Fab from '@material-ui/core/Fab';
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Slide from "@material-ui/core/Slide";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Toolbar from "@material-ui/core/Toolbar";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import MenuIcon from "@material-ui/icons/Menu";
import CartIcon from "@material-ui/icons/ShoppingCartOutlined";
import logo from "assets/img/realfield/logo.svg";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { withTheme } from '@material-ui/core/styles';
import { withRouter, useLocation } from "react-router-dom";
import NavLink from "routes/NavLink";

import {withErrorHandler} from "hoc/ErrorHandler";


function HideOnScroll(props) {
	const { children, window } = props;
	// Note that you normally won't need to set the window ref as useScrollTrigger
	// will default to window.
	// This is only being set here because the demo is in an iframe.
	const trigger = useScrollTrigger({ target: window ? window() : undefined });

	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{children}
		</Slide>
	);
}

HideOnScroll.propTypes = {
	children: PropTypes.element.isRequired,
	window: PropTypes.func,
};

function ElevationScroll(props) {
	const { children, window } = props;
	// Note that you normally won't need to set the window ref as useScrollTrigger
	// will default to window.
	// This is only being set here because the demo is in an iframe.
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 0,
		target: window ? window() : undefined,
	});

	return React.cloneElement(children, {
		elevation: trigger ? 4 : 0,
	});
}

function Header(props) {
	let location = useLocation();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [activeSection, setActiveSection] = useState("jumbotron");
	
	
	const { className, showLogo, auth, window, cart, theme, app, history, ...rest } = props;
	let cart_items_count = JSON.isJSON(cart)? (Array.isArray(cart.entries)? cart.entries.length : 0) : 0;


	
	const trigger = useScrollTrigger({
		target: window ? window() : undefined,
		disableHysteresis: true,
		threshold: 64,
	});

	const toggleDrawer = open => event => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}
		setDrawerOpen(open);
	};


	const gotoSection = id => event => {
		let section = document.getElementById(id);
		if (section) {
			section.scrollIntoView({behavior: "smooth", block: "start"});
			setActiveSection(id);
		}
			
	};

	useEffect(()=>{
		
		if (location) {			

			const {hash} = location;
			
			if (!String.isEmpty(hash)) {
				let elementId = hash.trim();
				if (elementId.startsWith("#")) {
					elementId = elementId.replace("#", "");
					let section = document.getElementById(elementId);

					if (section) {	
						let sectionTitle = 	section.getAttribute("title");			
						section.scrollIntoView({behavior: "smooth", block: "center"});
					}					
				}
			}
			else{
				let backToTopAnchor = document.getElementById("back-to-top-anchor");

					if (backToTopAnchor) {				
						backToTopAnchor.scrollIntoView({ behavior: "smooth", block: "center" });
					}					
			}			
		}
		
	}, [location]);

	

	const DrawerItems = () => {
		return (
			<div
				className="w-full"
				role="presentation"
				onClick={toggleDrawer(false)}
				onKeyDown={toggleDrawer(false)}
			>
				<List>
					<ListItem button>
						<ListItemText
							primary={
								<NavLink
									to={"/why-us".toUriWithLandingPagePrefix()}
									color="inherit"
									activeStyle={{ 
										color: theme.palette.primary.main,
									}}
								>
									Why Realfield?
								</NavLink>
							}
						/>
					</ListItem>
					<ListItem button>
						<ListItemText
							primary={
								<NavLink
									to={"/home#products".toUriWithLandingPagePrefix()}
									color="inherit"
									activeStyle={{ 
										color: theme.palette.primary.main,
									}}
								>
									Products
								</NavLink>
							}
						/>
					</ListItem>
					<ListItem button>
						<ListItemText
							primary={
								<NavLink
									to={"/about-us".toUriWithLandingPagePrefix()}
									color="inherit"
									activeStyle={{ 
										color: theme.palette.primary.main,
									}}
								>
									About us
								</NavLink>
							}
						/>
					</ListItem>
					
					{(!auth.isAuthenticated ||
						Object.size(auth.user) === 0) && (
						<ListItem button>
							<ListItemText
								primary={
									<NavLink to={"/login"} color="inherit">
										Login
									</NavLink>
								}
							/>
						</ListItem>
					)}
					{auth.isAuthenticated && Object.size(auth.user) > 0 && (
						<ListItem button>
							<ListItemText
								primary={
									<NavLink
										to={"/dashboard"}
										target="_blank"
										color="inherit"
									>
										Dashboard
									</NavLink>
								}
							/>
						</ListItem>
					)}

					<ListItem button>
						<ListItemText
							primary={
								<NavLink
									to={"/jobs".toUriWithLandingPagePrefix()}
									color="inherit"
									activeStyle={{ 
										color: theme.palette.primary.main,
									}}
								>
									Jobs
								</NavLink>
							}
						/>
					</ListItem>
					
				</List>
			</div>
		);
	};

	return (
		<div id="back-to-top-anchor">
			<Hidden smDown>
				
					<ElevationScroll {...props}>
						<AppBar
							className={
								trigger
									? "shadow-xl inverse default_text md:px-32"
									: "bg-transparent shadow-none default_text md:px-32"
							}
							style={{
								WebkitTransition: "all 200ms",
								transition: "all 200ms",
							}}
						>
							{app.settings.general["landing-page-routing"] === "pages"? (
								<Toolbar className={"p-0"}>
									<NavLink
										className="flex-grow"
										to={"/home".toUriWithLandingPagePrefix()}
										color="inherit"
									>
										<Button className="justify-center p-0" color="default">
											{
												<img
													src={logo}
													className="h-10"
													alt="logo"
												/>
											}
										</Button>
									</NavLink>
									<NavLink
										to={"/why-us".toUriWithLandingPagePrefix()}
										color="inherit"
										className="mx-2"
										activeStyle={{ 
											borderBottom: "2px solid "+theme.palette.primary.main,
										}}
									>
										<Button
											edge="end"
											color="default"
											classes={{
												label: "capitalize"
											}}
										>
											Why Realfield?
										</Button>
									</NavLink>
									<NavLink
										to={"/products".toUriWithLandingPagePrefix()}
										color="inherit"
										className="mx-2"
										activeStyle={{ 
											borderBottom: "2px solid "+theme.palette.primary.main,
										}}
									>
										<Button
											edge="end"
											color="default"
											classes={{
												label: "capitalize"
											}}
										>
											Products
										</Button>
									</NavLink>
									<NavLink
										to={"/about-us".toUriWithLandingPagePrefix()}
										color="inherit"
										className="mx-2"
										activeStyle={{ 
											borderBottom: "2px solid "+theme.palette.primary.main,
										}}
									>
										<Button
											edge="end"
											color="default"
											classes={{
												label: "capitalize"
											}}
										>
											About us
										</Button>
									</NavLink>

									{(!auth.isAuthenticated ||
										Object.size(auth.user) === 0) && (
										<Button
											href="/login"
											edge="end"
											color="default"
											classes={{
												label: "capitalize accent-text"
											}}
										>
											Login
										</Button>
									)}
									{auth.isAuthenticated &&
										Object.size(auth.user) > 0 && (
											<Button
												href={"/home".toUriWithDashboardPrefix()}
												edge="end"
												color="default"
												target="_blank"
												classes={{
													label: "capitalize accent-text"
												}}
											>
												Dashboard
											</Button>
										)}
									

									<NavLink
										to={"/jobs".toUriWithLandingPagePrefix()}
										color="inherit"

										activeStyle={{ 
											borderBottom: "2px solid "+theme.palette.primary.main,
										}}
									>
										<Fab
											className="mx-2 px-6"
											color="primary"
											variant="extended"
											size="small" 
											classes={{
												label: "capitalize"
											}}
										>
											Jobs!
										</Fab>
									</NavLink>

									{/*<NavLink
										to={"/cart".toUriWithLandingPagePrefix()}
										color="inherit"
									>
										<IconButton className="mx-2" aria-label="cart">
											<Badge
												badgeContent={cart_items_count}
												color="primary"
											>
												<CartIcon fontSize="small" />
											</Badge>
										</IconButton>
									</NavLink>*/}
								</Toolbar>
							) : (
								<Toolbar  className={"p-0"}>
									<NavLink
										className="flex-grow"
										to={"/home".toUriWithLandingPagePrefix()}
										color="inherit"
									>
										<Button color="default" className="px-0">
											{
												<img
													src={logo}
													className="h-8"
													alt="logo"
												/>
											}
										</Button>
									</NavLink>
									<NavLink
										to={"/why-us".toUriWithLandingPagePrefix()}
										color="inherit"
										className="mr-4"
										activeStyle={{ 
											borderBottom: "2px solid "+theme.palette.primary.main,
										}}
										
									>
										<Button
											edge="end"
											color="default"
											className="px-0"
											classes={{
												label: "capitalize"
											}}
										>
											Why Realfield?
										</Button>
									</NavLink>
									<NavLink
										to={"/home#products".toUriWithLandingPagePrefix()}
										color="inherit"
										className="mr-4"
										activeStyle={{ 
											borderBottom: "2px solid "+theme.palette.primary.main,
										}}
									>
										<Button
											edge="end"
											color="default"
											className="px-0"
											classes={{
												label: "capitalize"
											}}
										>
											Products
										</Button>
									</NavLink>
									<NavLink
										to={"/about-us".toUriWithLandingPagePrefix()}
										color="inherit"
										className="mr-4"
										activeStyle={{ 
											borderBottom: "2px solid "+theme.palette.primary.main,
										}}
									>
										<Button
											edge="end"
											color="default"
											className="px-0"
											classes={{
												label: "capitalize"
											}}
										>
											About us
										</Button>
									</NavLink>

									{(!auth.isAuthenticated ||
										Object.size(auth.user) === 0) && (
										<Button
											href="/login"
											edge="end"
											color="default"
											classes={{
												label: "capitalize accent-text"
											}}
										>
											Login
										</Button>
									)}
									{auth.isAuthenticated &&
										Object.size(auth.user) > 0 && (
											<Button
												href={"/home".toUriWithDashboardPrefix()}
												edge="end"
												color="default"
												target="_blank"
												classes={{
													label: "capitalize accent-text"
												}}
											>
												Dashboard
											</Button>
										)}
									

									<NavLink
										to={"/jobs".toUriWithLandingPagePrefix()}
										color="inherit"
										activeStyle={{ 
											//borderBottom: "2px solid "+theme.palette.primary.main,
										}}
									>
										<Fab
											className="mx-2 px-6"
											color="primary"
											variant="extended"
											size="small" 
											classes={{
												label: "capitalize"
											}}
										>
											Jobs!
										</Fab>
									</NavLink>

									{/*<NavLink
										to={"/cart".toUriWithLandingPagePrefix()}
										color="inherit"
									>
										<IconButton className="mx-2" aria-label="cart">
											<Badge
												badgeContent={cart_items_count}
												color="primary"
											>
												<CartIcon fontSize="small" />
											</Badge>
										</IconButton>
									</NavLink>*/}
							</Toolbar>
						)}
						</AppBar>
					</ElevationScroll>
				
			</Hidden>

			<Hidden mdUp>
				<ElevationScroll {...props}>
					<AppBar className="shadow-none inverse default_text">
						<Toolbar>
							<IconButton
								edge="start"
								className="mr-4"
								color="inherit"
								aria-label="menu"
								onClick={toggleDrawer(true)}
							>
								<MenuIcon />
							</IconButton>
							<NavLink
								className="flex-grow"
								to={"/home".toUriWithLandingPagePrefix()}
								color="inherit"
							>
								<Button color="inherit">
									{
										<img
											src={logo}
											className="h-6"
											alt="logo"
										/>
									}
								</Button>
							</NavLink>
							{/*<NavLink
								to={"/cart".toUriWithLandingPagePrefix()}
								color="inherit"
							>
								<IconButton className="mx-2" aria-label="cart">
									<Badge
										badgeContent={cart_items_count}
										color="primary"
									>
										<CartIcon fontSize="small" />
									</Badge>
								</IconButton>
							</NavLink>*/}
						</Toolbar>
					</AppBar>
				</ElevationScroll>
				<SwipeableDrawer
					open={drawerOpen}
					onClose={toggleDrawer(false)}
					classes={{ paper: "w-64" }}
					onOpen={toggleDrawer(true)}
				>
					<DrawerItems />
				</SwipeableDrawer>
			</Hidden>
		</div>
	);
}

const mapStateToProps = state => ({
	auth: state.auth,
	cart: state.ecommerce.cart,
	app: state.app,
});

export default withErrorHandler(compose(connect(mapStateToProps, {}), withTheme, withRouter)(Header));
