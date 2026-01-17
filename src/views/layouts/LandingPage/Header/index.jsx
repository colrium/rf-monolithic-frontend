/** @format */

import AppBar from "@mui/material/AppBar"
import Button from "@mui/material/Button"
import Fab from "@mui/material/Fab"
import Hidden from "@mui/material/Hidden"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Slide from "@mui/material/Slide"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import Toolbar from "@mui/material/Toolbar"
import useScrollTrigger from "@mui/material/useScrollTrigger"
import MenuIcon from "@mui/icons-material/Menu"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import compose from "recompose/compose"
import { withTheme } from "@mui/styles"
import { useLocation } from "react-router-dom"
import NavLink from "routes/NavLink"

function HideOnScroll(props) {
	const { children, window } = props
	// Note that you normally won't need to set the window ref as useScrollTrigger
	// will default to window.
	// This is only being set here because the demo is in an iframe.
	const trigger = useScrollTrigger({ target: window ? window() : undefined })

	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{children}
		</Slide>
	)
}

HideOnScroll.propTypes = {
	children: PropTypes.element.isRequired,
	window: PropTypes.func,
}

function ElevationScroll(props) {
	const { children, window } = props
	// Note that you normally won't need to set the window ref as useScrollTrigger
	// will default to window.
	// This is only being set here because the demo is in an iframe.
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 0,
		target: window ? window() : undefined,
	})

	return React.cloneElement(children, {
		elevation: trigger ? 4 : 0,
	})
}

