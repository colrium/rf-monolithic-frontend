/** @format */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { RadioInput, SelectInput } from "components/FormInputs";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { useGlobals } from "contexts/Globals";
import { withErrorHandler } from "hoc/ErrorHandler";
import { locales } from "config";


function Widget({ app: {preferences} }) {	

	const { updatePreferences } = useGlobals();
	let [prefs, setPrefs] = useState(preferences);
	let [alerts, setAlerts] = useState({});
	let [errors, setErrors] = useState({});
	let [loading, setLoading] = useState({});

	useEffect(()=>{
		setPrefs(preferences);
	}, [preferences])

	
	

	const handleOnChange = (name) => async value => {
        setAlerts({[name]: undefined });
        setErrors({...errors, [name]: undefined });
        setLoading({...loading, [name]: true });
        let new_value = value;

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
					value={prefs.theme}
					onChange={handleOnChange("theme")}
					helperText={alerts["theme"]}
					options={{"light" : "Light", "dark": "Dark"}}
					disabled={loading["theme"]}
					error={errors["theme"]}
					validate
					required
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<SelectInput
					name="locale"
					label="Locale"
					value={prefs.locale}
					variant={"outlined"}
					onChange={handleOnChange("locale")}
					helperText={alerts["locale"]}
					options={locales}
					disabled={loading["locale"]}
					error={errors["locale"]}
					validate
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
