/** @format */
import React, { useState } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { CheckboxInput } from "components/FormInputs";
import GridContainer from "components/Grid/GridContainer";
import Card from "components/Card";
import GridItem from "components/Grid/GridItem";
import { useGlobals } from "contexts/Globals";
import { useTheme } from '@material-ui/core/styles';
import { withErrorHandler } from "hoc/ErrorHandler";


function Widget(props) {	

	const { app } = props;

	const { updatePreferences } = useGlobals();
	const theme = useTheme();

	let [alerts, setAlerts] = useState({});
	let [errors, setErrors] = useState({});
	let [loading, setLoading] = useState({});

	

	let preferences = app.preferences.cookies;
	

	const handleOnChange = (section, name=false) => async value => {
		let new_value = section && name? {...preferences, [section]: { ...preferences[section],  [name]: value }} : {...preferences, [section]: value };
		

		updatePreferences("cookies", new_value).then(updated_prefs => {
			setAlerts(section && name? {[section]: {[name]: name + " saved"}} : {[section]: section + " saved"} );
			setErrors(section && name? {[section]: {[name]: undefined }} : { [section]: undefined } );
		}).catch(e => {
			setAlerts(section && name? {[section]: {[name]: undefined }} : {[section]: undefined} );
			setErrors(section && name? {[section]: {[name]: e.msg}} : {[section]: e.msg} );
		});
	};


	return (
	<Card>
		<GridContainer className="px-8">
			<GridItem xs={12} className="mb-2">
				<Typography variant="h3">This website uses cookies</Typography>
			</GridItem>

			<GridItem xs={12} className="mb-2">
				<Typography variant="body2">{app.settings.legal["cookies-consent"]}</Typography>
			</GridItem>

			<GridContainer className="px-0">
				
				<GridItem xs={12} className="mb-2">
					<CheckboxInput
						name="necessary"
						label="Necessary"
						defaultValue={preferences["necessary"]}
						onChange={handleOnChange("necessary")}
						helperText={alerts["necessary"]}
						disabled={loading["necessary"]}
						error={errors["necessary"]}
						required
					/>
				</GridItem>

				<GridItem xs={12} className="mb-2">
					<CheckboxInput
						name="statistics"
						label="Statistics"
						defaultValue={preferences["statistics"]}
						onChange={handleOnChange("statistics")}
						helperText={alerts["statistics"]}
						disabled={loading["statistics"]}
						error={errors["statistics"]}
					/>
				</GridItem>

				<GridItem xs={12} className="mb-2">
					<CheckboxInput
						name="preferences"
						label="Preferences"
						defaultValue={preferences["preferences"]}
						onChange={handleOnChange("preferences")}
						helperText={alerts["preferences"]}
						disabled={loading["preferences"]}
						error={errors["preferences"]}
					/>
				</GridItem>

				<GridItem xs={12} className="mb-2">
					<CheckboxInput
						name="marketing"
						label="Marketing"
						defaultValue={preferences["marketing"]}
						onChange={handleOnChange("marketing")}
						helperText={alerts["marketing"]}
						disabled={loading["marketing"]}
						error={errors["marketing"]}
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

export default withErrorHandler(connect(mapStateToProps, {})(React.memo(Widget)));
