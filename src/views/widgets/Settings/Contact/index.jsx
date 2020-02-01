import React, { useState, useEffect } from "react";
import Typography from '@material-ui/core/Typography';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { TextInput, WysiwygInput } from "components/FormInputs";
import { withSettingsContext } from "contexts/Settings";




function Widget(props) {
	let [state, setState] = useState(props);
	let [alerts, setAlerts] = useState({});
	let [settings, setSettings] = useState(state.settingsContext.settings.contact? state.settingsContext.settings.contact : {} );
	useEffect(() => {  setState(props); }, [props]);


	const handleOnChange = name => async value => {		
		let new_value = { ...settings, [name]: value };	
		state.settingsContext.updateSettings("Contact", new_value).then(newContext => {
			setAlerts({...alerts, [name.variablelize("-")]: name+" saved"});
		});
	}


	return (
			<GridContainer className="px-2">

				<GridItem xs={12} className="mb-2">
					<Typography variant="h3"> Contact settings</Typography>
				</GridItem>
				
				<GridItem xs={12} className="mb-4">
					<TextInput
						type="text"
						name="phone"
						label="Phone"
						defaultValue={settings["phone"]}
						onChange={handleOnChange("Phone")}
						helperText={alerts["phone"]}
					/>
				</GridItem>

				<GridItem xs={12} className="mb-4">
					<TextInput
						type="email"
						name="email"
						label="Email"
						defaultValue={settings["email"]}
						onChange={handleOnChange("Email")}
						helperText={alerts["email"]}
						validate
					/>
				</GridItem>

				<GridItem xs={12} className="mb-4">
					<WysiwygInput
						name="address"
						label="Address"
						defaultValue={settings["address"]}
						onChange={handleOnChange("Address")}
						helperText={alerts["address"]}
					/>
				</GridItem>

			</GridContainer>
	);


}


export default withSettingsContext(Widget);
