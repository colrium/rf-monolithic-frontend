import React, { /*useEffect,*/ useState } from "react";
import { connect } from "react-redux"

import Typography from "@mui/material/Typography"
import { WysiwygInput, TextInput } from "components/FormInputs"
import Grid from '@mui/material/Grid'


function Widget(props) {
	return (
		<Grid container className="px-2">
			<Grid item  xs={12} className="mb-2">
				<Typography variant="h3"> Legal settings</Typography>
			</Grid>

			{/* <Grid item  xs={12} className="mb-4">
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
			</Grid>

			<Grid item  xs={12} className="mb-4">
				<WysiwygInput
					name="terms-of-use"
					label="Terms of use"
					defaultValue={context_settings["terms-of-use"]}
					onChange={handleOnChange("terms-of-use")}
					helperText={alerts["terms-of-use"]}
					disabled={loading["terms-of-use"]}
					error={errors["terms-of-use"]}
				/>
			</Grid>

			<Grid item  xs={12} className="mb-4">
				<WysiwygInput
					name="end-user-agreement"
					label="End user agreement"
					defaultValue={context_settings["end-user-agreement"]}
					onChange={handleOnChange("end-user-agreement")}
					helperText={alerts["end-user-agreement"]}
					disabled={loading["end-user-agreement"]}
					error={errors["end-user-agreement"]}
				/>
			</Grid>

			<Grid item  xs={12} className="mb-4">
				<WysiwygInput
					name="privacy-policy"
					label="Privacy policy"
					defaultValue={context_settings["privacy-policy"]}
					onChange={handleOnChange("privacy-policy")}
					helperText={alerts["privacy-policy"]}
					disabled={loading["privacy-policy"]}
					error={errors["privacy-policy"]}
				/>
			</Grid> */}
		</Grid>
	)
}

const mapStateToProps = state => ({
	app: state.app,
});

export default connect(mapStateToProps, {})(React.memo(Widget));
