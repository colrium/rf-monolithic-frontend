import React, { /*useEffect,*/ useState } from "react";
import { connect } from "react-redux";
import { useGlobals } from "contexts/Globals";

import Typography from "@material-ui/core/Typography";
import { CheckboxInput, RadioInput, TextInput, SelectInput } from "components/FormInputs";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";

function Widget(props) {
	/*let [state, setState] = useState(props);
	useEffect(() => {
		setState(props);
	}, [props]);*/

	let [alerts, setAlerts] = useState({});	
	let [loading, setLoading] = useState({});
	let [errors, setErrors] = useState({});

	
	let { app: { settings } } = props;
	const { updateSettings } = useGlobals();

	let context_settings = settings.tracking;

	const handleOnChange = name => async value => {
		setLoading({...loading, [name] : true});
		setErrors({...errors, [name] : false});
		let new_value = { ...context_settings, [name]: value };
		updateSettings("tracking", new_value).then(new_settings => {
			setLoading({...loading, [name] : false});
			setAlerts({ [name]: name.humanize() + " saved", });
		}).catch(e => {
			setLoading({...loading, [name] : false});
			setErrors({...errors, [name] : e.msg});
			console.error("update tracking settings error", e);
		});
	};


	return (
		<GridContainer className="px-2">
			<GridItem xs={12} className="mb-2">
				<Typography variant="h3"> Location Tracking settings</Typography>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<RadioInput
					name="interval-type"
					label="Interval type"
					defaultValue={context_settings["interval-type"]}
					onChange={handleOnChange("interval-type")}
					helperText={alerts["interval-type"]}
					options={{"time" : "Time Interval", "distance": "Distance Interval"}}
					disabled={loading["interval-type"]}
					error={errors["interval-type"]}
					required
				/>
			</GridItem>


			<GridItem xs={12} className="mb-4">
				<TextInput
					name="interval"
					label={"Interval "+(context_settings["interval-type"] === "time"? "(Seconds)" : "(Meters)")}
					type="number"
					defaultValue={context_settings["interval"]}
					onChange={handleOnChange("interval")}
					helperText={alerts["interval"]}
					disabled={loading["interval"]}
					error={errors["interval"]}
					required
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<TextInput
					name="min-positions-per-track"
					label="Min number of positions per track"
					type="number"
					min={2}
					defaultValue={context_settings["min-positions-per-track"]}
					onChange={handleOnChange("min-positions-per-track")}
					helperText={alerts["min-positions-per-track"]}
					disabled={loading["min-positions-per-track"]}
					error={errors["min-positions-per-track"]}
					required
				/>
			</GridItem>

			

			<GridItem xs={12} className="mb-4">
				<TextInput
					name="max-positions-per-track"
					label="Max number of positions per track"
					type="number"
					min={3}
					defaultValue={context_settings["max-positions-per-track"]}
					onChange={handleOnChange("max-positions-per-track")}
					helperText={alerts["max-positions-per-track"]}
					disabled={loading["max-positions-per-track"]}
					error={errors["maz-positions-per-track"]}
					required
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<SelectInput
					name="trackable-time-window"
					label="Trackable time window"
					defaultValue={context_settings["trackable-time-window"]}
					onChange={handleOnChange("trackable-time-window")}
					options={{"any-time" : "Any time", "day-time": "Day time", "working-hours": "Working hours", "context-time": "Context time"}}
					disabled={loading["trackable-time-window"]}
					error={errors["trackable-time-window"]}
					required
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<CheckboxInput
					name="enforce-context-location-availability"
					label="Enforce context location availability"
					defaultValue={context_settings["enforce-context-location-availability"]}
					onChange={handleOnChange("enforce-context-location-availability")}
					helperText={alerts["enforce-context-location-availability"]}
					disabled={loading["enforce-context-location-availability"]}
					error={errors["enforce-context-location-availability"]}
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<CheckboxInput
					name="enforce-onlocation-actions"
					label="Enforce onlocation actions"
					defaultValue={context_settings["enforce-onlocation-actions"]}
					onChange={handleOnChange("enforce-onlocation-actions")}
					helperText={alerts["enforce-onlocation-actions"]}
					disabled={loading["enforce-onlocation-actions"]}
					error={errors["enforce-onlocation-actions"]}
				/>
			</GridItem>
		</GridContainer>
	);
}

const mapStateToProps = state => ({
	app: state.app,
});

export default connect(mapStateToProps, {})(React.memo(Widget));
