import React, { /*useEffect,*/ useState } from "react";
import { connect } from "react-redux";
import { useGlobals } from "contexts/Globals";

import Typography from "@material-ui/core/Typography";
import { TextInput, CheckboxInput } from "components/FormInputs";
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

	let context_settings = settings.mail;

	const handleOnChange = name => async (value, event) => {
		setAlerts({...alerts, [name] : ""});
		setLoading({...loading, [name] : true});
		setErrors({...errors, [name] : false});
		let new_value = { ...context_settings, [name]: value, private: true };
		updateSettings("mail", new_value).then(new_settings => {
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
				<Typography variant="h3"> Outgoing Mail SMTP Settings</Typography>
			</GridItem>

			<GridItem xs={12}>
				<TextInput
					name="smtp_host"
					label="Host"
					type="text"
					defaultValue={context_settings["smtp_host"]}
					onBlur={handleOnChange("smtp_host")}
					helperText={alerts["smtp_host"]}
					loading={loading["smtp_host"]}
					error={errors["smtp_host"]}
					validate
					required
				/>
			</GridItem>

			<GridItem xs={12}>
				<TextInput
					name="smtp_port"
					label="Port"
					type="number"
					defaultValue={context_settings["smtp_port"]}
					onBlur={handleOnChange("smtp_port")}
					helperText={alerts["smtp_port"]}
					loading={loading["smtp_port"]}
					error={errors["smtp_port"]}
					validate
					required
				/>
			</GridItem>

			<GridItem xs={12}>
				<CheckboxInput
					name="smtp_tls_ssl"
					label="TLS/SSL"
					defaultValue={context_settings["smtp_tls_ssl"]}
					onChange={handleOnChange("smtp_tls_ssl")}
					helperText={alerts["smtp_tls_ssl"]}
					disabled={loading["smtp_tls_ssl"]}
					validate
					error={errors["smtp_tls_ssl"]}
				/>
			</GridItem>

			<GridItem xs={12}>
				<TextInput
					name="smtp_user"
					label="User"
					type="email"
					defaultValue={context_settings["smtp_user"]}
					onBlur={handleOnChange("smtp_user")}
					helperText={alerts["smtp_user"]}
					loading={loading["smtp_user"]}
					error={errors["smtp_user"]}
					placeholder={"user@example.com"}
					autoComplete='off'
					validate
					required					
				/>
			</GridItem>

			<GridItem xs={12}>
				<TextInput
					name="smtp_password"
					label="Password"
					type="password"
					defaultValue={context_settings["smtp_password"]}
					onBlur={handleOnChange("smtp_password")}
					helperText={alerts["smtp_password"]}
					loading={loading["smtp_password"]}
					error={errors["smtp_password"]}
					placeholder={"user@example.com"}
					autoComplete="new-password"
					excludeValidation={["password"]}
					validate
					required
				/>
			</GridItem>

			<GridItem xs={12}>
				<TextInput
					name="smtp_sender_name"
					label="Sender Name"
					type="text"
					defaultValue={context_settings["smtp_sender_name"]}
					onBlur={handleOnChange("smtp_sender_name")}
					helperText={alerts["smtp_sender_name"]? alerts["smtp_sender_name"] : "Sender's email address's name substitute that will appear on receipient email inbox listing."}
					loading={loading["smtp_sender_name"]}
					error={errors["smtp_sender_name"]}
					placeholder={"Name of Sender"}
					validate
				/>
			</GridItem>
		</GridContainer>
	);
}

const mapStateToProps = state => ({
	app: state.app,
});

export default connect(mapStateToProps, {})(React.memo(Widget));
