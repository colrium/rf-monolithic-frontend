import React, { /*useEffect,*/ useState } from "react";
import { connect } from "react-redux";
import { useGlobals } from "contexts/Globals";

import Typography from "@material-ui/core/Typography";
import { CheckboxInput, TextInput } from "components/FormInputs";
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

	let context_settings = settings.mobile;

	const handleOnChange = name => async value => {
		setLoading({...loading, [name] : true});
		setErrors({...errors, [name] : false});
		let new_value = { ...context_settings, [name]: value };
		updateSettings("mobile", new_value).then(new_settings => {
			setLoading({...loading, [name] : false});
			setAlerts({ [name]: name.humanize() + " saved", });
		}).catch(e => {
			setLoading({...loading, [name] : false});
			setErrors({...errors, [name] : e.msg});
			console.error("update mobile settings error", e);
		});
	};

	return (
		<GridContainer className="px-2">
			<GridItem xs={12} className="mb-2">
				<Typography variant="h3"> Mobile application settings</Typography>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<CheckboxInput
					name="enabled"
					label="Enabled"
					defaultValue={context_settings["enabled"]}
					onChange={handleOnChange("enabled")}
					helperText={alerts["enabled"]}
					disabled={loading["enabled"]}
					error={errors["enabled"]}
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<CheckboxInput
					name="show-message"
					label="Show message"
					defaultValue={context_settings["show-message"]}
					onChange={handleOnChange("show-message")}
					helperText={alerts["show-message"]}
					disabled={loading["show-message"]}
					error={errors["show-message"]}
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<TextInput
					name="message"
					label="Message"
					type="text"
					multiline
					rows="6"
					defaultValue={context_settings["message"]}
					onChange={handleOnChange("message")}
					helperText={alerts["message"]}
					disabled={loading["message"]}
					error={errors["message"]}
				/>
			</GridItem>
		</GridContainer>
	);
}

const mapStateToProps = state => ({
	app: state.app,
});

export default connect(mapStateToProps, {})(React.memo(Widget));
