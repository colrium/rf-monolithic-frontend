import React, { /*useEffect,*/ useState } from "react";
import { connect } from "react-redux";
import { useGlobals } from "contexts/Globals";

import Typography from "@material-ui/core/Typography";
import { WysiwygInput, TextInput } from "components/FormInputs";
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

	let context_settings = settings.legal;

	const handleOnChange = name => async value => {
		setLoading({...loading, [name] : true});
		setErrors({...errors, [name] : false});
		let new_value = { ...context_settings, [name]: value };
		updateSettings("legal", new_value).then(new_settings => {
			setLoading({...loading, [name] : false});
			setAlerts({ [name]: name.humanize() + " saved", });
		}).catch(e => {
            setLoading({...loading, [name] : false});
            setErrors({...errors, [name] : e.msg});
        });
	};

	const handleOnBlurText = name => async (value, event) => {
		setLoading({...loading, [name] : true});
		setErrors({...errors, [name] : false});
		let new_value = { ...context_settings, [name]: value };
		updateSettings("legal", new_value).then(new_settings => {
			setLoading({...loading, [name] : false});
			setAlerts({ [name]: name.humanize() + " saved", });
		}).catch(e => {
            setLoading({...loading, [name] : false});
            setErrors({...errors, [name] : e.msg});
        });
	};

	return (
		<GridContainer className="px-2">
			<GridItem xs={12} className="mb-2">
				<Typography variant="h3"> Legal settings</Typography>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<TextInput
					name="cookies-consent"
					label="Cookies Consent"
					multiline
					rows="6"
					defaultValue={context_settings["cookies-consent"]}
					onBlur={handleOnBlurText("cookies-consent")}
					helperText={alerts["cookies-consent"]}
					disabled={loading["cookies-consent"]}
					error={errors["cookies-consent"]}
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<WysiwygInput
					name="terms-of-use"
					label="Terms of use"
					defaultValue={context_settings["terms-of-use"]}
					onChange={handleOnChange("terms-of-use")}
					helperText={alerts["terms-of-use"]}
					disabled={loading["terms-of-use"]}
					error={errors["terms-of-use"]}
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<WysiwygInput
					name="end-user-agreement"
					label="End user agreement"
					defaultValue={context_settings["end-user-agreement"]}
					onChange={handleOnChange("end-user-agreement")}
					helperText={alerts["end-user-agreement"]}
					disabled={loading["end-user-agreement"]}
					error={errors["end-user-agreement"]}
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<WysiwygInput
					name="privacy-policy"
					label="Privacy policy"
					defaultValue={context_settings["privacy-policy"]}
					onChange={handleOnChange("privacy-policy")}
					helperText={alerts["privacy-policy"]}
					disabled={loading["privacy-policy"]}
					error={errors["privacy-policy"]}
				/>
			</GridItem>


		</GridContainer>
	);
}

const mapStateToProps = state => ({
	app: state.app,
});

export default connect(mapStateToProps, {})(React.memo(Widget));
