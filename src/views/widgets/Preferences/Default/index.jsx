/** @format */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { CheckboxInput, RadioInput, TextInput, SelectInput } from "components/FormInputs";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { useGlobals } from "contexts/Globals";
import { withErrorHandler } from "hoc/ErrorHandler";
import { locales } from "config";


function Widget(props) {	

	const { app } = props;

	const { updatePreferences } = useGlobals();

	let [alerts, setAlerts] = useState({});
	let [errors, setErrors] = useState({});
	let [loading, setLoading] = useState({});

	

	let preferences = app.preferences;
	

	const handleOnChange = (name) => async value => {
		setAlerts({[name]: undefined });
		setErrors({...errors, [name]: undefined });
		setLoading({...loading, [name]: true });
		let new_value = value;
		console.log("new_value", new_value);

		updatePreferences(name, new_value).then(updated_prefs => {
			setAlerts({[name]: name + " saved"});
			setErrors({...errors, [name]: false });
			setLoading({...loading, [name]: false });
		}).catch(e => {
			setAlerts({[name]: undefined });
			setErrors({...errors, [name]: e.msg });
			setLoading({...loading, [name]: false });
		});
	};

	return (
		<GridContainer className="px-2">
			<GridItem xs={12} className="mb-2">
				<Typography variant="h3"> Preferences</Typography>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<RadioInput
					name="theme"
					label="Theme"
					defaultValue={preferences.theme}
					onChange={handleOnChange("theme")}
					helperText={alerts["theme"]}
					options={{"light" : "Light", "dark": "Dark"}}
					disabled={loading["theme"]}
					error={errors["theme"]}
					required
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<SelectInput
					name="locale"
					label="Locale"
					defaultValue={preferences.locale}
					onChange={handleOnChange("locale")}
					helperText={alerts["locale"]}
					options={locales}
					disabled={loading["locale"]}
					error={errors["locale"]}
					required
				/>
			</GridItem>

			
		</GridContainer>
	);
}
const mapStateToProps = state => ({
	auth: state.auth,
	app: state.app,
});

export default withErrorHandler(connect(mapStateToProps, {})(React.memo(Widget)));
