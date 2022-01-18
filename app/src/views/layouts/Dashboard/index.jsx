// Material helpers
/** @format */

// Material helpers
import { Drawer } from "@mui/material";

import { app } from "assets/jss/app-theme";
// Externals
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
		const title =
			nav.entries.length > 0
				? nav.entries[nav.entries.length - 1].title
				: "Dashboard";
		const breadcrumbs = nav.entries;
		const { drawerOpen } = this.state;
		const shiftTopbar =
			dashboard.drawer_displayed &&
			drawerOpen &&
			window?.innerWidth > 768;
		const shiftContent =
			dashboard.drawer_displayed &&
			drawerOpen &&
			window?.innerWidth > 768;

		document.title = app.title(title);
		return (
			<div className={"p-0 relative"}>
				{dashboard.appbar_displayed && (
					<Topbar
						className={classNames(
							`fixed w-full top-0 left-0 right-0`
						)}
						isSidebarOpen={drawerOpen}
						onToggleSidebar={this.handleToggleOpen}
						sx={{
							zIndex: theme =>
								window?.innerWidth > 768
									? theme.zIndex.drawer + 1
									: theme.zIndex.drawer - 1,
						}}
						title={title}
					/>
				)}
				{dashboard.drawer_displayed && (
					<Drawer
						anchor={
							dashboard.layout_direction == "rtl"
								? "right"
								: "left"
						}
						sx={{
							flexShrink: 0,
							[`& .MuiDrawer-paper`]: {
								width: drawerWidth,
								boxSizing: "border-box",
								backgroundColor: theme =>
									theme.palette.primary.main,
								paddingTop: theme =>
									window?.innerWidth <= 768
										? theme.spacing(2)
										: theme.spacing(10),

								overflowX: "hidden",
							},
						}}
						onClose={this.handleClose}
						open={drawerOpen}
						variant={
							window?.innerWidth > 768
								? "persistent"
								: "temporary"
						}>
						<Sidebar
							items={sidebar_items}
							onClickNavLink={item => {
								if (window?.innerWidth <= 768) {
									this.handleClose();
								}
							}}
						/>
					</Drawer>
				)}
				<Box
					component="main"
					sx={{
						width:
							window?.innerWidth > 768 && this.state.drawerOpen
								? `calc(100% - ${drawerWidth}px)`
								: `100%`,
						left:
							window?.innerWidth > 768 && this.state.drawerOpen
								? drawerWidth
								: "auto",
						top: theme => theme.spacing(3),
						// ml: { md: `${this.state.drawerWidth}px` },
					}}
					className={"relative mt-20"}>
					<GridContainer className={"p-0"}>
						<GridItem xs={12}>{children}</GridItem>
					</GridContainer>
					<ActionDialog />
					<ComposeEmailDialog />
					{dashboard.footer_displayed && <Footer />}
				</Box>
			</div>
		);
	}
}

Dashboard.propTypes = {

	className: PropTypes.string,
	children: PropTypes.node,
	title: PropTypes.string,
	sidebar_items: PropTypes.array
};
Dashboard.defaultProps = {
	title: "",
	sidebar_items: []
};

const mapStateToProps = state => ({
	auth: state.auth,
	nav: state.nav,
	dashboard: state.dashboard,
	device: state.device
});

export default compose(

	withTheme,
	connect(
		mapStateToProps,
		{ setDashboardSearchbarDisplayed }
	)
)(Dashboard);
