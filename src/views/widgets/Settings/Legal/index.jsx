import React, { useState, useEffect } from "react";
import Typography from '@material-ui/core/Typography';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { WysiwygInput } from "components/FormInputs";
import { withSettingsContext } from "contexts/Settings";




function Widget(props) {
	let [state, setState] = useState(props);
	let [alerts, setAlerts] = useState({});
	let [settings, setSettings] = useState(state.settingsContext.settings.legal);

	useEffect(() => {  setState(props); }, [props]);
	useEffect(() => {  setSettings(props.settingsContext.settings.legal); }, [props.settingsContext.settings.legal]);

	const handleOnChange = name => async value => {		
		let new_value = {...settings, [name]: value};	
		state.settingsContext.updateSettings("Legal", new_value).then(newContext => {
			setAlerts({...alerts, [name.variablelize("-")]: name+" saved"});
		});
	}


	return (
			<GridContainer className="px-2">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h3"> Legal settings</Typography>
				</GridItem>

				<GridItem xs={12} className="mb-4">
					<WysiwygInput
						name="terms-of-use"
						label="Terms of use"
						defaultValue={settings["terms-of-use"]}
						onChange={handleOnChange("Terms of use")}
						helperText={alerts["terms-of-use"]}
					/>
				</GridItem>

				<GridItem xs={12} className="mb-4">
					<WysiwygInput
						name="end-user-agreement"
						label="End user agreement"
						defaultValue={settings["end-user-agreement"]}
						onChange={handleOnChange("End user agreement")}
						helperText={alerts["end-user-agreement"]}
					/>
				</GridItem>

				<GridItem xs={12} className="mb-4">
					<WysiwygInput
						name="privacy-policy"
						label="Privacy policy"
						defaultValue={settings["privacy-policy"]}
						onChange={handleOnChange("Privacy policy")}
						helperText={alerts["privacy-policy"]}
					/>
				</GridItem>	

				<GridItem xs={12} className="mb-4">
					<WysiwygInput
						name="cookies-consent"
						label="Cookies Consent"
						defaultValue={settings["cookies-consent"]}
						onChange={handleOnChange("Cookies Consent")}
						helperText={alerts["cookies-consent"]}
					/>
				</GridItem>	
			</GridContainer>
	);


}


export default withSettingsContext(Widget);
