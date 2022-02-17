/** @format */

import React, { useEffect } from "react"
import { Route, useLocation, useNavigate } from "react-router-dom"
import { connect } from "react-redux"
import { items as drawer_items } from "config/ui/drawer"
import { withGlobals } from "contexts/Globals"
import { Outlet, useSearchParams } from "react-router-dom"
import { app } from "assets/jss/app-theme"

import { Dashboard as DashboardLayout, LandingPage as LandingPageLayout } from "views/layouts"

const Fairing = props => {
	const { layout, auth } = props

	const navigate = useNavigate()
	const location = useLocation()
	useEffect(() => {
		if (layout === "dashboard" && (!auth.isAuthenticated || String.isEmpty(auth.user?._id))) {
			const pathname = location.pathname
			navigate(`/auth/login?navigateTo=${pathname}`)
		} else if (layout === "landingpage" && location.pathname === "/") {
			navigate(`/page/home`)
		}
	}, [layout, auth])

	useEffect(() => {
		if (layout == "dashboard") {
			let windowTitle = location.pathname
				.replaceAll("".toUriWithLandingPagePrefix(), "")
				.replaceAll("".toUriWithDashboardPrefix(), "")
			document.title = app.title(windowTitle.humanize())
		}

		// console.log("windowTitle", windowTitle)
	}, [location, layout])

	if (layout == "dashboard") {
		return (
			<DashboardLayout sidebar_items={drawer_items}>
				<Outlet />
			</DashboardLayout>
		)
	} else {
		return (
			<LandingPageLayout>
				<Outlet />
			</LandingPageLayout>
		)
	}
}
const mapStateToProps = state => ({
	auth: state.auth,
	nav: state.nav,
})

export default withGlobals(connect(mapStateToProps, {})(Fairing))
