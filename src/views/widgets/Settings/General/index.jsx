import React, { useState, useEffect } from "react";
import Typography from '@material-ui/core/Typography';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { TextInput } from "components/FormInputs";
import { withSettingsContext } from "contexts/Settings";




function Widget(props) {
	let [state, setState] = useState(props);
	let [settings, setSettings] = useState(state.settingsContext.settings.general? state.settingsContext.settings.general : {} );
	let [alerts, setAlerts] = useState({});
	useEffect(() => {  setState(props); }, [props]);
	useEffect(() => {  setSettings(props.settingsContext.settings.general); }, [props.settingsContext.settings.general]);

	const handleOnChange = name => value => {		
		let new_value = {...settings, [name]: value};	
		state.settingsContext.updateSettings("General", new_value).then(newContext => {
			setAlerts({...alerts, [name.variablelize("-")]: name+" saved"});
		});
	}


	return (
			<GridContainer className="px-2">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h3"> General settings</Typography>
				</GridItem>

				<GridItem xs={12}>
					<TextInput
						name="site-title"
						label="Site title"
						type="text"
						defaultValue={settings["site-title"]}
						onChange={handleOnChange("Site title")}
						helperText={alerts["site-title"]}						
					/>
				</GridItem>	

				<GridItem xs={12}>
					<TextInput
						name="site-tagline"
						label="Site tagline"
						type="text"
						multiline
						rows="6"
						defaultValue={settings["site-tagline"]}
						onChange={handleOnChange("Site tagline")}
						helperText={alerts["site-tagline"]}						
					/>
				</GridItem>		
			</GridContainer>
	);


}


export default withSettingsContext(Widget);
