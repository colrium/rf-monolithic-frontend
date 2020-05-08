/** @format */

import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { appendNavHistory } from "state/actions/ui/nav";
import withRoot from "hoc/withRoot";
import DefaultPreferences from "views/widgets/Preferences/Default";
import DashboardPreferences from "views/widgets/Preferences/Dashboard";
import PasswordPreferences from "views/widgets/Preferences/Password";
import {withErrorHandler} from "hoc/ErrorHandler";

function TabPanel(props) {
	let [state, setState] = useState(props);
	useEffect(() => {
		setState(props);
	}, [props]);
	const { children, value, index, ...other } = state;
	return (
		<GridContainer
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`preferences-tabpanel-${index}`}
			aria-labelledby={`preferences-tab-${index}`}
			className={value === index ? "flex p-0" : "hidden"}
			{...other}
		>
			{value === index && (
				<GridItem xs={12} className="p-0">
					{children}
				</GridItem>
			)}
		</GridContainer>
	);
}

class Page extends React.Component {
	state = {
		active_tab: "default",
		tabs: {
			default: "Default",
			dashboard: "Dashboard",
			password: "Password",
			notifications: "Notifications",
		},
	};

	constructor(props) {
		super(props);
		const { nav } = this.props;
		for (var i = 0; i < nav.entries.length; i++) {
			if (nav.entries[i].name === "preferences") {
				this.state.active_tab = nav.entries[i].view
					? nav.entries[i].view
					: "default";
			}
		}
		this.handleOnTabChange = this.handleOnTabChange.bind(this);
	}

	componentDidMount() {
		const { location, appendNavHistory } = this.props;
		if (appendNavHistory && location) {
			appendNavHistory({
				name: "preferences",
				uri: location.pathname,
				title: "Preferences",
				view: this.state.active_tab,
			});
		}
	}

	handleOnTabChange(event, newValue) {
		this.setState({ active_tab: newValue });
		const { location, appendNavHistory } = this.props;
		if (appendNavHistory && location) {
			appendNavHistory({
				name: "preferences",
				uri: location.pathname,
				title: "Preferences",
				view: newValue,
			});
		}
	}

	render() {
		const {
			device: { window_size },
		} = this.props;
		let tabs_orientation = "horizontal";
		if (JSON.isJSON(window_size)) {
			tabs_orientation =
				window_size.width >= 960 ? "vertical" : "horizontal";
		}
		return (
			<GridContainer className="px-2 pt-8">
				<GridItem
					xs={12}
					md={tabs_orientation === "vertical" ? 3 : 12}
					lg={tabs_orientation === "vertical" ? 2 : 12}
				>
					<Tabs
						orientation={tabs_orientation}
						variant="scrollable"
						indicatorColor="primary"
						textColor="primary"
						value={this.state.active_tab}
						onChange={this.handleOnTabChange}
						aria-label="Preferences tabs"
						className="border-0"
					>
						{Object.entries(this.state.tabs).map(
							([name, value], cursor) => (
								<Tab
									label={value}
									value={name}
									id={"preferences-tab-" + name}
									aria-controls={
										"preferences-tabpanel-" + name
									}
									key={"preferences-tab-" + cursor}
								/>
							)
						)}
					</Tabs>
				</GridItem>

				<GridItem
					xs={12}
					md={tabs_orientation === "vertical" ? 9 : 12}
					lg={tabs_orientation === "vertical" ? 10 : 12}
				>
					{Object.entries(this.state.tabs).map(
						([name, value], cursor) => (
							<TabPanel
								value={this.state.active_tab}
								index={name}
								key={"preferences-tabpanel-" + cursor}
							>
								{name === "default" && <DefaultPreferences />}
								{name === "dashboard" && <DashboardPreferences />}
								{name === "password" && <PasswordPreferences />}
								
							</TabPanel>
						)
					)}
				</GridItem>
			</GridContainer>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	nav: state.nav,
	device: state.device,
});

export default connect(mapStateToProps, { appendNavHistory })(withErrorHandler(Page));
