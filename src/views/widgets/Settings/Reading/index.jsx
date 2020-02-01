import React, { useState, useEffect } from "react";
import Typography from '@material-ui/core/Typography';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { TextInput, CheckboxInput } from "components/FormInputs";
import { withSettingsContext } from "contexts/Settings";




function Widget(props) {
	let [state, setState] = useState(props);
	let [settings, setSettings] = useState(state.settingsContext.settings.reading);
	let [alerts, setAlerts] = useState({});
	useEffect(() => {  setState(props); }, [props]);
	useEffect(() => {  setSettings(props.settingsContext.settings.reading); }, [props.settingsContext.settings.reading]);


	const handleOnChange = name => async value => {	
		let new_value = {...settings, [name]: value};	
		state.settingsContext.updateSettings("Reading", new_value).then(newContext => {
			setAlerts({...alerts, [name.variablelize("-")]: name+" saved"});
		});
	}


	return (
			<GridContainer className="px-2">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h3"> Reading settings</Typography>
				</GridItem>

				<GridItem xs={12} className="mb-4">
					<CheckboxInput
						name="enable-blog"
						label="Enable blog"
						defaultValue={settings["enable-blog"]}
						onChange={handleOnChange("Enable blog")}
						helperText={alerts["enable-blog"]}
					/>
				</GridItem>

				<GridItem xs={12} className="mb-4">
					<CheckboxInput
						name="enable-press"
						label="Enable press"
						defaultValue={settings["enable-press"]}
						onChange={handleOnChange("Enable press")}
						helperText={alerts["enable-press"]}
					/>
				</GridItem>

				<GridItem xs={12} className="mb-4">
					<CheckboxInput
						name="enable-faq"
						label="Enable FAQ"
						defaultValue={settings["enable-faq"]}
						onChange={handleOnChange("Enable faq")}
						helperText={alerts["enable-faq"]}
					/>
				</GridItem>	
			</GridContainer>
	);


}


export default withSettingsContext(Widget);
