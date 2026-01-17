/** @format */

import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import Grid from "@mui/material/Grid"
import React, { useEffect } from "react"
import { connect } from "react-redux"
import { appendNavHistory } from "state/actions/ui/nav"
import { useSetState, useDidUpdate } from "hooks"
import { useLocation, useNavigate } from "react-router-dom"
import ContactSettingsWidget from "./Contact"
import GeneralSettingsWidget from "./General"
import LegalSettingsWidget from "./Legal"
import ReadingSettingsWidget from "./Reading"
import SocialSettingsWidget from "./Social"
import TrackingSettingsWidget from "./Tracking"
import CommunicationSettingsWidget from "./Communication"
import AuthSettingsWidget from "./Auth"

function TabPanel(props) {
	const { children, value, index, ...other } = props
	return (
		<Grid
			container
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`settings-tabpanel-${index}`}
			aria-labelledby={`settings-tab-${index}`}
			className={value === index ? "flex p-0" : "hidden"}
			{...other}
		>
			{value === index && (
				<Grid item xs={12} className="p-0">
					{children}
				</Grid>
			)}
		</Grid>
	)
}

const Page = props => {
	const { hash, pathname } = useLocation()
	const navigate = useNavigate()
	const [state, setState] = useSetState({
		active_tab: hash ? hash.replace("#", "").trim().toLowerCase() : "general",
		tabs: {
			general: "General",
			legal: "Legal",
			reading: "Reading",
			social: "Social",
			contact: "Contact",
			communication: "Communication",
			tracking: "Tracking",
			auth: "Authorization",
		},
	})
	const {
		device: { window_size },
	} = props
	let tabs_orientation = "horizontal"
	if (JSON.isJSON(window_size)) {
		tabs_orientation = window_size.width >= 960 ? "vertical" : "horizontal"
	}

	useEffect(() => {
		if (!String.isEmpty(hash)) {
			setState({ active_tab: hash.replace("#", "").trim().toLowerCase() })
		} else {
			setState({ active_tab: "general" })
		}
	}, [hash])

	const handleOnTabChange = (event, newValue) => {
		// setState({ active_tab: newValue })
		navigate(`${pathname}#${newValue}`)
	}

	return (
		<Grid container className="px-2 pt-8">
			<Grid item xs={12} md={tabs_orientation === "vertical" ? 3 : 12} lg={tabs_orientation === "vertical" ? 2 : 12}>
				<Tabs
					orientation={tabs_orientation}
					variant="scrollable"
					indicatorColor="primary"
					textColor="primary"
					value={state.active_tab}
					onChange={handleOnTabChange}
					aria-label="Settings tabs"
					className="border-0"
				>
					{Object.entries(state.tabs).map(([name, value], cursor) => (
						<Tab
							label={value}
							value={name}
							id={"settings-tab-" + name}
							aria-controls={"settings-tabpanel-" + name}
							key={"settings-tab-" + cursor}
						/>
					))}
				</Tabs>
			</Grid>

			<Grid item xs={12} md={tabs_orientation === "vertical" ? 9 : 12} lg={tabs_orientation === "vertical" ? 10 : 12}>
				{Object.entries(state.tabs).map(([name, value], cursor) => (
					<TabPanel value={state.active_tab} index={name} key={"settings-tabpanel-" + cursor}>
						{name === "general" && <GeneralSettingsWidget />}
						{name === "legal" && <LegalSettingsWidget />}
						{name === "social" && <SocialSettingsWidget />}
						{name === "reading" && <ReadingSettingsWidget />}
						{name === "contact" && <ContactSettingsWidget />}
						{name === "communication" && <CommunicationSettingsWidget />}
						{name === "tracking" && <TrackingSettingsWidget />}
						{name === "auth" && <AuthSettingsWidget />}
					</TabPanel>
				))}
			</Grid>
		</Grid>
	)
}

const mapStateToProps = state => ({
	auth: state.auth,
	nav: state.nav,
	device: state.device,
})

export default connect(mapStateToProps, { appendNavHistory })(Page)
