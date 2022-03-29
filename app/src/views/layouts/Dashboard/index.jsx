/** @format */
import React from "react"

import { Drawer } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import { app } from "assets/jss/app-theme"

import { useNetworkServices } from "contexts"
import { useSelector } from "react-redux"
import Box from "@mui/material/Box"
import { Footer, Sidebar, Topbar } from "./components"

import { width as drawerWidth } from "config/ui/drawer"
import GridContainer from "components/Grid/GridContainer"
import GridItem from "components/Grid/GridItem"
import ActionDialog from "components/ActionDialog"
import ComposeEmailDialog from "components/ComposeEmailDialog"
import { useSetState, useDidMount, useDidUpdate } from "hooks"
import { Outlet, useSearchParams } from "react-router-dom"

const Dashboard = props => {
	const { sidebar_items } = props
	const { SocketIO } = useNetworkServices()
	const nav = useSelector(state => state.nav)
	const dashboard = useSelector(state => state.dashboard)
	const auth = useSelector(state => state.auth)
	const breadcrumbs = [...nav.entries]

	const theme = useTheme()
	const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"))
	const [state, setState] = useSetState({
		drawerOpen: true,
	})
	const shiftTopbar = isLargeScreen
	const shiftContent = isLargeScreen

	return (
		<Box
			sx={{
				backgroundColor: theme.palette.background.default,
				color: theme.palette.text.primary,
			}}
			className={"p-0 relative min-h-screen"}
		>
			{dashboard.appbar_displayed && (
				<Topbar
					component="header"
					isSidebarOpen={state.drawerOpen}
					onToggleSidebar={() => setState(prevState => ({ drawerOpen: !prevState.drawerOpen }))}
					className="fixed left-0 right-0"
					sx={{
						zIndex: isLargeScreen ? theme.zIndex.drawer + 1 : theme.zIndex.drawer - 1,
					}}
				/>
			)}
			{dashboard.drawer_displayed && (
				<Drawer
					anchor={dashboard.layout_direction == "rtl" ? "right" : "left"}
					sx={{
						flexShrink: 0,
						[`& .MuiDrawer-paper`]: {
							width: drawerWidth,
							boxSizing: "border-box",
							backgroundColor: theme.palette.primary.main,
							paddingTop: isLargeScreen ? theme.spacing(10) : theme.spacing(2),
							borderWidth: 0,
							overflowX: "hidden",
						},
					}}
					onClose={() => setState({ drawerOpen: false })}
					open={state.drawerOpen}
					variant={isLargeScreen ? "persistent" : "temporary"}
				>
					<Sidebar
						open={state.drawerOpen}
						items={sidebar_items}
						onToggleSidebar={() =>
							setState(prevState => {
								drawerOpen: !prevState.drawerOpen
							})
						}
						onClickNavLink={item => {
							if (!isLargeScreen) {
								setState({ drawerOpen: false })
							}
						}}
					/>
				</Drawer>
			)}
			<Box
				component="main"
				sx={{
					width: isLargeScreen && state.drawerOpen ? `calc(100% - ${drawerWidth}px)` : `100%`,
					left: isLargeScreen && state.drawerOpen ? drawerWidth : "auto",
				}}
				className={"relative m-0 p-0"}
			>
				{/* <Box
						className={"p-0 h-80"}
						sx={{
							backgroundColor: theme =>
								theme.palette.primary?.main,
							// height: theme.spacing(25),
						}}
					/> */}

				<GridContainer
					sx={{
						backgroundColor: theme.palette.background.default,
						color: theme.palette.text.primary,
					}}
					className={"absolute top-20 left-0 right-0"}
				>
					<GridItem xs={12}>
						<Outlet />
					</GridItem>
				</GridContainer>
				<ActionDialog />
				<ComposeEmailDialog />
			</Box>
			<Footer />
		</Box>
	)
}

Dashboard.defaultProps = {
	title: "",
	sidebar_items: [],
}

export default Dashboard
