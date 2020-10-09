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

	const handleOnTextChange = name => async (value, event) => {
		setAlerts({...alerts, [name] : ""});
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
					onBlur={handleOnTextChange("message")}
					helperText={alerts["message"]}
					disabled={loading["message"]}
					error={errors["message"]}
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<CheckboxInput
					name="commission-embarkment"
					label="Commission Embarkment enabled"
					defaultValue={context_settings["commission-embarkment"]}
					onChange={handleOnChange("commission-embarkment")}
					helperText={alerts["commission-embarkment"]}
					disabled={loading["commission-embarkment"]}
					error={errors["commission-embarkment"]}
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<CheckboxInput
					name="response-submission"
					label="Response submission enabled"
					defaultValue={context_settings["response-submission"]}
					onChange={handleOnChange("response-submission")}
					helperText={alerts["response-submission"]}
					disabled={loading["response-submission"]}
					error={errors["response-submission"]}
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<CheckboxInput
					name="user-registration"
					label="User registration enabled"
					defaultValue={context_settings["user-registration"]}
					onChange={handleOnChange("user-registration")}
					helperText={alerts["user-registration"]}
					disabled={loading["user-registration"]}
					error={errors["user-registration"]}
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<CheckboxInput
					name="new-logins"
					label="New logins enabled"
					defaultValue={context_settings["new-logins"]}
					onChange={handleOnChange("new-logins")}
					helperText={alerts["new-logins"]}
					disabled={loading["new-logins"]}
					error={errors["new-logins"]}
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<CheckboxInput
					name="oath2-logins"
					label="OAth-2.0 logins enabled"
					defaultValue={context_settings["oath2-logins"]}
					onChange={handleOnChange("oath2-logins")}
					helperText={alerts["oath2-logins"]}
					disabled={loading["oath2-logins"]}
					error={errors["oath2-logins"]}
				/>
			</GridItem>
		</GridContainer>
	);
}

const mapStateToProps = state => ({
	app: state.app,
});

export default connect(mapStateToProps, {})(React.memo(Widget));
