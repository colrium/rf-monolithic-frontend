import React, { /*useEffect,*/ useState } from "react";
import { connect } from "react-redux"

import Typography from "@mui/material/Typography"
import { CheckboxInput } from "components/FormInputs"
import Grid from '@mui/material/Grid'


function Widget(props) {
	return (
		<Grid container className="px-2">
			<Grid item  xs={12} className="mb-2">
				<Typography variant="h3"> Reading settings</Typography>
			</Grid>

			{/* <Grid item  xs={12} className="mb-4">
				<CheckboxInput
					name="enable-blog"
					label="Enable blog"
					defaultValue={context_settings["enable-blog"]}
					onChange={handleOnChange("enable-blog")}
					helperText={alerts["enable-blog"]}
					disabled={loading["enable-blog"]}
					error={errors["enable-blog"]}
				/>
			</Grid>

			<Grid item  xs={12} className="mb-4">
				<CheckboxInput
					name="enable-press"
					label="Enable press"
					defaultValue={context_settings["enable-press"]}
					onChange={handleOnChange("enable-press")}
					helperText={alerts["enable-press"]}
					disabled={loading["enable-press"]}
					error={errors["enable-press"]}
				/>
			</Grid>

			<Grid item  xs={12} className="mb-4">
				<CheckboxInput
					name="enable-faq"
					label="Enable FAQ"
					defaultValue={context_settings["enable-faq"]}
					onChange={handleOnChange("enable-faq")}
					helperText={alerts["enable-faq"]}
					disabled={loading["enable-faq"]}
					error={errors["enable-faq"]}
				/>
			</Grid> */}
		</Grid>
	)
}

const mapStateToProps = state => ({
	app: state.app,
});

export default connect(mapStateToProps, {})(React.memo(Widget));
