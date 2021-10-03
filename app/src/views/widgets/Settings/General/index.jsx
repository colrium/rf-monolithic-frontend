import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useGlobals } from "contexts/Globals";

import Typography from "@material-ui/core/Typography";
import { TextInput, RadioInput } from "components/FormInputs";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";

function Widget(props) {
	let [state, setState] = useState(props);
	useEffect(() => {
		setState(props);
	}, [props]);

	let [alerts, setAlerts] = useState({});	
	let [loading, setLoading] = useState({});
	let [errors, setErrors] = useState({});

	
	let { app: { settings } } = state;
	const { updateSettings } = useGlobals();

	let context_settings = settings.general;

	const handleOnChange = name => async (value, event) => {
		setAlerts({...alerts, [name] : ""});
		setLoading({...loading, [name] : true});
		setErrors({...errors, [name] : false});
		let new_value = { ...context_settings, [name]: value };
		updateSettings("general", new_value).then(new_settings => {
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
				<Typography variant="h3"> General settings</Typography>
			</GridItem>

			<GridItem xs={12}>
				<TextInput
					name="seo-title"
					label="SEO title"
					type="text"
					defaultValue={context_settings["seo-title"]}
					onBlur={handleOnChange("seo-title")}
					helperText={alerts["seo-title"]}
					loading={loading["seo-title"]}
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
					onBlur={handleOnChange("seo-tagline")}
					helperText={alerts["seo-tagline"]}
					loading={loading["seo-tagline"]}
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
					onBlur={handleOnChange("copyright")}
					helperText={alerts["copyright"]}
					loading={loading["copyright"]}
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
					onBlur={handleOnChange("trademark")}
					helperText={alerts["trademark"]}
					loading={loading["trademark"]}
					error={errors["trademark"]}
					required
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<RadioInput
					name="landing-page-routing"
					label="Landing page routing"
					defaultValue={context_settings["landing-page-routing"]}
					onChange={handleOnChange("landing-page-routing")}
					helperText={alerts["landing-page-routing"]}
					options={{"sections" : "Sections", "pages": "Pages"}}
					disabled={loading["landing-page-routing"]}
					error={errors["landing-page-routing"]}
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
