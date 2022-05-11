import React, { /*useEffect,*/ useState } from "react";
import { connect } from "react-redux"
import Typography from "@mui/material/Typography"
import { TextInput, WysiwygInput } from "components/FormInputs"
import Grid from '@mui/material/Grid'


function Widget(props) {
	let {
		app: { settings },
	} = props

	return (
		<Grid container className="px-2">
			<Grid item  xs={12} className="mb-2">
				<Typography variant="h3"> Contact settings</Typography>
			</Grid>

			{/* <Grid item  xs={12} className="mb-4">
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
			</Grid>

			<Grid item  xs={12} className="mb-4">
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
			</Grid>

			<Grid item  xs={12} className="mb-4">
				<WysiwygInput
					name="address"
					label="Address"
					defaultValue={context_settings["address"]}
					onChange={handleOnChange("address")}
					helperText={alerts["address"]}
					disabled={loading["addres"]}
					error={errors["address"]}
				/>
			</Grid> */}
		</Grid>
	)
}

const mapStateToProps = state => ({
	app: state.app,
});

export default connect(mapStateToProps, {})(React.memo(Widget));
