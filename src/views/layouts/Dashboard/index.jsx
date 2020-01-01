// Material helpers
import { Drawer, withStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { app } from "assets/jss/app-theme";
// Externals
import classNames from "classnames";
import ActionDialog from "components/ActionDialog";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { isMobile } from "react-device-detect";
import { connect } from "react-redux";
import compose from "recompose/compose";
import withRoot from "utils/withRoot";
// Custom components
import { Footer, Sidebar, Topbar } from "./components";
// Component styles
import styles from "./styles";

class Dashboard extends Component {
	constructor(props) {
		super(props);
		const {device} = this.props;
		const drawerType = (device.identity.type === "browser" || device.identity.type === "smarttv") && device.window_size.width >= 1280? "persistent" : "temporary";
		if (device.identity.type === "browser") {

		}
		
		this.state = {
			drawerType: drawerType,
			isOpen: drawerType !== "temporary"
		};
	}

	componentDidMount() {
		/*const {device} = this.props;
		console.log("device", device);*/	    
	}

	handleClose = () => {
		this.setState({ isOpen: false });
	};

	handleToggleOpen = () => {
		this.setState(prevState => ({
			isOpen: !prevState.isOpen
		}));
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.device.window_size.width !== this.props.device.window_size.width) {
            if (this.props.device.window_size.width < 1280 && this.state.drawerType==="persistent") {
            	this.setState({ drawerType: "temporary" });
            }
            if (this.props.device.window_size.width >= 1280 && this.state.drawerType==="temporary") {
            	this.setState({ drawerType: "persistent" });
            }
        }
    }

	render() {
		const { classes, auth, nav, dashboard, children, sidebar_items } = this.props;
		const title = nav.entries.length > 0 ? nav.entries[nav.entries.length - 1].title : "Dashboard";

		const { isOpen } = this.state;
		const shiftTopbar = dashboard.drawer_displayed && isOpen && this.state.drawerType === "persistent";
		const shiftContent = dashboard.drawer_displayed && isOpen && this.state.drawerType === "persistent";

		document.title = app.title(title);
		return (
			<Box>
				{ dashboard.appbar_displayed && <Topbar
					className={classNames(classes.topbar, {
						[classes.topbarShift]: shiftTopbar
					})}
					isSidebarOpen={isOpen}
					onToggleSidebar={this.handleToggleOpen}
					title={title}
				/> }
				{ dashboard.drawer_displayed && <Drawer
					anchor={dashboard.layout_direction=="rtl"? "right" : "left"}
					classes={{ paper: classes.drawerPaper }}
					onClose={this.handleClose}
					open={isOpen}
					variant={this.state.drawerType}
				> 
					<Sidebar className={classes.sidebar} items={sidebar_items} />
				</Drawer> }
				<main className={classNames({[classes.content] : true, [classes.contentShift]: shiftContent, "relative":true })} >
					<ActionDialog />
					{children}

					{ dashboard.footer_displayed && <Footer /> }
				</main>

				
			</Box>
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

export default withRoot(
	compose(
		withStyles(styles),
		connect(
			mapStateToProps,
			{}
		)
	)(Dashboard)
);
