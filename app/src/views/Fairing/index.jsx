/** @format */

import React, { useEffect } from "react"
import { Route, useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { items as drawer_items } from "config/ui/drawer"
import { Outlet, useSearchParams } from "react-router-dom"
import { app } from "assets/jss/app-theme"

import { Dashboard as DashboardLayout, LandingPage as LandingPageLayout } from "views/layouts"

const Fairing = props => {
	const { layout } = props
	const auth = useSelector(state => state.auth)
	const navigate = useNavigate()
	const location = useLocation()
	// if (layout === "dashboard" && (!auth.isAuthenticated || String.isEmpty(auth.user?._id))) {
	// 	const pathname = location.pathname
	// 	navigate(`/auth/login?navigateTo=${pathname}`)
	// }
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
		return <DashboardLayout sidebar_items={drawer_items} />
	} else {
		return (
			<LandingPageLayout>
				<Outlet />
			</LandingPageLayout>
		)
	}
}

export default React.memo(Fairing)
