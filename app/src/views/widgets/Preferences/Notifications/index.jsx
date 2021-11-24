/** @format */
import React, { useState } from "react";
import { connect } from "react-redux";
import Typography from "@mui/material/Typography";
import { CheckboxInput } from "components/FormInputs";
import GridContainer from "components/Grid/GridContainer";
import Card from "components/Card";
import GridItem from "components/Grid/GridItem";
import { useGlobals } from "contexts/Globals";
import { useTheme } from '@mui/material/styles';



function Widget(props) {

	const { app } = props;
	const { updatePreferences } = useGlobals();
	const theme = useTheme();
	let [alerts, setAlerts] = useState({});
	let [errors, setErrors] = useState({});
	let [loading, setLoading] = useState({});
	let preferences = app.preferences.notifications;


	const handleOnChange = (section, name = false) => async value => {
		let new_value = section && name ? { ...preferences, [section]: { ...preferences[section], [name]: value } } : { ...preferences, [section]: value };

		updatePreferences("notifications", new_value).then(updated_prefs => {
			setAlerts(section && name ? { [section]: { [name]: name + " saved" } } : { [section]: section + " saved" });
			setErrors(section && name ? { [section]: { [name]: undefined } } : { [section]: undefined });
		}).catch(e => {
			setAlerts(section && name ? { [section]: { [name]: undefined } } : { [section]: undefined });
			setErrors(section && name ? { [section]: { [name]: e.msg } } : { [section]: e.msg });
		});
	};


	return (
		<Card>
			<GridContainer className="px-8">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h3">Notifications</Typography>
				</GridItem>

				<GridContainer className="px-0">
					<GridItem xs={12} className="mb-1">
						<Typography variant="h5" color="accent">All</Typography>
					</GridItem>
					<GridItem xs={12} md={4} className="mb-1">
						<CheckboxInput
							name="all-push"
							label="Push"
							defaultValue={preferences.all.push}
							onChange={handleOnChange("all", "push")}
							helperText={JSON.isJSON(alerts.all) ? alerts.all.push : undefined}
							disabled={JSON.isJSON(loading.all) ? loading.all.push : undefined}
							error={JSON.isJSON(errors.all) ? errors.all.push : undefined}
						/>
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<CheckboxInput
							name="all-sms"
							label="SMS"
							defaultValue={preferences.all.sms}
							onChange={handleOnChange("all", "sms")}
							helperText={JSON.isJSON(alerts.all) ? alerts.all.sms : undefined}
							disabled={JSON.isJSON(loading.all) ? loading.all.sms : undefined}
							error={JSON.isJSON(errors.all) ? errors.all.sms : undefined}
						/>
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<CheckboxInput
							name="all-email"
							label="Email"
							defaultValue={preferences.all.email}
							onChange={handleOnChange("all", "email")}
							helperText={JSON.isJSON(alerts.all) ? alerts.all.email : undefined}
							disabled={JSON.isJSON(loading.all) ? loading.all.email : undefined}
							error={JSON.isJSON(errors.all) ? errors.all.email : undefined}
						/>
					</GridItem>

				</GridContainer>

				<GridContainer className="px-0">
					<GridItem xs={12} className="mb-1">
						<Typography variant="h5" color="accent">Activity</Typography>
					</GridItem>
					<GridItem xs={12} md={4} className="mb-1">
						<CheckboxInput
							name="activity-push"
							label="Push"
							defaultValue={preferences.activity.push || preferences.all.push}
							onChange={handleOnChange("activity", "push")}
							helperText={JSON.isJSON(alerts.activity) ? alerts.activity.push : undefined}
							disabled={JSON.isJSON(loading.activity) ? loading.activity.push : preferences.all.push}
							error={JSON.isJSON(errors.activity) ? errors.activity.push : undefined}
						/>
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<CheckboxInput
							name="activity-sms"
							label="SMS"
							defaultValue={preferences.activity.sms || preferences.all.sms}
							onChange={handleOnChange("activity", "sms")}
							helperText={JSON.isJSON(alerts.activity) ? alerts.activity.sms : undefined}
							disabled={JSON.isJSON(loading.activity) ? loading.activity.sms : preferences.all.sms}
							error={JSON.isJSON(errors.activity) ? errors.activity.sms : undefined}
						/>
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<CheckboxInput
							name="activity-email"
							label="Email"
							defaultValue={preferences.activity.email || preferences.all.email}
							onChange={handleOnChange("activity", "email")}
							helperText={JSON.isJSON(alerts.activity) ? alerts.activity.email : undefined}
							disabled={JSON.isJSON(loading.activity) ? loading.activity.email : preferences.all.email}
							error={JSON.isJSON(errors.activity) ? errors.activity.email : undefined}
						/>
					</GridItem>

				</GridContainer>

				<GridContainer className="px-0">
					<GridItem xs={12} className="mb-1">
						<Typography variant="h5" color="accent">Subscriptions</Typography>
					</GridItem>
					<GridItem xs={12} md={4} className="mb-1">
						<CheckboxInput
							name="subscriptions-push"
							label="Push"
							defaultValue={preferences.subscriptions.push || preferences.all.push}
							onChange={handleOnChange("subscriptions", "push")}
							helperText={JSON.isJSON(alerts.subscriptions) ? alerts.subscriptions.push : undefined}
							disabled={JSON.isJSON(loading.subscriptions) ? loading.subscriptions.push : preferences.all.push}
							error={JSON.isJSON(errors.subscriptions) ? errors.subscriptions.push : undefined}
						/>
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<CheckboxInput
							name="subscriptions-sms"
							label="SMS"
							defaultValue={preferences.subscriptions.sms || preferences.all.sms}
							onChange={handleOnChange("subscriptions", "sms")}
							helperText={JSON.isJSON(alerts.subscriptions) ? alerts.subscriptions.sms : undefined}
							disabled={JSON.isJSON(loading.subscriptions) ? loading.subscriptions.sms : preferences.all.sms}
							error={JSON.isJSON(errors.subscriptions) ? errors.subscriptions.sms : undefined}
						/>
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<CheckboxInput
							name="subscriptions-email"
							label="Email"
							defaultValue={preferences.subscriptions.email || preferences.all.email}
							onChange={handleOnChange("subscriptions", "email")}
							helperText={JSON.isJSON(alerts.subscriptions) ? alerts.subscriptions.email : undefined}
							disabled={JSON.isJSON(loading.subscriptions) ? loading.subscriptions.email : preferences.all.email}
							error={JSON.isJSON(errors.subscriptions) ? errors.subscriptions.email : undefined}
						/>
					</GridItem>

				</GridContainer>

				<GridContainer className="px-0">
					<GridItem xs={12} className="mb-1">
						<Typography variant="h5" color="accent">New Feature Releases</Typography>
					</GridItem>
					<GridItem xs={12} md={4} className="mb-1">
						<CheckboxInput
							name="features-push"
							label="Push"
							defaultValue={preferences.features.push || preferences.all.push}
							onChange={handleOnChange("features", "push")}
							helperText={JSON.isJSON(alerts.features) ? alerts.features.push : undefined}
							disabled={JSON.isJSON(loading.features) ? loading.features.push : preferences.all.push}
							error={JSON.isJSON(errors.features) ? errors.features.push : undefined}
						/>
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<CheckboxInput
							name="features-sms"
							label="SMS"
							defaultValue={preferences.features.sms || preferences.all.sms}
							onChange={handleOnChange("features", "sms")}
							helperText={JSON.isJSON(alerts.features) ? alerts.features.sms : undefined}
							disabled={JSON.isJSON(loading.features) ? loading.features.sms : preferences.all.sms}
							error={JSON.isJSON(errors.features) ? errors.features.sms : undefined}
						/>
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<CheckboxInput
							name="features-email"
							label="Email"
							defaultValue={preferences.features.email || preferences.all.email}
							onChange={handleOnChange("features", "email")}
							helperText={JSON.isJSON(alerts.features) ? alerts.features.email : undefined}
							disabled={JSON.isJSON(loading.features) ? loading.features.email : preferences.all.email}
							error={JSON.isJSON(errors.features) ? errors.features.email : undefined}
						/>
					</GridItem>

				</GridContainer>


				<GridContainer className="px-0">
					<GridItem xs={12} className="mb-1">
						<Typography variant="h5" color="accent">Financial</Typography>
					</GridItem>
					<GridItem xs={12} md={4} className="mb-1">
						<CheckboxInput
							name="financial-push"
							label="Push"
							defaultValue={preferences.financial.push || preferences.all.push}
							onChange={handleOnChange("financial", "push")}
							helperText={JSON.isJSON(alerts.financial) ? alerts.financial.push : undefined}
							disabled={JSON.isJSON(loading.financial) ? loading.financial.push : preferences.all.push}
							error={JSON.isJSON(errors.financial) ? errors.financial.push : undefined}
						/>
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<CheckboxInput
							name="financial-sms"
							label="SMS"
							defaultValue={preferences.financial.sms || preferences.all.sms}
							onChange={handleOnChange("financial", "sms")}
							helperText={JSON.isJSON(alerts.financial) ? alerts.financial.sms : undefined}
							disabled={JSON.isJSON(loading.financial) ? loading.financial.sms : preferences.all.sms}
							error={JSON.isJSON(errors.financial) ? errors.financial.sms : undefined}
						/>
					</GridItem>

					<GridItem xs={12} md={4} className="mb-1">
						<CheckboxInput
							name="financial-email"
							label="Email"
							defaultValue={preferences.financial.email || preferences.all.email}
							onChange={handleOnChange("financial", "email")}
							helperText={JSON.isJSON(alerts.financial) ? alerts.financial.email : undefined}
							disabled={JSON.isJSON(loading.financial) ? loading.financial.email : preferences.all.email}
							error={JSON.isJSON(errors.financial) ? errors.financial.email : undefined}
						/>
					</GridItem>

				</GridContainer>

			</GridContainer>
		</Card>
	);
}
const mapStateToProps = state => ({
	auth: state.auth,
	app: state.app,
});

export default (connect(mapStateToProps, {})(React.memo(Widget)));
