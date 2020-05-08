import React, { /*useEffect,*/ useState } from "react";
import { connect } from "react-redux";
import { useGlobals } from "contexts/Globals";

import Typography from "@material-ui/core/Typography";
import { TextInput } from "components/FormInputs";
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

	let context_settings = settings.general;

	const handleOnChange = name => async value => {
		setLoading({...loading, [name] : true});
		setErrors({...errors, [name] : false});
		let new_value = { ...context_settings, [name]: value };
		updateSettings("general", new_value).then(new_settings => {
			setLoading({...loading, [name] : false});
			setAlerts({ [name]: name.humanize() + " saved", });
		}).catch(e => {
			setLoading({...loading, [name] : false});
			setErrors({...errors, [name] : e.msg});
			console.error("update general settings error", e);
		});
	};

	return (
		<GridContainer className="px-2">
			<GridItem xs={12} className="mb-2">
				<Typography variant="h3"> General settings</Typography>
			</GridItem>

			<GridItem xs={12}>
				<TextInput
					name="seo-title"
					label="SEO title"
					type="text"
					defaultValue={context_settings["seo-title"]}
					onChange={handleOnChange("seo-title")}
					helperText={alerts["seo-title"]}
					disabled={loading["seo-title"]}
					error={errors["seo-title"]}
					required
				/>
			</GridItem>

			<GridItem xs={12}>
				<TextInput
					name="seo-tagline"
					label="SEO tagline"
					type="text"
					multiline
					rows="6"
					defaultValue={context_settings["seo-tagline"]}
					onChange={handleOnChange("seo-tagline")}
					helperText={alerts["seo-tagline"]}
					disabled={loading["seo-tagline"]}
					error={errors["seo-tagline"]}
					required
				/>
			</GridItem>

			<GridItem xs={12}>
				<TextInput
					name="copyright"
					label="Copyright"
					type="text"
					defaultValue={context_settings["copyright"]}
					onChange={handleOnChange("copyright")}
					helperText={alerts["copyright"]}
					disabled={loading["copyright"]}
					error={errors["copyright"]}
					required
				/>
			</GridItem>

			<GridItem xs={12}>
				<TextInput
					name="trademark"
					label="Trademark"
					type="text"
					defaultValue={context_settings["trademark"]}
					onChange={handleOnChange("trademark")}
					helperText={alerts["trademark"]}
					disabled={loading["trademark"]}
					error={errors["trademark"]}
					required
				/>
			</GridItem>
		</GridContainer>
	);
}

const mapStateToProps = state => ({
	app: state.app,
});

export default connect(mapStateToProps, {})(React.memo(Widget));
