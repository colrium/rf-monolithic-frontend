/** @format */

import React, { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useTheme } from "@mui/material/styles"
import { items as drawer_items } from "config/ui/drawer"
import { environment } from "config"
import { Outlet } from "react-router-dom"
import { app } from "assets/jss/app-theme"
import Box from "@mui/material/Box"
import { useNetworkServices } from "contexts/NetworkServices"
import { googleClientId } from "config"
import GoogleLogin from "react-google-login"
import { useDidMount, useGoogleOneTapLogin } from "hooks"
import { Dashboard as DashboardLayout, LandingPage as LandingPageLayout } from "views/layouts"
import CookiesConsentDialog from "views/widgets/CookiesConsentDialog"

const Fairing = props => {
	const { layout } = props
	const auth = useSelector(state => state.auth)
	const navigate = useNavigate()
	const location = useLocation()
	const { Api } = useNetworkServices()
	const theme = useTheme()
	const googleOneTapLogin = useGoogleOneTapLogin({
		onError: error => console.error(error),
		onSuccess: response => {},
		disabled: auth.isAuthenticated || environment === 'development',
		googleAccountConfigs: {
			client_id: googleClientId,
			callback: data => {
				Api.proceedWithGoogleOneTap({ ...data })
			},
		},
	})
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
	}, [location, layout])



	return (
		<Box sx={{ color: theme => theme.palette.text.primary, backgroundColor: theme => theme.palette.background.default }} component="div">
			{layout === "dashboard" ? (
				<DashboardLayout sidebar_items={drawer_items}>
					<Outlet />
				</DashboardLayout>
			) : (
				<LandingPageLayout>
					<Outlet />
				</LandingPageLayout>
			)}
			<CookiesConsentDialog />
		</Box>
	)
}

export default React.memo(Fairing, (prevProps, nextProps) => prevProps.layout === nextProps.layout)
