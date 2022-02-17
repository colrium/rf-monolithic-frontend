import React, { /*useEffect,*/ useState } from "react";
import { connect } from "react-redux";
import { useGlobals } from "contexts/Globals";

import Typography from "@mui/material/Typography";
import { TextInput } from "components/FormInputs";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";

const socialMedias = {
	facebook: "Facebook",
	twitter: "Twitter",
	instagram: "Instagram",
	youtube: "Youtube",
	linkedin: "LinkedIn",
	whatsapp: "Whatsapp",
	google_plus: "Google+",
	pinterest: "Pinterest",
}

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

	let context_settings = settings.social;

	const handleOnChange = name => async (value, event) => {
		setLoading({ ...loading, [name]: true });
		setErrors({ ...errors, [name]: false });
		let new_value = { ...context_settings, [name]: value };
		updateSettings("social", new_value).then(new_settings => {
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
				<Typography variant="h3"> Social media</Typography>
			</GridItem>

			{Object.entries(socialMedias).map(([key, value], index) => (
				<GridItem xs={12} className="mb-4" key={"social-" + index}>
					<TextInput
						name={key}
						label={value}
						type="text"
						defaultValue={context_settings[key]}
						onBlur={handleOnChange(key)}
						helperText={alerts[key]}
						disabled={loading[key]}
						error={errors[key]}
					/>
				</GridItem>
			))}
		</GridContainer>
	);
}

const mapStateToProps = state => ({
	app: state.app,
});

export default connect(mapStateToProps, {})(React.memo(Widget));
