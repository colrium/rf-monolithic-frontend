/** @format */

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React, { useCallback, useEffect } from "react"
import { connect } from "react-redux";
import { appendNavHistory } from "state/actions"
import DefaultPreferences from "./Default"
import PasswordPreferences from "./Password"
import DataPreferences from "./Data"
import NotificationsPreferences from "./Notifications";
import SubscriptionsPreferences from "./Subscriptions"
import CookiesPreferences from "./Cookies"
import {useWindowSize} from 'react-use';
import {  useSetState } from "hooks"
import { useLocation } from "react-router-dom";

function TabPanel(props) {
	const { children, value, index, ...other } = props;
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

const Page = (props) => {
	const { appendNavHistory, navHistory } = props
	const location = useLocation()
	const {width} = useWindowSize();
	const tabs_orientation = width >= 960 ? "vertical" : "horizontal"
	const [state, setState] = useSetState({
		active_tab: "default",
		tabs: {
			default: "Default",
			password: "Password",
			notifications: "Notifications",
			data: "Data",
			cookies: "Cookies",
			subscriptions: "Subscriptions",
		},
	})

	const handleOnTabChange = useCallback((event, newValue) => {
		setState({ active_tab: newValue })

		if (appendNavHistory && location) {
			appendNavHistory({
				name: "preferences",
				uri: location.pathname,
				title: "Preferences",
				view: newValue,
			})
		}
	}, [])



	useEffect(() =>{
		console.log("navHistory", navHistory)
		if (appendNavHistory && location) {
			appendNavHistory({
				name: "preferences",
				uri: location.pathname,
				title: "Preferences",
				view: state.active_tab,
			})
		}
	}, [])



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
					value={state.active_tab}
					onChange={handleOnTabChange}
					aria-label="Preferences tabs"
					className="border-0"
				>
					{Object.entries(state.tabs).map(
						([name, value], cursor) => (
							<Tab
								label={value}
								value={name}
								id={"preferences-tab-" + name}
								aria-controls={"preferences-tabpanel-" + name}
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
				{Object.entries(state.tabs).map(
					([name, value], cursor) => (
						<TabPanel
							value={state.active_tab}
							index={name}
							key={"preferences-tabpanel-" + cursor}
						>
							{name === "default" && <DefaultPreferences />}
							{name === "password" && <PasswordPreferences />}
							{name === "data" && <DataPreferences />}
							{name === "notifications" && (
								<NotificationsPreferences />
							)}
							{name === "subscriptions" && (
								<SubscriptionsPreferences />
							)}
							{name === "cookies" && <CookiesPreferences />}
						</TabPanel>
					)
				)}
			</GridItem>
		</GridContainer>
	)
}

const mapStateToProps = state => ({
	auth: state.auth,
	navHistory: state.nav,
})

export default connect(mapStateToProps, { appendNavHistory })(
	Page
)
