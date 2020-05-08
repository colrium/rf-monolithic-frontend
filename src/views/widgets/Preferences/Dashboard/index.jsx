/** @format */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { CheckboxInput, RadioInput, TextInput, SelectInput } from "components/FormInputs";
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

	

	let preferences = app.preferences.dashboard;
	console.log("theme", theme);
	

	const handleOnChange = (section, name=false) => async value => {
		let new_value = section && name? {...preferences, [section]: { ...preferences[section],  [name]: value }} : {...preferences, [section]: value };
		console.log("preferences", preferences);
		console.log("new_value", new_value);

		updatePreferences("dashboard", new_value).then(updated_prefs => {
			setAlerts(section && name? {[section]: {[name]: name + " saved"}} : {[section]: section + " saved"} );
			setErrors(section && name? {[section]: {[name]: undefined }} : { [section]: undefined } );
		}).catch(e => {
			setAlerts(section && name? {[section]: {[name]: undefined }} : {[section]: undefined} );
			setErrors(section && name? {[section]: {[name]: e.msg}} : {[section]: e.msg} );
		});
	};

	return (
	<Card>
		<GridContainer className="px-2">
			<GridItem xs={12} className="mb-2">
				<Typography variant="h3"> Dashboard settings</Typography>
			</GridItem>

			<GridContainer className="px-0">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h5" color="accent">Layout</Typography>
				</GridItem>
				<GridItem xs={12} className="mb-4">
					<RadioInput
						name="view"
						label="View"
						defaultValue={preferences["view"]}
						onChange={handleOnChange("view")}
						helperText={alerts["view"]}
						options={{"default" : "Default", "tabs": "Tabs"}}
						disabled={loading["view"]}
						error={errors["view"]}
						required
					/>
				</GridItem>
			</GridContainer>

			<GridContainer className="px-0">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h5" color="accent">Map</Typography>
				</GridItem>
				<GridItem xs={12}>
					<CheckboxInput
						name="map_visible"
						label="Visible"
						defaultValue={preferences.map.visible}
						onChange={handleOnChange("map", "visible")}
						helperText={alerts.map? alerts.map.visible : undefined }
					/>
				</GridItem>
				<GridItem xs={12}>
					<RadioInput
						name="map_type"
						label="Type"
						defaultValue={preferences.map.type}
						onChange={handleOnChange("map", "type")}
						options={{"static" : "Static", "dynamic": "Dynamic"}}
						helperText={alerts.map? alerts.map.type : undefined }
						required
					/>
				</GridItem>
				<GridItem xs={12}>
					<SelectInput
						name="map_width"
						label="Width"
						defaultValue={preferences.map.width}
						onChange={handleOnChange("map", "width")}
						options={{"3" : "1/4", "6": "1/2", "9": "3/4", "12": "Full"}}
						helperText={alerts.map? alerts.map.width : undefined }
						required
					/>
				</GridItem>
			</GridContainer>

			<GridContainer className="px-0">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h5" color="accent">Charts</Typography>
				</GridItem>
				<GridItem xs={12}>
					<CheckboxInput
						name="charts_visible"
						label="Visible"
						defaultValue={preferences.charts.visible}
						onChange={handleOnChange("charts", "visible")}
						helperText={alerts.charts? alerts.charts.visible : undefined }
					/>
				</GridItem>
				<GridItem xs={12}>
					<RadioInput
						name="charts_type"
						label="Type"
						defaultValue={preferences.charts.type}
						onChange={handleOnChange("charts", "type")}
						options={{"static" : "Static", "dynamic": "Dynamic"}}
						helperText={alerts.charts? alerts.charts.type : undefined }
						required
					/>
				</GridItem>
				<GridItem xs={12}>
					<SelectInput
						name="charts_width"
						label="Width"
						defaultValue={preferences.charts.width}
						onChange={handleOnChange("charts", "width")}
						options={{"3" : "1/4", "6": "1/2", "9": "3/4", "12": "Full"}}
						helperText={alerts.charts? alerts.charts.width : undefined }
						required
					/>
				</GridItem>
			</GridContainer>

			<GridContainer className="px-0">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h5" color="accent">Shortcuts</Typography>
				</GridItem>
				<GridItem xs={12}>
					<CheckboxInput
						name="actions_visible"
						label="Visible"
						defaultValue={preferences.actions.visible}
						onChange={handleOnChange("actions", "visible")}
						helperText={alerts.actions? alerts.actions.visible : undefined }
					/>
				</GridItem>
				<GridItem xs={12}>
					<SelectInput
						name="actions_width"
						label="Width"
						defaultValue={preferences.actions.width}
						onChange={handleOnChange("actions", "width")}
						options={{"3" : "1/4", "6": "1/2", "9": "3/4", "12": "Full"}}
						helperText={alerts.actions? alerts.actions.width : undefined }
						required
					/>
				</GridItem>
			</GridContainer>


			<GridContainer className="px-0">
				<GridItem xs={12} className="mb-2">
					<Typography variant="h5" color="accent">Calendar</Typography>
				</GridItem>
				<GridItem xs={12}>
					<CheckboxInput
						name="timeline_visible"
						label="Visible"
						defaultValue={preferences.timeline.visible}
						onChange={handleOnChange("timeline", "visible")}
						helperText={alerts.timeline? alerts.timeline.visible : undefined }
					/>
				</GridItem>
				<GridItem xs={12}>
					<SelectInput
						name="actions_width"
						label="Width"
						defaultValue={preferences.timeline.width}
						onChange={handleOnChange("timeline", "width")}
						options={{"3" : "1/4", "6": "1/2", "9": "3/4", "12": "Full"}}
						helperText={alerts.timeline? alerts.timeline.width : undefined }
						required
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
