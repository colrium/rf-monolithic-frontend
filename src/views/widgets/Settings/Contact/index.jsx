import React, { /*useEffect,*/ useState } from "react";
import { connect } from "react-redux";
import { useGlobals } from "contexts/Globals";
import Typography from "@material-ui/core/Typography";
import { TextInput, WysiwygInput } from "components/FormInputs";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { withErrorHandler } from "hoc/ErrorHandler";


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

	let context_settings = settings.contact;

	const handleOnChange = name => async value => {
		setLoading({...loading, [name] : true});
		setErrors({...errors, [name] : false});
		let new_value = { ...context_settings, [name]: value };
		updateSettings("contact", new_value).then(new_settings => {
			setLoading({...loading, [name] : false});
			setAlerts({ [name]: name.humanize() + " saved", });
		}).catch(e => {
			setLoading({...loading, [name] : false});
			setErrors({...errors, [name] : e.msg});
			console.error("update contact settings error", e);
		});
	};

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
					defaultValue={context_settings["phone"]}
					onChange={handleOnChange("phone")}
					helperText={alerts["phone"]}
					disabled={loading["phone"]}
					error={errors["phone"]}
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<TextInput
					type="email"
					name="email"
					label="Email"
					defaultValue={context_settings["email"]}
					onChange={handleOnChange("email")}
					helperText={alerts["email"]}
					disabled={loading["email"]}
					error={errors["email"]}
					validate
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<WysiwygInput
					name="address"
					label="Address"
					defaultValue={context_settings["address"]}
					onChange={handleOnChange("address")}
					helperText={alerts["address"]}
					disabled={loading["addres"]}
					error={errors["address"]}
				/>
			</GridItem>
		</GridContainer>
	);
}

const mapStateToProps = state => ({
	app: state.app,
});

export default connect(mapStateToProps, {})(React.memo(withErrorHandler(Widget)));
