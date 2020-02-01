import React, { useState, useEffect } from "react";
import Typography from '@material-ui/core/Typography';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { CheckboxInput } from "components/FormInputs";
import { withPreferencesContext } from "contexts/Preferences";




function Widget(props) {
	let [state, setState] = useState(props);
	let [alerts, setAlerts] = useState({});
	useEffect(() => {  setState(props); }, [props]);

	let preferences = JSON.isJSON(state.preferencesContext.preferences.dashboard)? state.preferencesContext.preferences.dashboard : {};

	const handleOnChange = name => async value => {	
		let new_value = {...preferences, [name]: value};	
		state.preferencesContext.updatePreferences("Dashboard", new_value).then(newContext => {
			setAlerts({...alerts, [name.variablelize("-")]: name+" saved"});
		});
	}

	

	return (
			<GridContainer className="px-2">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h3"> Dashboard settings</Typography>
				</GridItem>

				<GridItem xs={12} className="mb-2">
					<CheckboxInput
						name="quicklinks"
						label="Show Quicklinks"
						defaultValue={preferences["quicklinks"]}
						onChange={handleOnChange("quicklinks")}
						helperText={alerts["quicklinks"]}
					/>
				</GridItem>

				<GridItem xs={12} className="mb-2">
					<CheckboxInput
						name="static-aggregates"
						label="Show Static aggregates"
						defaultValue={preferences["static-aggregates"]}
						onChange={handleOnChange("static-aggregates")}
						helperText={alerts["static-aggregates"]}
					/>
				</GridItem>

				<GridItem xs={12} className="mb-2">
					<CheckboxInput
						name="static-map"
						label="Show Static map"
						defaultValue={preferences["static-map"]}
						onChange={handleOnChange("static-map")}
						helperText={alerts["static-map"]}
					/>
				</GridItem>

				<GridItem xs={12} className="mb-2">
					<CheckboxInput
						name="compact-aggregates"
						label="Show Compact aggregates"
						defaultValue={preferences["compact-aggregates"]}
						onChange={handleOnChange("compact-aggregates")}
						helperText={alerts["compact-aggregates"]}
					/>
				</GridItem>

				<GridItem xs={12} className="mb-2">
					<CheckboxInput
						name="compact-maps"
						label="Show Compact maps"
						defaultValue={preferences["compact-maps"]}
						onChange={handleOnChange("compact-maps")}
						helperText={alerts["compact-maps"]}
					/>
				</GridItem>

				<GridItem xs={12} className="mb-2">
					<CheckboxInput
						name="calendar"
						label="Show calendar"
						defaultValue={preferences["calendar"]}
						onChange={handleOnChange("calendar")}
						helperText={alerts["calendar"]}
					/>
				</GridItem>

				
			</GridContainer>
	);


}


export default withPreferencesContext(Widget);
