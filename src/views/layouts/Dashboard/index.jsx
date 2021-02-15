// Material helpers
/** @format */

// Material helpers
import { Drawer, withStyles, Breadcrumbs } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { app } from "assets/jss/app-theme";
// Externals
import classNames from "classnames";

import PropTypes from "prop-types";
import React, { Component } from "react";
import { isMobile } from "react-device-detect";
import Typography from "components/Typography";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { Link } from "react-router-dom";
import {withErrorHandler} from "hoc/ErrorHandler";
import { Footer, Sidebar, Topbar } from "./components";
import IconButton from '@material-ui/core/IconButton';
import Icon from '@mdi/react'
import { mdiForwardburger } from '@mdi/js';
import { withTheme } from '@material-ui/core/styles';
import styles from "./styles";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DashboardRoutes from "routes/Dashboard";
import ActionDialog from "components/ActionDialog";
import ComposeEmailDialog from "components/ComposeEmailDialog";
import { setDashboardSearchbarDisplayed } from "state/actions";




class Dashboard extends Component {
	constructor(props) {
		super(props);
		const {device} = this.props;
		const drawerType = (device.identity.type === "browser" || device.identity.type === "smarttv") && device.window_size.width >= 960? "persistent" : "temporary";
		if (device.identity.type === "browser") {

		}
		
		this.state = {
			drawerType: drawerType,
			drawerOpen: drawerType !== "temporary"
		};
	}

	componentDidMount() {
		const { setDashboardSearchbarDisplayed } = this.props;	
		//console.log("type of setDashboardSearchbarDisplayed", typeof setDashboardSearchbarDisplayed)
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
            if (this.props.device.window_size.width < 960 && this.state.drawerType==="persistent") {
            	this.setState({ drawerType: "temporary" });
            }
            if (this.props.device.window_size.width >= 960 && this.state.drawerType==="temporary") {
            	this.setState({ drawerType: "persistent" });
            }
        }
    }

	render() {
		const { classes, auth, nav, dashboard, children, sidebar_items, theme, indexUri, contexts } = this.props;
		const title = nav.entries.length > 0 ? nav.entries[nav.entries.length - 1].title : "Dashboard";
		const breadcrumbs = nav.entries;
		const { drawerOpen } = this.state;
		const shiftTopbar = dashboard.drawer_displayed && drawerOpen && this.state.drawerType === "persistent";
		const shiftContent = dashboard.drawer_displayed && drawerOpen && this.state.drawerType === "persistent";

		document.title = app.title(title);
		return (
			<div className={"p-0 relative"}>
				{ dashboard.appbar_displayed && <Topbar
					className={classNames(classes.topbar, {
						[classes.topbarShift]: false
					})}
					isSidebarOpen={drawerOpen}
					onToggleSidebar={this.handleToggleOpen}
					title={title}
				/> }
				{ dashboard.drawer_displayed && <Drawer
					anchor={dashboard.layout_direction=="rtl"? "right" : "left"}
					classes={{ paper: classes.drawerPaper }}
					onClose={this.handleClose}
					open={drawerOpen}
					variant={this.state.drawerType}
				> 
					<Sidebar className={classes.sidebar} items={sidebar_items} onClickNavLink={(item)=>{
						if (this.state.drawerType==="temporary") {
							this.handleClose();
						}						
					}}/>
				</Drawer> }
				<main className={classNames({[classes.content] : true, [classes.contentShift]: shiftContent, "relative":true })} >
				
					{/*<GridContainer>
						<GridItem xs={10}>
							<GridContainer>
								<GridItem xs={12} className={"p-0 px-1 m-0 pt-2 flex flex-row items-center"}>
									{dashboard.drawer_displayed && <IconButton 
										aria-label="Drawer Menu" 
										className={classNames({[classes.drawerBtn] : true, "mr-2":true })}
										onClick={this.handleToggleOpen}
									>
										<Icon 
											path={mdiForwardburger}
											title="Toggle Drawer Menu"
											rotate={this.state.drawerOpen? 180 : 0}	    
											size={0.9}
										/>
							        </IconButton>}
									<Typography className={classes.pageTitle} variant="h3" color="textSecondary">{title}</Typography>
								</GridItem>
								<GridItem xs={12} className={"p-0 px-2 m-0"}>
									<Breadcrumbs
										maxItems={6}
										aria-label="breadcrumb"
										separator={<div className={classes.breadcrumbSeparator} />}
										className={classes.breadcrumbs}
									>
										{breadcrumbs.map(
											(breadcrumb, index) =>
												(index < breadcrumbs.length - 1 && String.isString(breadcrumb.uri)) && (
													<Link
														className={classes.breadcrumb}
														to={breadcrumb.uri}
														key={"breadcrumb-" + index}
													>
														<Typography
															className={classes.title}
															variant="body2"
															color="inherit"
														>
															{" "}
															{breadcrumb.title}
														</Typography>
													</Link>
												)
										)}
										<Typography variant="body2" color="primary">
											{title}
										</Typography>
									</Breadcrumbs>
								</GridItem>
							</GridContainer>
						</GridItem>
						<GridItem xs={2}>
							
						</GridItem>
					</GridContainer>*/}
					<GridContainer className={"p-0"}>
						<GridItem xs={12}>
							{children}
						</GridItem>
					</GridContainer>
					<ActionDialog />
					<ComposeEmailDialog />
					
					

					{dashboard.footer_displayed && <Footer /> }
				</main>

				
			</div>
		);
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired,
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
		withStyles(styles),
		withTheme,
		connect(
			mapStateToProps,
			{setDashboardSearchbarDisplayed}
		),
		withErrorHandler
	)(Dashboard);
