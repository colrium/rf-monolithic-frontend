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

import { Footer, Sidebar, Topbar } from "./components";
import { withTheme } from '@mui/styles';

import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import ActionDialog from "components/ActionDialog";
import ComposeEmailDialog from "components/ComposeEmailDialog";
import { setDashboardSearchbarDisplayed } from "state/actions";




class Dashboard extends Component {
	constructor(props) {
		super(props);
		const { device } = this.props;
		const drawerType = (device.identity.type === "browser" || device.identity.type === "smarttv") && device.window_size.width >= 960 ? "persistent" : "temporary";
		if (device.identity.type === "browser") {

		}

		this.state = {
			drawerType: drawerType,
			drawerOpen: drawerType !== "temporary"
		};
	}

	componentDidMount() {
		const { setDashboardSearchbarDisplayed } = this.props;
		//
		setDashboardSearchbarDisplayed(true);
	}

	handleClose = () => {
		this.setState({ drawerOpen: false });
	};

	handleToggleOpen = () => {
		this.setState(prevState => ({
			drawerOpen: !prevState.drawerOpen
		}));
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.device.window_size.width !== this.props.device.window_size.width) {
			if (this.props.device.window_size.width < 960 && this.state.drawerType === "persistent") {
				this.setState({ drawerType: "temporary" });
			}
			if (this.props.device.window_size.width >= 960 && this.state.drawerType === "temporary") {
				this.setState({ drawerType: "persistent" });
			}
		}
	}

	render() {
		const { auth, nav, dashboard, children, sidebar_items, theme, indexUri, contexts } = this.props;
		const title = nav.entries.length > 0 ? nav.entries[nav.entries.length - 1].title : "Dashboard";
		const breadcrumbs = nav.entries;
		const { drawerOpen } = this.state;
		const shiftTopbar = dashboard.drawer_displayed && drawerOpen && this.state.drawerType === "persistent";
		const shiftContent = dashboard.drawer_displayed && drawerOpen && this.state.drawerType === "persistent";

		document.title = app.title(title);
		return (
			<div className={"p-0 relative"}>
				{dashboard.appbar_displayed && <Topbar
					className={classNames(`fixed w-full top-0 left-0 right-0`)}
					isSidebarOpen={drawerOpen}
					onToggleSidebar={this.handleToggleOpen}
					title={title}
				/>}
				{dashboard.drawer_displayed && <Drawer
					anchor={dashboard.layout_direction == "rtl" ? "right" : "left"}
					onClose={this.handleClose}
					open={drawerOpen}
					variant={this.state.drawerType}
				>
					<Sidebar items={sidebar_items} onClickNavLink={(item) => {
						if (this.state.drawerType === "temporary") {
							this.handleClose();
						}
					}} />
				</Drawer>}
				<main className={classNames({ "relative": true })} >

					<GridContainer className={"p-0"}>
						<GridItem xs={12}>
							{children}
						</GridItem>
					</GridContainer>
					<ActionDialog />
					<ComposeEmailDialog />



					{dashboard.footer_displayed && <Footer />}
				</main>


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
