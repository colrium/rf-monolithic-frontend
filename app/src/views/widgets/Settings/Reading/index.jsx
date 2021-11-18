import React, { /*useEffect,*/ useState } from "react";
import { connect } from "react-redux";
import { useGlobals } from "contexts/Globals";

import Typography from "@mui/material/Typography";
import { CheckboxInput } from "components/FormInputs";
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

	let context_settings = settings.reading;

	const handleOnChange = name => async value => {
		setLoading({ ...loading, [name]: true });
		setErrors({ ...errors, [name]: false });
		let new_value = { ...context_settings, [name]: value };
		updateSettings("reading", new_value).then(new_settings => {
			setLoading({ ...loading, [name]: false });
			setAlerts({ [name]: name.humanize() + " saved", });
		}).catch(e => {
			setLoading({ ...loading, [name]: false });
			setErrors({ ...errors, [name]: e.msg });
		});
	};

	return (
		<GridContainer className="px-2">
			<GridItem xs={12} className="mb-2">
				<Typography variant="h3"> Reading settings</Typography>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<CheckboxInput
					name="enable-blog"
					label="Enable blog"
					defaultValue={context_settings["enable-blog"]}
					onChange={handleOnChange("enable-blog")}
					helperText={alerts["enable-blog"]}
					disabled={loading["enable-blog"]}
					error={errors["enable-blog"]}
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<CheckboxInput
					name="enable-press"
					label="Enable press"
					defaultValue={context_settings["enable-press"]}
					onChange={handleOnChange("enable-press")}
					helperText={alerts["enable-press"]}
					disabled={loading["enable-press"]}
					error={errors["enable-press"]}
				/>
			</GridItem>

			<GridItem xs={12} className="mb-4">
				<CheckboxInput
					name="enable-faq"
					label="Enable FAQ"
					defaultValue={context_settings["enable-faq"]}
					onChange={handleOnChange("enable-faq")}
					helperText={alerts["enable-faq"]}
					disabled={loading["enable-faq"]}
					error={errors["enable-faq"]}
				/>
			</GridItem>
		</GridContainer>
	);
}

const mapStateToProps = state => ({
	app: state.app,
});

export default connect(mapStateToProps, {})(React.memo(Widget));
