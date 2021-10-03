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

	

	let preferences = app.preferences.subscriptions;
	

	const handleOnChange = (section, name=false) => async value => {
		let new_value = section && name? {...preferences, [section]: { ...preferences[section],  [name]: value }} : {...preferences, [section]: value };
		

		updatePreferences("subscriptions", new_value).then(updated_prefs => {
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
				<Typography variant="h3">Subscriptions</Typography>
			</GridItem>

			<GridContainer className="px-0">
				
				<GridItem xs={12} className="mb-2">
					<CheckboxInput
						name="newsletter"
						label="Newsletter"
						defaultValue={preferences["newsletter"]}
						onChange={handleOnChange("newsletter")}
						helperText={alerts["newsletter"]}
						disabled={loading["newsletter"]}
						error={errors["newsletter"]}
					/>
				</GridItem>

				<GridItem xs={12} className="mb-2">
					<CheckboxInput
						name="posts"
						label="Blog posts"
						defaultValue={preferences["posts"]}
						onChange={handleOnChange("posts")}
						helperText={alerts["posts"]}
						disabled={loading["posts"]}
						error={errors["posts"]}
					/>
				</GridItem>

				<GridItem xs={12} className="mb-2">
					<CheckboxInput
						name="updates"
						label="Updates"
						defaultValue={preferences["updates"]}
						onChange={handleOnChange("updates")}
						helperText={alerts["updates"]}
						disabled={loading["updates"]}
						error={errors["updates"]}
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
