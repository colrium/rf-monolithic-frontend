import React, { /*useEffect,*/ useState } from "react";
import { connect } from "react-redux"

import Typography from "@mui/material/Typography"
import { CheckboxInput, TextInput } from "components/FormInputs"
import Grid from '@mui/material/Grid'


function Widget(props) {
	return (
		<Grid container className="px-2">
			<Grid item  xs={12} className="mb-2">
				<Typography variant="h3"> Mobile application settings</Typography>
			</Grid>

			{/* <Grid item  xs={12} className="mb-4">
				<CheckboxInput
					name="enabled"
					label="Enabled"
					defaultValue={context_settings["enabled"]}
					onChange={handleOnChange("enabled")}
					helperText={alerts["enabled"]}
					disabled={loading["enabled"]}
					error={errors["enabled"]}
				/>
			</Grid>

			<Grid item  xs={12} className="mb-4">
				<CheckboxInput
					name="show-message"
					label="Show message"
					defaultValue={context_settings["show-message"]}
					onChange={handleOnChange("show-message")}
					helperText={alerts["show-message"]}
					disabled={loading["show-message"]}
					error={errors["show-message"]}
				/>
			</Grid>

			<Grid item  xs={12} className="mb-4">
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
			</Grid>

			<Grid item  xs={12} className="mb-4">
				<CheckboxInput
					name="commission-embarkment"
					label="Commission Embarkment enabled"
					defaultValue={context_settings["commission-embarkment"]}
					onChange={handleOnChange("commission-embarkment")}
					helperText={alerts["commission-embarkment"]}
					disabled={loading["commission-embarkment"]}
					error={errors["commission-embarkment"]}
				/>
			</Grid>

			<Grid item  xs={12} className="mb-4">
				<CheckboxInput
					name="response-submission"
					label="Response submission enabled"
					defaultValue={context_settings["response-submission"]}
					onChange={handleOnChange("response-submission")}
					helperText={alerts["response-submission"]}
					disabled={loading["response-submission"]}
					error={errors["response-submission"]}
				/>
			</Grid>

			<Grid item  xs={12} className="mb-4">
				<CheckboxInput
					name="user-registration"
					label="User registration enabled"
					defaultValue={context_settings["user-registration"]}
					onChange={handleOnChange("user-registration")}
					helperText={alerts["user-registration"]}
					disabled={loading["user-registration"]}
					error={errors["user-registration"]}
				/>
			</Grid>

			<Grid item  xs={12} className="mb-4">
				<CheckboxInput
					name="new-logins"
					label="New logins enabled"
					defaultValue={context_settings["new-logins"]}
					onChange={handleOnChange("new-logins")}
					helperText={alerts["new-logins"]}
					disabled={loading["new-logins"]}
					error={errors["new-logins"]}
				/>
			</Grid>

			<Grid item  xs={12} className="mb-4">
				<CheckboxInput
					name="oath2-logins"
					label="OAth-2.0 logins enabled"
					defaultValue={context_settings["oath2-logins"]}
					onChange={handleOnChange("oath2-logins")}
					helperText={alerts["oath2-logins"]}
					disabled={loading["oath2-logins"]}
					error={errors["oath2-logins"]}
				/>
			</Grid> */}
		</Grid>
	)
}

const mapStateToProps = state => ({
	app: state.app,
});

export default connect(mapStateToProps, {})(React.memo(Widget));
