/** @format */

import { Drawer } from "@mui/material";

import { app } from "assets/jss/app-theme";

import classNames from "classnames";

import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import compose from "recompose/compose";
import Box from "@mui/material/Box";
import { Footer, Sidebar, Topbar } from "./components";
import { withTheme } from "@mui/styles";
import { width as drawerWidth } from "config/ui/drawer";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import ActionDialog from "components/ActionDialog";
import ComposeEmailDialog from "components/ComposeEmailDialog";
import { setDashboardSearchbarDisplayed } from "state/actions";

class Dashboard extends Component {
	constructor(props) {
		super(props);
		const { device } = this.props;
		const drawerType =
			window?.innerWidth > 768 ? "persistent" : "temporary";

		this.state = {
			drawerWidth: drawerWidth,
			drawerType: drawerType,
			drawerOpen: drawerType === "persistent",
		};
	}

	componentDidMount() {
		const { setDashboardSearchbarDisplayed } = this.props;
		//
		setDashboardSearchbarDisplayed(true);
	}

	handleClose = () => {
		this.setState({ drawerOpen: false, drawerWidth: 0 });
	};

	handleToggleOpen = () => {
		this.setState(prevState => ({
			drawerOpen: !prevState.drawerOpen,
			drawerWidth: !prevState.drawerOpen ? drawerWidth : 0,
		}));
	};

	render() {
		const {
			auth,
			nav,
			dashboard,
			children,
			sidebar_items,
			theme,
			indexUri,
			contexts,
		} = this.props;

		const breadcrumbs = nav.entries
		const { drawerOpen } = this.state
		const shiftTopbar = dashboard.drawer_displayed && drawerOpen && window?.innerWidth > 768
		const shiftContent = dashboard.drawer_displayed && drawerOpen && window?.innerWidth > 768

		return (
			<Box
				sx={{
					backgroundColor: theme => theme.palette.background.default,
					color: theme => theme.palette.text.primary,
				}}
				className={"p-0 relative min-h-screen"}
			>
				{dashboard.appbar_displayed && (
					<Topbar
						isSidebarOpen={drawerOpen}
						onToggleSidebar={this.handleToggleOpen}
						className="fixed left-0 right-0"
						sx={{
							zIndex: theme => (window?.innerWidth > 768 ? theme.zIndex.drawer + 1 : theme.zIndex.drawer - 1),
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
								backgroundColor: theme => theme.palette.primary.main,
								paddingTop: theme => (window?.innerWidth <= 768 ? theme.spacing(2) : theme.spacing(10)),
								borderWidth: 0,
								overflowX: "hidden",
							},
						}}
						onClose={this.handleClose}
						open={drawerOpen}
						variant={window?.innerWidth > 768 ? "persistent" : "temporary"}
					>
						<Sidebar
							open={drawerOpen}
							items={sidebar_items}
							onToggleSidebar={this.handleToggleOpen}
							onClickNavLink={item => {
								if (window?.innerWidth <= 768) {
									this.handleClose()
								}
							}}
						/>
					</Drawer>
				)}
				<Box
					component="main"
					sx={{
						width: window?.innerWidth > 768 && this.state.drawerOpen ? `calc(100% - ${drawerWidth}px)` : `100%`,
						left: window?.innerWidth > 768 && this.state.drawerOpen ? drawerWidth : "auto",
					}}
					className={"relative m-0 p-0"}
				>
					{/* <Box
						className={"p-0 h-80"}
						sx={{
							backgroundColor: theme =>
								theme.palette.primary?.main,
							// height: theme => theme.spacing(25),
						}}
					/> */}

					<GridContainer
						sx={{
							backgroundColor: theme => theme.palette.background.default,
							color: theme => theme.palette.text.primary,
						}}
						className={"absolute top-20 left-0 right-0"}
					>
						<GridItem xs={12}>{children}</GridItem>
					</GridContainer>
					<ActionDialog />
					<ComposeEmailDialog />
					{dashboard.footer_displayed && <Footer />}
				</Box>
			</Box>
		)
	}
}

Dashboard.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node,
	title: PropTypes.string,
	sidebar_items: PropTypes.array,
};
Dashboard.defaultProps = {
	title: "",
	sidebar_items: [],
};

const mapStateToProps = state => ({
	auth: state.auth,
	nav: state.nav,
	dashboard: state.dashboard,
	device: state.device,
});

export default compose(
	withTheme,
	connect(mapStateToProps, { setDashboardSearchbarDisplayed })
)(Dashboard);