function Header(props) {
	let location = useLocation()
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [activeSection, setActiveSection] = useState("jumbotron")

	const { className, showLogo, auth, window, cart, theme, app, history, ...rest } = props
	let cart_items_count = JSON.isJSON(cart) ? (Array.isArray(cart.entries) ? cart.entries.length : 0) : 0

	const trigger = useScrollTrigger({
		target: window ? window() : undefined,
		disableHysteresis: true,
		threshold: 1,
	})

	const toggleDrawer = open => event => {
		if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
			return
		}
		setDrawerOpen(open)
	}

	const gotoSection = id => event => {
		let section = document.getElementById(id)
		if (section) {
			section.scrollIntoView({ behavior: "smooth", block: "start" })
			setActiveSection(id)
		}
	}

	useEffect(() => {
		if (location) {
			const { hash } = location

			if (!String.isEmpty(hash)) {
				let elementId = hash.trim()
				if (elementId.startsWith("#")) {
					elementId = elementId.replace("#", "")
					let section = document.getElementById(elementId)

					if (section) {
						let sectionTitle = section.getAttribute("title")
						section.scrollIntoView({ behavior: "smooth", block: "center" })
					}
				}
			} else {
				let backToTopAnchor = document.getElementById("back-to-top-anchor")

				if (backToTopAnchor) {
					backToTopAnchor.scrollIntoView({ behavior: "smooth", block: "center" })
				}
			}
		}
	}, [location])

	const DrawerItems = () => {
		return (
			<div className="w-full" role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
				<List>
					<ListItem>
						<ListItemText
							primary={
								<NavLink to={"/why-us".toUriWithLandingPagePrefix()} color="inherit">
									Why Realfield?
								</NavLink>
							}
						/>
					</ListItem>
					<ListItem>
						<ListItemText
							primary={
								<NavLink to={"/about-us".toUriWithLandingPagePrefix()} color="inherit">
									About us
								</NavLink>
							}
						/>
					</ListItem>

					{(!auth.isAuthenticated || Object.size(auth.user) === 0) && (
						<ListItem>
							<ListItemText
								primary={
									<NavLink to={"/auth/login"} color="inherit">
										Login
									</NavLink>
								}
							/>
						</ListItem>
					)}

					{auth.isAuthenticated && (
						<ListItem>
							<ListItemText
								primary={
									<NavLink to={"/community".toUriWithLandingPagePrefix()} color="inherit">
										Community
									</NavLink>
								}
							/>
						</ListItem>
					)}
					{auth.isAuthenticated && (
						<ListItem>
							<ListItemText
								primary={
									<NavLink to={"/dashboard"} color="inherit">
										Dashboard
									</NavLink>
								}
							/>
						</ListItem>
					)}

					<ListItem>
						<ListItemText
							primary={
								<NavLink to={"/jobs".toUriWithLandingPagePrefix()} color="inherit">
									Jobs
								</NavLink>
							}
						/>
					</ListItem>
				</List>
			</div>
		)
	}

	return (
		<div id="back-to-top-anchor">
			<Hidden mdDown>
				<ElevationScroll {...props}>
					<AppBar
						className={
							trigger ? "shadow-xl blur-bg-sm  md:px-32 transition-all" : "shadow-none md:px-32 relative transition-all"
						}
						sx={{
							// WebkitTransition: "all 200ms",
							// transition: "all 200ms",
							color: theme => theme.palette.text.secondary,
							backgroundColor: theme => (trigger ? theme.palette.background.default : "transparent"),
						}}
					>
						<Toolbar className={"p-0"}>
							<NavLink to={"/home".toUriWithLandingPagePrefix()} color="inherit">
								<Button className="px-0">
									{
										<img
											src={"https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/logo.svg"}
											className="h-8"
											alt="logo"
										/>
									}
								</Button>
							</NavLink>

							<div className="flex-grow" />
							<NavLink to={"/why-us".toUriWithLandingPagePrefix()} color="inherit" className="mr-4">
								<Button edge="end" color="inherit" className=" capitalize">
									Why Realfield?
								</Button>
							</NavLink>
							<NavLink to={"/about-us".toUriWithLandingPagePrefix()} color="inherit" className="mr-4">
								<Button edge="end" className="px-0" color="inherit" className=" capitalize">
									About us
								</Button>
							</NavLink>
							{auth.isAuthenticated && (
								<NavLink to={"/community".toUriWithLandingPagePrefix()} color="inherit">
									<Button edge="end" color="inherit" className="capitalize">
										Community
									</Button>
								</NavLink>
							)}
							{(!auth.isAuthenticated || Object.size(auth.user) === 0) && (
								<NavLink to={"/auth/login"} color="inherit">
									<Button color="inherit" className=" capitalize">
										Login
									</Button>
								</NavLink>
							)}

							{auth.isAuthenticated && Object.size(auth.user) > 0 && (
								<NavLink to={"/home".toUriWithDashboardPrefix()} color="inherit">
									<Button edge="end" color="inherit" className="capitalize">
										Dashboard
									</Button>
								</NavLink>
							)}

							<NavLink to={"/jobs".toUriWithLandingPagePrefix()} color="inherit">
								<Fab color="primary" variant="extended" size="small" className="mx-2 px-6 capitalize">
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
					</AppBar>
				</ElevationScroll>
			</Hidden>

			<Hidden mdUp>
				<ElevationScroll {...props}>
					<AppBar
						className="shadow-none inverse default_text"
						sx={{
							backgroundColor: theme => theme.palette.background.paper,
							color: theme => theme.palette.text.primary,
						}}
					>
						<Toolbar
							sx={{
								backgroundColor: "transparent",
							}}
						>
							<IconButton edge="start" className="mr-4" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
								<MenuIcon />
							</IconButton>
							<NavLink className="flex-grow" to={"/home".toUriWithLandingPagePrefix()} color="inherit">
								<Button color="inherit">
									{
										<img
											src={"https://realfield.nyc3.cdn.digitaloceanspaces.com/public/img/realfield/logo.svg"}
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
				<SwipeableDrawer open={drawerOpen} onClose={toggleDrawer(false)} classes={{ paper: "w-64" }} onOpen={toggleDrawer(true)}>
					<DrawerItems />
				</SwipeableDrawer>
			</Hidden>
		</div>
	)
}

const mapStateToProps = state => ({
	auth: state.auth,
	cart: state.ecommerce.cart,
	app: state.app,
})

export default compose(connect(mapStateToProps, {}), withTheme)(Header)
