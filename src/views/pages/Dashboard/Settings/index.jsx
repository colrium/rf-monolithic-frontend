/** @format */

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { appendNavHistory } from "state/actions/ui/nav";


import ContactSettingsWidget from "./Contact"
import GeneralSettingsWidget from "./General"
import LegalSettingsWidget from "./Legal"
import ReadingSettingsWidget from "./Reading"
import SocialSettingsWidget from "./Social"
import TrackingSettingsWidget from "views/widgets/Settings/Tracking"
import MobileSettingsWidget from "views/widgets/Settings/Mobile"
import MailSettingsWidget from "views/widgets/Settings/Mail"
import AuthSettingsWidget from "./Auth"

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
			id={`settings-tabpanel-${index}`}
			aria-labelledby={`settings-tab-${index}`}
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
		active_tab: "general",
		tabs: {
			general: "General",
			legal: "Legal",
			reading: "Reading",
			social: "Social",
			contact: "Contact",
			mail: "Mail",
			tracking: "Tracking",
			mobile: "Mobile App",
			auth: "Authorization",
		},
	};

	constructor(props) {
		super(props);
		const { nav } = this.props;
		for (var i = 0; i < nav.entries.length; i++) {
			if (nav.entries[i].name === "settings") {
				this.state.active_tab = nav.entries[i].view
					? nav.entries[i].view
					: "general";
			}
		}
		this.handleOnTabChange = this.handleOnTabChange.bind(this);
	}

	componentDidMount() {
		const { location, appendNavHistory } = this.props;
		if (appendNavHistory && location) {
			appendNavHistory({
				name: "settings",
				uri: location.pathname,
				title: "Settings",
				view: this.state.active_tab,
			});
		}
	}

	handleOnTabChange(event, newValue) {
		this.setState({ active_tab: newValue });
		const { location, appendNavHistory } = this.props;
		if (appendNavHistory && location) {
			appendNavHistory({
				name: "settings",
				uri: location.pathname,
				title: "Settings",
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
						aria-label="Settings tabs"
						className="border-0"
					>
						{Object.entries(this.state.tabs).map(
							([name, value], cursor) => (
								<Tab
									label={value}
									value={name}
									id={"settings-tab-" + name}
									aria-controls={"settings-tabpanel-" + name}
									key={"settings-tab-" + cursor}
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
								key={"settings-tabpanel-" + cursor}
							>
								{name === "general" && (
									<GeneralSettingsWidget />
								)}
								{name === "legal" && <LegalSettingsWidget />}
								{name === "social" && <SocialSettingsWidget />}
								{name === "reading" && (
									<ReadingSettingsWidget />
								)}
								{name === "contact" && (
									<ContactSettingsWidget />
								)}
								{name === "mail" && (
									<MailSettingsWidget />
								)}
								{name === "tracking" && (
									<TrackingSettingsWidget />
								)}
								{name === "mobile" && (
									<MobileSettingsWidget />
								)}
								{name === "auth" && (
									<AuthSettingsWidget />
								)}
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

export default (connect(mapStateToProps, { appendNavHistory })(Page));
